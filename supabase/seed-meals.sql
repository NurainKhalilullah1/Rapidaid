-- ============================================
-- RapidAid — Seed Meals Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================

insert into public.meals (name, description, local_ingredients, price_range, restricted_for, contains_allergens, image_url, benefits) values
(
  'Amala with Ewedu & Fish',
  'A traditional local swallow that is very light, easy on the stomach, and highly nutritious.',
  ARRAY['Yam flour (Elubo)', 'Ewedu leaves', 'Fish (Titus/Mackerel)', 'Iru (Locust beans)'],
  'Budget',
  ARRAY[]::text[],
  ARRAY['Fish'],
  '',
  'Extremely easy to digest. High fiber Ewedu protects the stomach lining and promotes gut health.'
),
(
  'Steamed Moin-Moin & Custard',
  'Steamed bean cake seasoned with minimal oil and spices, paired with warm custard.',
  ARRAY['Honey beans (brown beans)', 'Onions', 'Titus Fish / Egg', 'Custard powder', 'Sugar (optional)'],
  'Budget',
  ARRAY[]::text[],
  ARRAY['Egg'],
  '',
  'High protein and complex carbs. Gentle on the stomach for ulcer or acid reflux patients.'
),
(
  'Spicy Peppered Rice & Turkey',
  'Steamed white rice paired with highly spiced peppered sauce and fried turkey.',
  ARRAY['Rice', 'Habanero pepper (Ata rodo)', 'Chili pepper', 'Turkey meat', 'Vegetable oil'],
  'Premium',
  ARRAY['Ulcer', 'Acid Reflux'],
  ARRAY[]::text[],
  '',
  'High energy and protein. Best avoided for those with stomach issues due to intense heat/capsaicin.'
),
(
  'Oatmeal with Bananas & Honey',
  'Quick cooking oats sweetened naturally with honey and ripe bananas. High-fiber stomach helper.',
  ARRAY['Rolled oats', 'Ripe banana', 'Honey', 'Skimmed milk'],
  'Budget',
  ARRAY['Diabetes'],
  ARRAY['Dairy'],
  '',
  'Oats form a gel-like coating in the stomach, reducing irritation from excess acid. Excellent for ulcers.'
),
(
  'Yam & Egg Sauce (Mild)',
  'Boiled soft yam served with a mildly seasoned tomato and egg stir-fry.',
  ARRAY['Puna Yam', 'Eggs', 'Fresh Tomatoes', 'Onions', 'Mild vegetable oil'],
  'Moderate',
  ARRAY[]::text[],
  ARRAY['Egg'],
  '',
  'Starchy energy coupled with high-quality protein, seasoned gently to avoid triggering gastric acidity.'
),
(
  'Eba with Spicy Egusi & Assorted Meat',
  'Cassava swallow paired with rich, highly-seasoned Egusi (melon seed) soup and cow skin/beef.',
  ARRAY['Garri', 'Egusi seeds', 'Palm oil', 'Assorted meat', 'Maggi & Pepper'],
  'Moderate',
  ARRAY['Ulcer', 'Hypertension'],
  ARRAY[]::text[],
  '',
  'Filling and highly rich in calories and iron. Heavy/fatty soups can slow digestion and aggravate ulcers.'
);
