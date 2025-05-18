-- Create a function to list tables
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (
  table_name text,
  has_rows boolean
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::text as table_name,
    (SELECT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = t.tablename
                   AND (SELECT count(*) FROM information_schema.columns 
                        WHERE table_schema = 'public' 
                        AND table_name = t.tablename) > 0)) as has_rows
  FROM pg_catalog.pg_tables t
  WHERE t.schemaname = 'public';
END;
$$;

-- Create a function to check foreign keys
CREATE OR REPLACE FUNCTION check_foreign_keys()
RETURNS TABLE (
  table_name text,
  column_name text,
  foreign_table_name text,
  foreign_column_name text
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.table_name::text,
    kcu.column_name::text,
    ccu.table_name::text AS foreign_table_name,
    ccu.column_name::text AS foreign_column_name
  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
END;
$$;
