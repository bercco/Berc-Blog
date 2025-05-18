# Supabase Dashboard for Hoodie Store

This project demonstrates how to use Supabase with Next.js to create a product management dashboard for an e-commerce store.

## Features

- Authentication with Supabase Auth
- Product management (CRUD operations)
- Real-time updates with Supabase Realtime
- Shopify product synchronization
- Responsive UI with shadcn/ui components

## Environment Variables

This project uses the following environment variables:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
\`\`\`

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your Supabase project and add the environment variables
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The SQL schema for the Supabase database is included in the `supabase/schema.sql` file. You can run this in the Supabase SQL editor to set up the required tables and policies.

## Authentication

The project includes sign-in and sign-up pages that use Supabase Auth. Users can create accounts and sign in to access the dashboard.

## Product Management

The dashboard allows you to:

- View all products
- Add new products
- Edit existing products
- Delete products
- Filter products by category
- Search for products

## Shopify Integration

The project includes a sample implementation of syncing products with Shopify. In a real application, you would use the Shopify API to fetch products and sync them with your Supabase database.

## Real-time Updates

The dashboard uses Supabase Realtime to automatically update when products are added, edited, or deleted.
\`\`\`

Let's create a navigation component for the dashboard:
