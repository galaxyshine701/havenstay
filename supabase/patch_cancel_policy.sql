-- PATCH: make cancel_booking() enforce the hotel's cancellation policy.
-- Run this once in Supabase -> SQL Editor if you created the database BEFORE this change.
-- (A fresh run of schema.sql already contains the same function.)

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

revoke all on function cancel_booking(uuid) from public;
grant execute on function cancel_booking(uuid) to authenticated;
