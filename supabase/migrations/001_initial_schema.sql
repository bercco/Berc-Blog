-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  inventory_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  sales_count INTEGER DEFAULT 0
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer', 'manager')),
  full_name TEXT NOT NULL
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Add indexes
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id);
CREATE INDEX IF NOT EXISTS chat_history_user_id_idx ON chat_history(user_id);

-- Add RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Products are insertable by admins and managers" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'manager')
  )
);

CREATE POLICY "Products are updatable by admins and managers" 
ON products FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'manager')
  )
);

CREATE POLICY "Products are deletable by admins" 
ON products FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Categories are insertable by admins" 
ON categories FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Categories are updatable by admins" 
ON categories FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Categories are deletable by admins" 
ON categories FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Users policies
CREATE POLICY "Users can view their own data" 
ON users FOR SELECT 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Admins can view all users" 
ON users FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Users can update their own data" 
ON users FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Admins can update all users" 
ON users FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Chat history policies
CREATE POLICY "Users can view their own chat history" 
ON chat_history FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all chat history" 
ON chat_history FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Users can insert their own chat history" 
ON chat_history FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Insert some initial categories
INSERT INTO categories (name, slug) VALUES
('Electronics', 'electronics'),
('Clothing', 'clothing'),
('Home & Kitchen', 'home-kitchen'),
('Books', 'books'),
('Toys & Games', 'toys-games');

-- Insert subcategories
INSERT INTO categories (name, slug, parent_id) VALUES
('Smartphones', 'smartphones', (SELECT id FROM categories WHERE slug = 'electronics')),
('Laptops', 'laptops', (SELECT id FROM categories WHERE slug = 'electronics')),
('Men''s Clothing', 'mens-clothing', (SELECT id FROM categories WHERE slug = 'clothing')),
('Women''s Clothing', 'womens-clothing', (SELECT id FROM categories WHERE slug = 'clothing')),
('Kitchen Appliances', 'kitchen-appliances', (SELECT id FROM categories WHERE slug = 'home-kitchen')),
('Furniture', 'furniture', (SELECT id FROM categories WHERE slug = 'home-kitchen')),
('Fiction', 'fiction', (SELECT id FROM categories WHERE slug = 'books')),
('Non-Fiction', 'non-fiction', (SELECT id FROM categories WHERE slug = 'books')),
('Board Games', 'board-games', (SELECT id FROM categories WHERE slug = 'toys-games')),
('Outdoor Toys', 'outdoor-toys', (SELECT id FROM categories WHERE slug = 'toys-games'));
