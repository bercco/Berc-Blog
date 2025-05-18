-- Function to calculate average rating for a product
CREATE OR REPLACE FUNCTION calculate_average_rating(p_product_id BIGINT)
RETURNS TABLE(average_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::numeric, 1) AS average_rating,
    COUNT(*) AS review_count
  FROM product_reviews
  WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;
