-- Add Stripe product and price ID columns to the products table
ALTER TABLE products
ADD COLUMN stripe_product_id VARCHAR(255),
ADD COLUMN stripe_price_id VARCHAR(255);

-- Add Stripe price ID column to the order_items table
ALTER TABLE order_items
ADD COLUMN stripe_price_id VARCHAR(255);

-- Create a table to store Stripe webhook events
CREATE TABLE IF NOT EXISTS stripe_events (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  object TEXT NOT NULL,
  created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

-- Create an index on the type column for faster lookups
CREATE INDEX IF NOT EXISTS stripe_events_type_idx ON stripe_events(type);
