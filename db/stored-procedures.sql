-- Function to increment review likes
CREATE OR REPLACE FUNCTION increment_review_likes(p_review_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE product_reviews
  SET likes = likes + 1
  WHERE id = p_review_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement review likes
CREATE OR REPLACE FUNCTION decrement_review_likes(p_review_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE product_reviews
  SET likes = GREATEST(0, likes - 1)
  WHERE id = p_review_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment forum post likes
CREATE OR REPLACE FUNCTION increment_post_likes(p_post_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_posts
  SET likes = likes + 1
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement forum post likes
CREATE OR REPLACE FUNCTION decrement_post_likes(p_post_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_posts
  SET likes = GREATEST(0, likes - 1)
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment forum comment likes
CREATE OR REPLACE FUNCTION increment_comment_likes(p_comment_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_comments
  SET likes = likes + 1
  WHERE id = p_comment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement forum comment likes
CREATE OR REPLACE FUNCTION decrement_comment_likes(p_comment_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_comments
  SET likes = GREATEST(0, likes - 1)
  WHERE id = p_comment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment forum post views
CREATE OR REPLACE FUNCTION increment_post_views(p_post_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_posts
  SET views = views + 1
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;
