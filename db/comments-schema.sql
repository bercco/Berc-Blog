-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  is_verified_purchase BOOLEAN DEFAULT FALSE
);

-- Product Review Likes Table (to track who liked which review)
CREATE TABLE IF NOT EXISTS product_review_likes (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES product_reviews(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE
);

-- Forum Post Likes Table
CREATE TABLE IF NOT EXISTS forum_post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Forum Comments Table
CREATE TABLE IF NOT EXISTS forum_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES forum_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE
);

-- Forum Comment Likes Table
CREATE TABLE IF NOT EXISTS forum_comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent_id ON forum_comments(parent_id);

-- Create functions to update counts
CREATE OR REPLACE FUNCTION update_product_review_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the product's review count and average rating
  UPDATE products
  SET 
    reviews_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id),
    rating = (SELECT AVG(rating) FROM product_reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_forum_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the post's comment count
  UPDATE forum_posts
  SET 
    comment_count = (SELECT COUNT(*) FROM forum_comments WHERE post_id = NEW.post_id)
  WHERE id = NEW.post_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER after_product_review_insert_or_update
AFTER INSERT OR UPDATE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_review_counts();

CREATE TRIGGER after_forum_comment_insert_or_update
AFTER INSERT OR UPDATE ON forum_comments
FOR EACH ROW
EXECUTE FUNCTION update_forum_comment_counts();
