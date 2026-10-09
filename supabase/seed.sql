-- HavenStay sample data: 9 FICTIONAL boutique hotels (3 per city) and their rooms.
-- Run ONCE, after supabase/schema.sql.
-- Ratings, review counts and prices are SAMPLE values, not real guest reviews.
-- Photos are real Unsplash images (run `npm run verify-images` to confirm they load).

insert into hotels
  (slug, name, city, address, description, image_urls, rating, review_count, amenities,
   free_cancellation, cancellation_hours, tax_percent, service_fee_percent)
values
  -- HUNZA
  ('altit-orchard-lodge', 'Altit Orchard Lodge', 'Hunza', 'Altit village, Hunza',
   'A quiet stone-and-timber lodge set among apricot trees, with terraces that face the valley. Slow breakfasts, warm rooms and early evenings by the fire.',
   array[
     'https://images.unsplash.com/photo-1514558427911-8e293bebf18c?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1200&q=80'],
   4.8, 126, array['Free Wi-Fi', 'Breakfast included', 'Garden', 'Mountain view'],
   true, 48, 10.0, 5.0),

  ('apricot-terrace-lodge', 'Apricot Terrace Lodge', 'Hunza', 'Karimabad, Hunza',
   'Eight calm rooms stacked along a hillside terrace. Wake up to valley light, then walk into the old bazaar in minutes.',
   array[
     'https://images.unsplash.com/photo-1569173112611-52a7cd38bea9?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1668710720004-d09c82ab67dc?auto=format&fit=crop&w=1200&q=80'],
   4.6, 89, array['Free Wi-Fi', 'Free parking', 'Restaurant', 'Mountain view'],
   true, 24, 10.0, 5.0),

  ('silverbirch-mountain-retreat', 'Silverbirch Mountain Retreat', 'Hunza', 'Upper Hunza',
   'Private cabins tucked between birch and pine for guests who want silence. A non-refundable rate keeps prices lower.',
   array[
     'https://images.unsplash.com/photo-1632133915653-8ded5c72e329?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1614703501456-c3b535e3fad0?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=1200&q=80'],
   4.7, 64, array['Fireplace', 'Breakfast included', 'Heating', 'Mountain view'],
   false, 0, 10.0, 5.0),

  -- SKARDU
  ('shigar-fort-haven', 'Shigar Fort Haven', 'Skardu', 'Shigar valley, Skardu',
   'A restored courtyard house with carved wooden doors and thick walls that keep the rooms cool in summer and warm in winter.',
   array[
     'https://images.unsplash.com/photo-1709634483655-c0384d8a100f?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?auto=format&fit=crop&w=1200&q=80'],
   4.9, 142, array['Free Wi-Fi', 'Breakfast included', 'Restaurant', 'Garden'],
   true, 72, 10.0, 5.0),

  ('willowmere-lodge', 'Willowmere Lodge', 'Skardu', 'Lakeside road, Skardu',
   'A friendly lakeside lodge with wooden balconies. Rooms face the water, and the dining room serves slow local breakfasts.',
   array[
     'https://images.unsplash.com/photo-1679951124125-50cc4029d727?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1668710720004-d09c82ab67dc?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1200&q=80'],
   4.5, 77, array['Free Wi-Fi', 'Free parking', 'Heating', 'Mountain view'],
   true, 48, 10.0, 5.0),

  ('indus-bend-retreat', 'Indus Bend Retreat', 'Skardu', 'River road, Skardu',
   'Simple, spotless rooms on a bend of the river. Good for early starts, with packed breakfasts on request.',
   array[
     'https://images.unsplash.com/photo-1706458192675-b13d4b79a2ef?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?auto=format&fit=crop&w=1200&q=80'],
   4.4, 58, array['Free Wi-Fi', 'Breakfast included', 'Free parking'],
   true, 24, 10.0, 5.0),

  -- ISLAMABAD
  ('margalla-stone-residence', 'Margalla Stone Residence', 'Islamabad', 'Foothills of the Margalla hills, Islamabad',
   'Stone-clad studios and suites on a wooded slope, a short drive from the city. Quiet at night, with hill views from every balcony.',
   array[
     'https://images.unsplash.com/photo-1700427281863-8203741c4055?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'],
   4.8, 133, array['Free Wi-Fi', 'Breakfast included', 'Free parking', 'Mountain view'],
   true, 48, 10.0, 5.0),

  ('saidpur-courtyard-house', 'Saidpur Courtyard House', 'Islamabad', 'Old village quarter, Islamabad',
   'A boutique house built around a shaded courtyard. Only a handful of rooms, each with its own character.',
   array[
     'https://images.unsplash.com/photo-1705609312569-614e3ddf2770?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'],
   4.7, 95, array['Free Wi-Fi', 'Restaurant', 'Garden'],
   true, 24, 10.0, 5.0),

  ('jacaranda-row-suites', 'Jacaranda Row Suites', 'Islamabad', 'Tree-lined sector, Islamabad',
   'Bright city suites on a leafy street, built for business trips and short stays. Non-refundable rates are the lowest.',
   array[
     'https://images.unsplash.com/photo-1608020932658-d0e19a69580b?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?auto=format&fit=crop&w=1200&q=80',
     'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=1200&q=80'],
   4.3, 71, array['Free Wi-Fi', 'Breakfast included', 'Free parking'],
   false, 0, 10.0, 5.0);

insert into rooms (hotel_id, name, capacity, price_per_night, image_url)
select h.id, v.name, v.capacity, v.price, v.image_url
from (values
  -- Altit Orchard Lodge
  ('altit-orchard-lodge', 'Orchard Double', 2, 18000, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'),
  ('altit-orchard-lodge', 'Terrace Deluxe', 3, 22000, 'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1200&q=80'),
  ('altit-orchard-lodge', 'Family Suite', 4, 26000, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'),
  -- Apricot Terrace Lodge
  ('apricot-terrace-lodge', 'Garden Twin', 2, 15500, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'),
  ('apricot-terrace-lodge', 'Terrace Suite', 3, 21500, 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=1200&q=80'),
  -- Silverbirch Mountain Retreat
  ('silverbirch-mountain-retreat', 'Birch Cabin', 2, 24000, 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=1200&q=80'),
  ('silverbirch-mountain-retreat', 'Loft Suite', 3, 29000, 'https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?auto=format&fit=crop&w=1200&q=80'),
  ('silverbirch-mountain-retreat', 'Family Cabin', 5, 34500, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'),
  -- Shigar Fort Haven
  ('shigar-fort-haven', 'Courtyard Room', 2, 20000, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'),
  ('shigar-fort-haven', 'Heritage Suite', 3, 31500, 'https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?auto=format&fit=crop&w=1200&q=80'),
  ('shigar-fort-haven', 'Family Hall', 4, 38000, 'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1200&q=80'),
  -- Willowmere Lodge
  ('willowmere-lodge', 'Lake Double', 2, 17500, 'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1200&q=80'),
  ('willowmere-lodge', 'Lake Family Room', 4, 27500, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'),
  -- Indus Bend Retreat
  ('indus-bend-retreat', 'River View Double', 2, 16500, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'),
  ('indus-bend-retreat', 'River Suite', 3, 25500, 'https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?auto=format&fit=crop&w=1200&q=80'),
  -- Margalla Stone Residence
  ('margalla-stone-residence', 'Stone Studio', 2, 28000, 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=1200&q=80'),
  ('margalla-stone-residence', 'Hill Suite', 3, 38500, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'),
  ('margalla-stone-residence', 'Family Residence', 5, 52000, 'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1200&q=80'),
  -- Saidpur Courtyard House
  ('saidpur-courtyard-house', 'Courtyard Double', 2, 21000, 'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1200&q=80'),
  ('saidpur-courtyard-house', 'Heritage Suite', 3, 30500, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'),
  -- Jacaranda Row Suites
  ('jacaranda-row-suites', 'City Double', 2, 19500, 'https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?auto=format&fit=crop&w=1200&q=80'),
  ('jacaranda-row-suites', 'Executive Suite', 3, 29500, 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=1200&q=80'),
  ('jacaranda-row-suites', 'Family Suite', 4, 36000, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80')
) as v(slug, name, capacity, price, image_url)
join hotels h on h.slug = v.slug;
