-- Create customer support messages table with SHA-1 hashing
CREATE TABLE customer_support_messages (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL,
    message_hash TEXT NOT NULL, -- SHA-1 hash of the message content
    message_preview TEXT NOT NULL, -- First 50 characters of the message for preview
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    category TEXT,
    priority TEXT DEFAULT 'normal'
);

-- Create message responses table
CREATE TABLE message_responses (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_id BIGINT REFERENCES customer_support_messages(id) ON DELETE CASCADE,
    admin_id TEXT NOT NULL,
    response_text TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT FALSE
);

-- Create message attachments table
CREATE TABLE message_attachments (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_id BIGINT REFERENCES customer_support_messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL
);

-- Add indexes for performance
CREATE INDEX idx_customer_support_messages_user_id ON customer_support_messages(user_id);
CREATE INDEX idx_message_responses_message_id ON message_responses(message_id);
CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);

-- Add RLS policies
ALTER TABLE customer_support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Users can read and create their own messages
CREATE POLICY "Users can read their own messages" 
ON customer_support_messages FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages" 
ON customer_support_messages FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Admins can read all messages
CREATE POLICY "Admins can read all messages" 
ON customer_support_messages FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
));

-- Admins can update all messages
CREATE POLICY "Admins can update all messages" 
ON customer_support_messages FOR UPDATE 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
));

-- Similar policies for responses and attachments
