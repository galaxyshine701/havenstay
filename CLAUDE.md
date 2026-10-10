# CLAUDE.md — HavenStay

Project instructions for Claude Code. Read this file fully at the start of every session and follow it strictly.

## 1. Project Overview

**HavenStay** is a luxury boutique-hotel booking platform for northern Pakistan and the capital. It is an original design inspired by hotel booking platforms. Never copy the layout, branding, copy, or assets of Booking.com or any other real site.

Core user journey (must work end to end, with real data):
1. Search by location, check-in, check-out, guests
2. View available hotels (horizontal list)
3. Open hotel details
4. Fill in booking form
5. Submit, which stores the booking in Supabase
6. See a booking confirmation read back from Supabase

## 2. Tech Stack (no substitutions)

| Layer | Choice |
|---|---|
| Framework | React (Vite) with functional components and hooks |
| Styling | Tailwind CSS only. No other CSS framework, minimal custom CSS |
| Icons | Lucide React only |
| Backend / DB / Auth | Supabase (Postgres, Auth, RLS) via `@supabase/supabase-js` |
| Routing | React Router |
| Deploy | GitHub, then Netlify |

Commands:
- `npm install`: install dependencies
- `npm run dev`: local dev server
- `npm run build`: production build (must pass before any change is considered done)
- `npm run lint`: lint (must pass)

Environment variables (Vite):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
- Use the **anon** key only. NEVER use or mention the `service_role` key anywhere in the frontend or repo.
- `.env` must be in `.gitignore`. Commit only `.env.example` with empty values.
- On Netlify, set the same variables in Site settings → Environment variables.

## 3. Working Rules for Claude Code

1. **Inspect first.** At the start of a session, inspect the project structure (list files, read `package.json`, read this file) and summarize what exists before changing anything.
2. **Small steps.** Build one section at a time (for example: layout, then search bar, then hotel list). After each step, run `npm run build` and fix errors before moving on.
3. **Explain every change** in plain, simple language: what changed, in which file, and why. The user is learning and must understand the code.
4. **Fix errors by reading them.** When something fails, read the full error message, identify the root cause, then fix it. Do not guess or blindly rewrite files.
5. **Reusable components.** Anything used twice becomes a component (`HotelCard`, `SearchBar`, `Badge`, `Modal`, `Skeleton`, etc.) that takes props.
6. **No hardcoded booking data.** Hotels, rooms, and bookings come from Supabase. The confirmation page must read the booking from the database, not from local state alone.
7. **Never fake success.** Show a confirmation only after Supabase returns a successful insert. Show a clear error otherwise.
8. **Do not invent facts.** No fake awards, fake review quotes, or real hotel names (see Section 6).
9. **Keep the change log.** After every meaningful change, append an entry to the "Claude Code Change Log" section at the bottom of this file. This is submission evidence.

## 4. Design System

Brand feel: calm, premium, mountain-lodge luxury. Original and not a Booking.com look-alike.

Tailwind theme tokens (define in `tailwind.config.js`):
- `haven-900` deep pine `#10302B` (primary, headers, primary buttons)
- `haven-700` `#1F5148`
- `haven-50` mist `#F3F7F5` (section backgrounds)
- `sand-100` warm ivory `#FAF6EE` (page background)
- `gold-500` `#B8893B` (accent: ratings, highlights, key CTA hover)
- `ink-900` `#1B1F1E` (text), `ink-500` `#5F6B68` (secondary text)
- Success `#2E7D5B`, Error `#B3261E`

Typography:
- Headings: `Playfair Display` (serif)
- Body/UI: `Inter`
- Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48. Use no other sizes.

Spacing and shape:
- Spacing on an 8px grid (Tailwind `2, 4, 6, 8, 12, 16`)
- Cards: `rounded-2xl`, soft shadow, 1px subtle border
- Buttons: min height 44px, clear hover/focus/disabled states

Accessibility and responsiveness:
- Mobile-first. Test at 375px, 768px, 1280px. No horizontal page scroll.
- Meaningful `alt` text on all images; every input has a visible `<label>`.
- Visible keyboard focus rings; colour contrast at least WCAG AA.

## 5. UI Guidelines

### 5.1 Hotel listing: horizontal list view (mandatory)
- Hotels are shown as **horizontal cards stacked vertically**, one per row. NOT a grid of vertical cards.
- Desktop card layout: image on the left (about 288px wide), details in the middle, price + CTA on the right.
- Mobile: the card stacks (image on top) but keeps the same information order.
- Each card shows: main photo, hotel name, city, rating + review count, 2 to 3 amenity chips, trust badge(s), "from PKR X / night", and a "View details" button.

### 5.2 Sticky search bar (mandatory)
- Fields: **Location**, **Check-in**, **Check-out**, **Guests**, plus a Search button.
- Location is a dropdown limited to: Hunza, Skardu, Islamabad.
- The bar is `sticky top-0` with a high `z-index` on the home page and the results page, so it stays visible while scrolling.
- Validation: check-in cannot be in the past; check-out must be after check-in; guests is an integer from 1 to 10. Show inline error text, never an `alert()`.
- Search parameters live in the URL query string, so refresh and share still work.

### 5.3 Strict UI states (mandatory for every data-driven view)
Every view that fetches data MUST implement all four states:
1. **Loading**: skeleton placeholders that match the final layout (not a spinner alone).
2. **Empty**: friendly message plus a suggestion (for example: "No stays available for these dates. Try different dates or another destination.") with a clear action button.
3. **Error**: readable message plus a "Try again" button.
4. **Success**: the real content.

Also apply to the booking submit button: idle, submitting (disabled with spinner), success, error.

### 5.4 Pages
- `/` Home: hero, search bar, featured destinations (Hunza, Skardu, Islamabad), why-book-with-us trust section
- `/hotels` Results: sticky search bar, filters (price, rating, free cancellation), horizontal hotel list
- `/hotels/:slug` Hotel details: gallery, description, amenities, rooms with prices, booking CTA
- `/book` Booking form: summary card + guest details form
- `/confirmation/:reference` Booking confirmation
- `/auth` Sign in / sign up
- `*` 404 page

### 5.5 Booking form
- Maximum 6 fields. Prefill name and email from the signed-in profile.
- Fields: full name, email, phone, special requests (optional) plus the already-chosen hotel, room, dates, guests (shown read-only in the summary).
- Always show the final price before submit. No surprise fees.

## 6. Data Scope

- **Boutique hotels only, in exactly three cities: Hunza, Skardu, and Islamabad.** Do not add any other city anywhere (database check constraint and UI dropdown enforce this).
- Seed 3 hotels per city (9 total), each with 2 to 3 room types.
- Hotel names must be **fictional** (for example: "Altit Orchard Lodge", "Shigar Fort Haven", "Margalla Stone Residence"). Do not use names of real hotels, and do not attach fake reviews or fake awards to real businesses.
- Photos: use **real Unsplash image URLs** in `https://images.unsplash.com/photo-...?auto=format&fit=crop&w=1200&q=80` form.
  - Never invent photo IDs. Only use URLs that actually load.
  - Before seeding, run a script (`scripts/verify-images.mjs`) that requests every URL and confirms HTTP 200. Remove or replace any that fail.
  - Every `<img>` has `loading="lazy"`, `alt`, and an `onError` fallback to a local placeholder.
- Currency: PKR. Show prices as "PKR 24,500 / night".
- Ratings and review counts in seed data are sample values. Label them as sample data in the README, not as real guest reviews.

## 7. Trust Elements (mandatory)

- **Trust badges** on cards, details, and booking summary, driven by data (`free_cancellation`, `cancellation_hours`):
  - "Free Cancellation" (shown only if `free_cancellation = true`)
  - "No hidden fees"
  - "Secure booking"
- **Transparency popup** ("Price breakdown" modal) opened from a "See price details" link next to every price:
  - nightly rate x number of nights
  - taxes (from `tax_percent`) and service fee (from `service_fee_percent`)
  - **total**
  - cancellation policy in plain words (for example: "Free cancellation until 48 hours before check-in")
  - "The price you see is the price you pay."
- The popup must be keyboard accessible: it traps focus, closes on Esc, has a visible close button, and uses `role="dialog"` and `aria-modal="true"`.
- The total shown in the UI must equal the `total_price` stored in the database. The database is the source of truth (see Section 8.4).

## 8. Supabase Database

All SQL lives in `supabase/schema.sql` and `supabase/seed.sql`. Run order: schema, then seed.

### 8.1 Schema

```sql
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
```

Notes:
- `check_out > check_in` and `guests >= 1` are enforced in the database, not only in the UI.
- The `[)` range means a guest can check in on the same day another guest checks out.
- Cancelled bookings do not block dates because the exclusion constraint only covers `pending` and `confirmed`.

### 8.2 Server-side integrity trigger

Guests-vs-capacity, past dates, `hotel_id`, and the **price** are set or checked by the database. Never trust a price sent from the browser.

```sql
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
```

### 8.3 Profile auto-creation

```sql
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
```

### 8.4 Row Level Security (mandatory, enabled on every table)

```sql
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
-- No direct UPDATE or DELETE policy. Cancellation goes through the function below.
```

### 8.5 Availability search and cancellation (RPC)

```sql
create or replace function search_available_hotels(
  p_city text, p_check_in date, p_check_out date, p_guests int)
returns table (hotel_id uuid, min_price numeric, available_rooms int)
language sql stable
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

-- Cancels the caller's own booking only if the hotel's policy allows it: the hotel offers
-- free cancellation AND now <= (check-in 00:00 Pakistan time) - cancellation_hours.
create or replace function cancel_booking(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  b bookings%rowtype;
  h hotels%rowtype;
begin
  select * into b from bookings
  where id = p_booking_id and user_id = auth.uid()
  for update;
  if not found then raise exception 'Booking not found'; end if;

  if b.status not in ('pending', 'confirmed') then
    raise exception 'This booking can no longer be cancelled';
  end if;

  select * into h from hotels where id = b.hotel_id;
  if not h.free_cancellation then
    raise exception 'This stay is non-refundable and cannot be cancelled online';
  end if;

  if now() > (b.check_in::timestamp at time zone 'Asia/Karachi') - make_interval(hours => h.cancellation_hours) then
    raise exception 'The free cancellation period for this booking has ended';
  end if;

  update bookings set status = 'cancelled' where id = b.id;
end;
$$;
```

Note: `search_available_hotels` reads bookings of all users to compute availability but returns only hotel-level aggregates, never other users' booking details. If RLS blocks the read for ordinary users, mark the function `security definer` (keeping `set search_path = public`).

### 8.6 Booking flow in code
1. Insert into `bookings` with `user_id`, `room_id`, dates, guests, and guest details. Do NOT send `total_price`, `status`, or `hotel_id`; the trigger sets them.
2. If Postgres returns the exclusion-constraint error (`23P01`), show: "Sorry, this room was just booked for those dates. Please choose other dates or another room."
3. On success, navigate to `/confirmation/:reference` and fetch the booking from Supabase.
4. Confirmation shows: reference, hotel, room, dates, nights, guests, total, status, and the cancellation policy.

## 9. Project Structure

```
src/
  components/   # SearchBar, HotelCard, HotelCardSkeleton, EmptyState, ErrorState,
                # PriceBreakdownModal, TrustBadge, Navbar, Footer
  pages/        # Home, Results, HotelDetails, Booking, Confirmation, Auth, NotFound
  lib/          # supabaseClient.js, formatters.js (PKR, dates), validators.js
  hooks/        # useHotels, useBooking, useAuth
supabase/       # schema.sql, seed.sql
scripts/        # verify-images.mjs
```

## 10. Definition of Done (check before every handoff)

- [ ] `npm run build` and `npm run lint` pass with no errors
- [ ] Full flow works: search, list, details, booking, confirmation (with real Supabase data)
- [ ] A second booking for the same room and overlapping dates is rejected
- [ ] Past dates, `check_out <= check_in`, and guests over room capacity are rejected
- [ ] Loading, empty, error, and success states exist on every data view
- [ ] Layout verified at 375px, 768px, and 1280px
- [ ] RLS enabled on all four tables; a signed-in user cannot read another user's bookings
- [ ] No secrets in the repo; `.env` ignored; only the anon key is used
- [ ] All seed image URLs verified (HTTP 200)
- [ ] Change log updated

## Claude Code Change Log

Format: `YYYY-MM-DD | what changed | files | why`

- 2026-10-09 | Fix lint: ESLint `no-unused-vars` flagged `Icon` props used only in JSX (false alarm); added `argsIgnorePattern` | eslint.config.js | `npm run lint` failed with 3 errors; now passes. (Tool: Claude chat, not Claude Code)
- 2026-10-09 | Change 1: Cancel booking. UI promised "Free cancellation" but nothing let a guest cancel. Added a cancel button with an "are you sure" step on the confirmation page; the database function `cancel_booking()` now enforces the hotel's policy (free-cancellation flag + deadline of check-in minus `cancellation_hours`, Pakistan time). | supabase/schema.sql, supabase/patch_cancel_policy.sql, src/lib/cancellation.js, src/lib/api.js, src/lib/ui.js, src/hooks/useBooking.js, src/pages/Confirmation.jsx | Close the gap between the policy shown and what the product can do. (Tool: Claude chat, not Claude Code)
- 2026-10-09 | Change 2: Sort results. The results page always ordered by rating with no way to change it. Added a "Sort by" dropdown (Best rated, Price low to high, Price high to low); ties are ordered by hotel name so the list never jumps around; sorting works together with the existing filters. | src/lib/filters.js, src/pages/Results.jsx | Guests comparing stays need to sort by price. (Tool: Claude chat, not Claude Code)
- 2026-10-10 | Change 3: My bookings page. A guest could only see a booking right after making it and had no way back to it later. Added a signed-in "My bookings" page (route /my-bookings, link in the navbar) listing the guest's own bookings newest first, each with status, dates, total and a "View details" link to the confirmation page (where cancelling lives). Has loading, empty, error and success states. Row level security guarantees only the guest's own rows come back. | src/pages/MyBookings.jsx, src/components/BookingCard.jsx, src/components/Navbar.jsx, src/App.jsx, src/lib/api.js, src/hooks/useBooking.js | Let guests find, review and cancel their bookings later. (Tool: Claude chat, not Claude Code)
