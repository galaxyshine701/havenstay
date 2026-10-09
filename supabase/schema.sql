-- HavenStay database schema (CLAUDE.md section 8).
-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- Then run supabase/seed.sql.

create extension if not exists btree_gist;

create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

-- PROFILES: one row per authenticated user
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  phone       text,
  created_at  timestamptz not null default now()
);

-- HOTELS
create table hotels (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text unique not null,
  name                  text not null,
  city                  text not null check (city in ('Hunza', 'Skardu', 'Islamabad')),
  address               text,
  description           text,
  image_urls            text[] not null check (array_length(image_urls, 1) >= 1),
  rating                numeric(2,1) check (rating between 0 and 5),
  review_count          int not null default 0 check (review_count >= 0),
  amenities             text[] not null default '{}',
  free_cancellation     boolean not null default true,
  cancellation_hours    int not null default 48 check (cancellation_hours >= 0),
  tax_percent           numeric(4,1) not null default 0 check (tax_percent >= 0),
  service_fee_percent   numeric(4,1) not null default 0 check (service_fee_percent >= 0),
  created_at            timestamptz not null default now()
);

-- ROOMS
create table rooms (
  id               uuid primary key default gen_random_uuid(),
  hotel_id         uuid not null references hotels(id) on delete cascade,
  name             text not null,
  capacity         int not null check (capacity >= 1),
  price_per_night  numeric(10,2) not null check (price_per_night > 0),
  image_url        text,
  created_at       timestamptz not null default now()
);
create index rooms_hotel_id_idx on rooms(hotel_id);

-- BOOKINGS
create table bookings (
  id               uuid primary key default gen_random_uuid(),
  reference        text unique not null
                     default ('HS-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8))),
  user_id          uuid not null references profiles(id) on delete restrict,
  hotel_id         uuid not null references hotels(id),
  room_id          uuid not null references rooms(id),
  check_in         date not null,
  check_out        date not null,
  guests           int  not null,
  total_price      numeric(12,2) not null default 0,
  status           booking_status not null default 'pending',
  guest_name       text not null,
  guest_email      text not null,
  guest_phone      text,
  special_requests text,
  created_at       timestamptz not null default now(),

  constraint bookings_valid_dates  check (check_out > check_in),
  constraint bookings_valid_guests check (guests >= 1),

  -- THE double-booking guard: the same room cannot have overlapping
  -- active bookings. A date-order CHECK alone does NOT prevent double bookings.
  constraint bookings_no_overlap exclude using gist (
    room_id with =,
    daterange(check_in, check_out, '[)') with &&
  ) where (status in ('pending', 'confirmed'))
);
create index bookings_user_id_idx on bookings(user_id);
create index bookings_room_dates_idx on bookings using gist (room_id, daterange(check_in, check_out, '[)'));

-- Server-side integrity trigger (8.2).
-- Guests vs capacity, past dates, hotel_id and the PRICE are set or checked by the database.
create or replace function bookings_before_insert()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  r rooms%rowtype;
  h hotels%rowtype;
  nights int;
begin
  select * into r from rooms where id = new.room_id;
  if not found then raise exception 'Room not found'; end if;

  select * into h from hotels where id = r.hotel_id;

  if new.check_in < current_date then
    raise exception 'Check-in date cannot be in the past';
  end if;
  if new.guests > r.capacity then
    raise exception 'This room sleeps at most % guests', r.capacity;
  end if;

  nights := new.check_out - new.check_in;
  new.hotel_id := r.hotel_id;
  new.total_price := round(
    r.price_per_night * nights
    * (1 + (h.tax_percent + h.service_fee_percent) / 100.0), 2);
  new.status := 'pending';
  return new;
end;
$$;

create trigger bookings_before_insert_trg
before insert on bookings
for each row execute function bookings_before_insert();

-- Profile auto-creation (8.3)
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Guest'));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Row Level Security (8.4): enabled on every table
alter table profiles enable row level security;
alter table hotels   enable row level security;
alter table rooms    enable row level security;
alter table bookings enable row level security;

-- profiles: a user sees and edits only their own row
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- hotels and rooms: public read-only (no write policies = no writes from the client)
create policy "hotels_public_read" on hotels for select using (true);
create policy "rooms_public_read"  on rooms  for select using (true);

-- bookings: a user can create and read only their own bookings
create policy "bookings_insert_own" on bookings for insert with check (auth.uid() = user_id);
create policy "bookings_select_own" on bookings for select using (auth.uid() = user_id);
-- No direct UPDATE or DELETE policy. Cancellation goes through cancel_booking() below.

-- Availability search and cancellation (8.5)
--
-- search_available_hotels and available_room_ids are SECURITY DEFINER on purpose:
-- with row level security a normal user can only see THEIR OWN bookings, so a plain
-- function would treat rooms booked by other guests as free. These functions read all
-- bookings but return only hotel/room ids, never anybody's booking details.
create or replace function search_available_hotels(
  p_city text, p_check_in date, p_check_out date, p_guests int)
returns table (hotel_id uuid, min_price numeric, available_rooms int)
language sql stable
security definer
set search_path = public
as $$
  select r.hotel_id, min(r.price_per_night), count(*)::int
  from rooms r
  join hotels h on h.id = r.hotel_id
  where h.city = p_city
    and r.capacity >= p_guests
    and not exists (
      select 1 from bookings b
      where b.room_id = r.id
        and b.status in ('pending', 'confirmed')
        and daterange(b.check_in, b.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
    )
  group by r.hotel_id;
$$;

-- Extra (used by the hotel details page): which rooms of one hotel are free for the dates.
create or replace function available_room_ids(
  p_hotel_id uuid, p_check_in date, p_check_out date)
returns table (room_id uuid)
language sql stable
security definer
set search_path = public
as $$
  select r.id
  from rooms r
  where r.hotel_id = p_hotel_id
    and not exists (
      select 1 from bookings b
      where b.room_id = r.id
        and b.status in ('pending', 'confirmed')
        and daterange(b.check_in, b.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
    );
$$;

create or replace function cancel_booking(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update bookings set status = 'cancelled'
  where id = p_booking_id
    and user_id = auth.uid()
    and status in ('pending', 'confirmed');
  if not found then raise exception 'Booking not found or cannot be cancelled'; end if;
end;
$$;

-- Only signed-in users may cancel; anyone may search availability.
revoke all on function cancel_booking(uuid) from public;
grant execute on function cancel_booking(uuid) to authenticated;
grant execute on function search_available_hotels(text, date, date, int) to anon, authenticated;
grant execute on function available_room_ids(uuid, date, date) to anon, authenticated;
