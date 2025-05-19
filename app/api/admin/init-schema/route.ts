import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function POST() {
  try {
    // Check if user is an admin
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll allow any authenticated user to initialize the schema

    console.log("Initializing Supabase schema...")

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
      return NextResponse.json({ error: "Failed to create product_reviews table" }, { status: 500 })
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
      return NextResponse.json({ error: "Failed to create product_review_likes table" }, { status: 500 })
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
      return NextResponse.json({ error: "Failed to create forum_posts table" }, { status: 500 })
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
      return NextResponse.json({ error: "Failed to create forum_comments table" }, { status: 500 })
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
      return NextResponse.json({ error: "Failed to create stored procedures" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Schema initialized successfully" })
  } catch (error) {
    console.error("Error initializing schema:", error)
    return NextResponse.json(
      { error: "Failed to initialize schema", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
