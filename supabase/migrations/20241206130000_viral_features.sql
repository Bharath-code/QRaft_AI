-- Features for Phase 10

-- 1. Links Table (For Shortlinks/Recruiter Radar)
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL, -- The "code" in /r/[code]
  destination TEXT NOT NULL,
  title TEXT,
  active BOOLEAN DEFAULT true,
  track_scans BOOLEAN DEFAULT true, -- Recruiter Radar enabled?
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_slug ON links(slug);
CREATE INDEX IF NOT EXISTS idx_links_user ON links(user_id);

-- 2. Scans Table (Analytics)
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  ip TEXT,
  city TEXT,
  country TEXT,
  device TEXT,
  user_agent TEXT,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scans_link ON scans(link_id);

-- 3. Messages Table (Tea Box)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- The anonymous tea
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);

-- RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own links" ON links USING (auth.uid() = user_id);
CREATE POLICY "Public can read links by slug" ON links FOR SELECT USING (true); -- Needed for redirect

CREATE POLICY "Users can view own scans" ON scans USING (
  EXISTS (SELECT 1 FROM links WHERE links.id = scans.link_id AND links.user_id = auth.uid())
);
CREATE POLICY "Service Role can insert scans" ON scans FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view received messages" ON messages FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true); -- Anonymous sending
