-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image1 TEXT NOT NULL,
    image2 TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    rating DECIMAL(3, 2),
    reviews_count INTEGER DEFAULT 0,
    shopify_id TEXT,
    inventory_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Create product reviews table
CREATE TABLE product_reviews (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    likes INTEGER DEFAULT 0,
    is_verified_purchase BOOLEAN DEFAULT FALSE
);

-- Create forum categories table
CREATE TABLE forum_categories (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    thread_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE
);

-- Create forum threads table
CREATE TABLE forum_threads (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id TEXT NOT NULL,
    category_id BIGINT REFERENCES forum_categories(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    comment_count INTEGER DEFAULT 0
);

-- Create forum thread tags table
CREATE TABLE forum_thread_tags (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    thread_id BIGINT REFERENCES forum_threads(id) ON DELETE CASCADE,
    tag TEXT NOT NULL
);

-- Create forum comments table
CREATE TABLE forum_comments (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    thread_id BIGINT REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    parent_id BIGINT REFERENCES forum_comments(id) ON DELETE SET NULL
);

-- Create user profiles table
CREATE TABLE user_profiles (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    reputation INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    wallet_address TEXT
);

-- Create orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL,
    status TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    stripe_session_id TEXT,
    shipping_address JSONB,
    billing_address JSONB
);

-- Create order items table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Add indexes for performance
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_forum_threads_category_id ON forum_threads(category_id);
CREATE INDEX idx_forum_threads_user_id ON forum_threads(user_id);
CREATE INDEX idx_forum_comments_thread_id ON forum_comments(thread_id);
CREATE INDEX idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX idx_forum_thread_tags_thread_id ON forum_thread_tags(thread_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Add RLS policies to secure the data
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_thread_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for products (everyone can read, only authenticated users can write)
CREATE POLICY "Anyone can read products" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policies for product reviews
CREATE POLICY "Anyone can read reviews" 
ON product_reviews FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reviews" 
ON product_reviews FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON product_reviews FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create policies for forum categories (read-only for everyone)
CREATE POLICY "Anyone can read forum categories" 
ON forum_categories FOR SELECT 
USING (true);

-- Create policies for forum threads
CREATE POLICY "Anyone can read forum threads" 
ON forum_threads FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create threads" 
ON forum_threads FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads" 
ON forum_threads FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create policies for forum comments
CREATE POLICY "Anyone can read forum comments" 
ON forum_comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON forum_comments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON forum_comments FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create policies for user profiles
CREATE POLICY "Anyone can read user profiles" 
ON user_profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON user_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Create policies for orders
CREATE POLICY "Users can read their own orders" 
ON orders FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
ON orders FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create policies for order items
CREATE POLICY "Users can read their own order items" 
ON order_items FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own order items" 
ON order_items FOR INSERT 
TO authenticated 
WITH CHECK (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
));
