-- Create user_roles table for role-based access control
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL,
    role TEXT NOT NULL, -- admin, creator, buyer, team
    UNIQUE(user_id, role)
);

-- Create organizations table
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id TEXT NOT NULL,
    metadata JSONB
);

-- Create organization_members table
CREATE TABLE organization_members (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL, -- owner, admin, member
    UNIQUE(organization_id, user_id)
);

-- Create organization_invites table
CREATE TABLE organization_invites (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL, -- admin, member
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(organization_id, email)
);

-- Add RLS policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Only admins can read user_roles" 
ON user_roles FOR SELECT 
TO authenticated 
USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
) OR auth.uid() = user_id);

CREATE POLICY "Only admins can insert user_roles" 
ON user_roles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));

-- Create policies for organizations
CREATE POLICY "Anyone can read organizations" 
ON organizations FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create organizations" 
ON organizations FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Organization owners can update organizations" 
ON organizations FOR UPDATE 
TO authenticated 
USING (auth.uid() = owner_id);

-- Create policies for organization_members
CREATE POLICY "Organization members can read organization_members" 
ON organization_members FOR SELECT 
TO authenticated 
USING (auth.uid() IN (
    SELECT user_id FROM organization_members WHERE organization_id = organization_members.organization_id
) OR auth.uid() IN (
    SELECT owner_id FROM organizations WHERE id = organization_members.organization_id
));

CREATE POLICY "Organization owners and admins can insert organization_members" 
ON organization_members FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = organization_members.organization_id AND role IN ('owner', 'admin')
) OR auth.uid() IN (
    SELECT owner_id FROM organizations WHERE id = organization_members.organization_id
));

-- Create policies for organization_invites
CREATE POLICY "Organization members can read organization_invites" 
ON organization_invites FOR SELECT 
TO authenticated 
USING (auth.uid() IN (
    SELECT user_id FROM organization_members WHERE organization_id = organization_invites.organization_id
) OR auth.uid() IN (
    SELECT owner_id FROM organizations WHERE id = organization_invites.organization_id
));

CREATE POLICY "Organization owners and admins can insert organization_invites
