# HavenStay

A boutique hotel booking website for **Hunza, Skardu and Islamabad**. Original design inspired by hotel booking platforms (not a copy of any real site).

Stack: React (Vite), Tailwind CSS, Lucide React, React Router, Supabase (Postgres, Auth, Row Level Security), Netlify.

> **Sample data notice:** all 9 hotel names are fictional. Ratings, review counts and prices are sample values, not real guest reviews. Photos are from Unsplash.

## 1. Run it locally

You need Node.js 18 or newer.

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# fill in the two values in .env (see step 2)
npm run verify-images     # checks every Unsplash URL loads
npm run dev
```

Open the address that `npm run dev` prints (usually http://localhost:5173).

## 2. Set up Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, click **Run**.
3. Paste all of `supabase/seed.sql`, click **Run**. You should now see 9 rows in `hotels` and 23 rows in `rooms` (Table Editor).
4. Go to **Authentication, Providers, Email** and switch **Confirm email OFF** while you test (otherwise every new account must click an email link first).
5. Go to **Project Settings, API**. Copy **Project URL** and the **anon public** key into `.env`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
   Use only the anon public key, never a secret/admin key.

Tables: `profiles`, `hotels`, `rooms`, `bookings`. Row Level Security is on for all four.

## 3. How the database protects bookings

| Rule | Where it is enforced |
|---|---|
| `check_out > check_in`, `guests >= 1` | CHECK constraints on `bookings` |
| Same room cannot be booked twice for overlapping dates | `bookings_no_overlap` exclusion constraint |
| Guests cannot exceed room capacity, check-in cannot be in the past | `bookings_before_insert` trigger |
| Price (`total_price`) is calculated by the database, never trusted from the browser | same trigger |
| A guest can only read and create their own bookings | RLS policies |
| Availability is computed across all guests' bookings | `security definer` functions `search_available_hotels` and `available_room_ids` |

## 4. Test it (also good screenshots for your submission)

1. Home: choose Hunza, dates in the future, 2 guests, Search.
2. Open a hotel, click **See price details** (the transparency popup). Press Esc to close it.
3. Click **Book this room**. You are sent to sign up / sign in, then back to the booking form.
4. Submit. You land on `/confirmation/HS-XXXXXXXX`, read back from Supabase.
5. Supabase, Table Editor, `bookings`: the row is there with status `pending`.
6. **Double booking test:** book the same room for the same dates again (a second account, or the same one). You must see "Sorry, this room was just booked for those dates."
7. Try invalid input: check-out before check-in, 0 or 11 guests, a past date, an empty booking form.

## 5. Deploy

1. Push to GitHub (`.env` is in `.gitignore`, so your keys are not uploaded).
2. Netlify: **Add new site, Import from Git**. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
3. **Site settings, Environment variables:** add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then **redeploy**.
4. Supabase, **Authentication, URL Configuration:** set **Site URL** to your Netlify address.

## 6. Project structure

```
src/
  components/   Hero, SearchBar, HotelCard, HotelCardSkeleton, RoomCard, Gallery, Filters,
                PriceBreakdownModal, TrustBadge, EmptyState, ErrorState, Navbar, Footer, ...
  pages/        Home, Results, HotelDetails, Booking, Confirmation, Auth, NotFound
  hooks/        useHotels, useBooking, useAuth, useQuery, usePageTitle
  context/      AuthProvider (session + profile)
  lib/          supabaseClient, api, validators, formatters, pricing, filters, ui, destinations
supabase/       schema.sql, seed.sql
scripts/        verify-images.mjs
CLAUDE.md       rules for Claude Code
```

## 7. Using Claude Code on this project (for the assignment)

The assignment asks you to use Claude Code for real, so do these steps yourself and take screenshots as you go:

1. Open this folder in Claude Code and ask: *"Inspect the project structure and read CLAUDE.md. Summarize what exists before changing anything."*
2. Run `npm install`, `npm run build`, `npm run lint`. If anything fails, paste the error into Claude Code and let it find and fix the cause.
3. Make at least 3 meaningful changes with Claude Code (for example: add a "My bookings" page, add sorting by price on the results page, add a cancel-booking button using the `cancel_booking` function). After each one, Claude Code appends a line to the **Claude Code Change Log** at the bottom of `CLAUDE.md`.
4. Be honest in your write-up about what Claude Code did and what you did.
