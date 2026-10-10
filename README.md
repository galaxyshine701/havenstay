# HavenStay: Boutique Hotel Booking Platform

A hotel booking website for boutique stays in Hunza, Skardu and Islamabad. Guests can search stays, check a price breakdown, create an account and book a room, while the database itself enforces the booking rules.

**Live demo:** https://havenstay-hotel.netlify.app
![Home](screenshots/home.png)
![Hotel details](screenshots/hotel-details.png)
![Booking confirmation](screenshots/booking-confirmation.png)

## Features

- Search stays by destination, dates and number of guests
- Hotel pages with room options and a price breakdown
- Sign up and sign in with Supabase Auth
- Booking flow with a confirmation page
- Double-booking prevention enforced at database level

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Lucide React
- **Backend and database:** Supabase (Postgres, Auth, Row Level Security)
- **Hosting:** Netlify

## Database-Level Booking Rules

Booking rules live in the database, so they hold no matter what the frontend sends.

| Rule | How it is enforced |
| --- | --- |
| Valid dates and guest counts | Check constraints |
| No overlapping bookings for the same room | Exclusion constraint |
| Capacity, past dates and final price | Trigger (price is calculated on the server) |
| Guests can only see their own bookings | Row Level Security policies |
| Availability across all guests | Security-definer database functions |

## Run Locally

**Requirements:** Node.js 18 or newer and a free [Supabase](https://supabase.com) project.

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/galaxyshine701/havenstay.git
   cd havenstay
   npm install
   ```
2. Copy `.env.example` to `.env` and add your Supabase project URL and anon public key.
3. In the Supabase SQL Editor, run `schema.sql` and then `seed.sql` from the `supabase/` folder.
4. For local testing, turn off email confirmation in Supabase under Authentication settings.
5. Start the app:
   ```bash
   npm run dev
   ```

## Sample Data

The app ships with nine fictional hotels and 23 rooms. Ratings, reviews and prices are sample data, and photos are from Unsplash. The design is original.

## Project Structure

```
src/
  components/   reusable UI components
  pages/        search, hotel details, booking, confirmation
  hooks/        custom React hooks
  context/      shared app state
  lib/          Supabase client and helpers
supabase/       database schema and seed data
scripts/        utility scripts
```

## Author

Anam Zubair | [GitHub](https://github.com/galaxyshine701) | [LinkedIn](https://www.linkedin.com/in/anam-zubair-bb1638282)
