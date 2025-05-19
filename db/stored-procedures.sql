-- Create function to increment a value
CREATE OR REPLACE FUNCTION increment(row_id integer)
RETURNS integer AS $$
DECLARE
  current_value integer;
BEGIN
  SELECT likes INTO current_value FROM product_reviews WHERE id = row_id;
  RETURN current_value + 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement a value
CREATE OR REPLACE FUNCTION decrement(row_id integer)
RETURNS integer AS $$
DECLARE
  current_value integer;
BEGIN
  SELECT likes INTO current_value FROM product_reviews WHERE id = row_id;
  RETURN GREATEST(0, current_value - 1);
END;
$$ LANGUAGE plpgsql;

-- Create function to increment forum post likes
CREATE OR REPLACE FUNCTION increment_forum_post_likes(p_post_id integer)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts
  SET likes = likes + 1
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement forum post likes
CREATE OR REPLACE FUNCTION decrement_forum_post_likes(p_post_id integer)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts
  SET likes = GREATEST(0, likes - 1)
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment forum comment likes
CREATE OR REPLACE FUNCTION increment_forum_comment_likes(p_comment_id integer)
RETURNS void AS $$
BEGIN
  UPDATE forum_comments
  SET likes = likes + 1
  WHERE id = p_comment_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement forum comment likes
CREATE OR REPLACE FUNCTION decrement_forum_comment_likes(p_comment_id integer)
RETURNS void AS $$
BEGIN
  UPDATE forum_comments
  SET likes = GREATEST(0, likes - 1)
  WHERE id = p_comment_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment review likes
CREATE OR REPLACE FUNCTION increment_review_likes(p_review_id integer)
RETURNS void AS $$
BEGIN
  UPDATE product_reviews
  SET likes = likes + 1
  WHERE id = p_review_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement review likes
CREATE OR REPLACE FUNCTION decrement_review_likes(p_review_id integer)
RETURNS void AS $$
BEGIN
  UPDATE product_reviews
  SET likes = GREATEST(0, likes - 1)
  WHERE id = p_review_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment forum post views
CREATE OR REPLACE FUNCTION increment_forum_post_views(p_post_id integer)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts
  SET views = views + 1
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;
