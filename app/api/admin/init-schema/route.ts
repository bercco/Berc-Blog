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

    // Create products table if it doesn't exist
    const { error: productsTableError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image1 TEXT,
        image2 TEXT,
        category TEXT,
        type TEXT,
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews_count INTEGER DEFAULT 0,
        inventory_quantity INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    if (productsTableError) {
      console.error("Error creating products table:", productsTableError)
      return NextResponse.json({ error: "Failed to create products table" }, { status: 500 })
    }

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

    // Create support_messages table
    const { error: messagesTableError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS support_messages (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        content_preview TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        priority TEXT NOT NULL DEFAULT 'normal',
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    if (messagesTableError) {
      console.error("Error creating support_messages table:", messagesTableError)
      return NextResponse.json({ error: "Failed to create support_messages table" }, { status: 500 })
    }

    // Create support_message_responses table
    const { error: responsesTableError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS support_message_responses (
        id SERIAL PRIMARY KEY,
        message_id INTEGER REFERENCES support_messages(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        is_internal BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    if (responsesTableError) {
      console.error("Error creating support_message_responses table:", responsesTableError)
      return NextResponse.json({ error: "Failed to create support_message_responses table" }, { status: 500 })
    }

    // Create stored procedures
    const { error: proceduresError } = await supabaseAdmin.query(`
      -- Create function to increment likes
      CREATE OR REPLACE FUNCTION increment_likes(table_name text, row_id integer)
      RETURNS void AS $$
      BEGIN
        EXECUTE format('UPDATE %I SET likes = likes + 1 WHERE id = %L', table_name, row_id);
      END;
      $$ LANGUAGE plpgsql;

      -- Create function to decrement likes
      CREATE OR REPLACE FUNCTION decrement_likes(table_name text, row_id integer)
      RETURNS void AS $$
      BEGIN
        EXECUTE format('UPDATE %I SET likes = GREATEST(0, likes - 1) WHERE id = %L', table_name, row_id);
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
