import { supabaseAdmin } from "@/lib/supabase/admin-client"

async function initSchema() {
  console.log("Initializing Supabase schema...")

  try {
    // Create product_reviews table
    const { error: reviewsTableError } = await supabaseAdmin.query(`
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
    `)

    if (reviewsTableError) {
      console.error("Error creating product_reviews table:", reviewsTableError)
      return
    }

    // Create product_review_likes table
    const { error: likesTableError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS product_review_likes (
        id SERIAL PRIMARY KEY,
        review_id INTEGER REFERENCES product_reviews(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(review_id, user_id)
      );
    `)

    if (likesTableError) {
      console.error("Error creating product_review_likes table:", likesTableError)
      return
    }

    // Create forum_posts table
    const { error: postsTableError } = await supabaseAdmin.query(`
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
    `)

    if (postsTableError) {
      console.error("Error creating forum_posts table:", postsTableError)
      return
    }

    // Create forum_comments table
    const { error: commentsTableError } = await supabaseAdmin.query(`
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
    `)

    if (commentsTableError) {
      console.error("Error creating forum_comments table:", commentsTableError)
      return
    }

    // Create stored procedures
    const { error: proceduresError } = await supabaseAdmin.query(`
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
    `)

    if (proceduresError) {
      console.error("Error creating stored procedures:", proceduresError)
      return
    }

    console.log("Supabase schema initialized successfully!")
  } catch (error) {
    console.error("Error initializing Supabase schema:", error)
  }
}

// Run the initialization
initSchema()
