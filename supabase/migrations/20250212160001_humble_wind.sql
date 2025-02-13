/*
  # Initial Schema Setup for Restaurant Menu QR System

  1. Tables
    - restaurants
      - Basic restaurant information
    - menus
      - Menu details linked to restaurants
    - categories
      - Menu categories (e.g., Entrées, Plats, Desserts)
    - items
      - Individual menu items with prices and descriptions
    
  2. Security
    - RLS policies for all tables
    - Authentication using Supabase Auth
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  address text,
  phone text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  logo_url text,
  is_active boolean DEFAULT true
);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  menu_id uuid REFERENCES menus(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  order_index integer DEFAULT 0
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  order_index integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own restaurants"
  ON restaurants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own restaurants"
  ON restaurants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own restaurants"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Menus policies
CREATE POLICY "Users can manage their restaurant menus"
  ON menus
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = restaurant_id
      AND restaurants.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active menus"
  ON menus
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Categories policies
CREATE POLICY "Users can manage their menu categories"
  ON categories
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM menus
      JOIN restaurants ON restaurants.id = menus.restaurant_id
      WHERE menus.id = menu_id
      AND restaurants.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Items policies
CREATE POLICY "Users can manage their menu items"
  ON items
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM categories
      JOIN menus ON menus.id = categories.menu_id
      JOIN restaurants ON restaurants.id = menus.restaurant_id
      WHERE categories.id = category_id
      AND restaurants.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view items"
  ON items
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();