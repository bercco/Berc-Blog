-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active', -- active, pending, unsubscribed
    last_email_sent TIMESTAMP WITH TIME ZONE,
    source TEXT, -- where the subscriber came from
    metadata JSONB -- additional data about the subscriber
);

-- Create newsletter_campaigns table
CREATE TABLE newsletter_campaigns (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, sent, cancelled
    recipient_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_by TEXT NOT NULL -- user_id of the creator
);

-- Create newsletter_events table for tracking opens, clicks, etc.
CREATE TABLE newsletter_events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    campaign_id BIGINT REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
    subscriber_id BIGINT REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- open, click, unsubscribe
    metadata JSONB -- additional data about the event
);

-- Create music_nfts table
CREATE TABLE music_nfts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    nft_link TEXT,
    description TEXT,
    release_date DATE,
    metadata JSONB -- additional data about the NFT
);

-- Add RLS policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_nfts ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_subscribers
CREATE POLICY "Anyone can read newsletter_subscribers" 
ON newsletter_subscribers FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert newsletter_subscribers" 
ON newsletter_subscribers FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only admins can update newsletter_subscribers" 
ON newsletter_subscribers FOR UPDATE 
TO authenticated 
USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));

-- Create policies for newsletter_campaigns
CREATE POLICY "Anyone can read newsletter_campaigns" 
ON newsletter_campaigns FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert newsletter_campaigns" 
ON newsletter_campaigns FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));

CREATE POLICY "Only admins can update newsletter_campaigns" 
ON newsletter_campaigns FOR UPDATE 
TO authenticated 
USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));

-- Create policies for newsletter_events
CREATE POLICY "Only admins can read newsletter_events" 
ON newsletter_events FOR SELECT 
TO authenticated 
USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));

CREATE POLICY "System can insert newsletter_events" 
ON newsletter_events FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policies for music_nfts
CREATE POLICY "Anyone can read music_nfts" 
ON music_nfts FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert music_nfts" 
ON music_nfts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));

CREATE POLICY "Only admins can update music_nfts" 
ON music_nfts FOR UPDATE 
TO authenticated 
USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));
