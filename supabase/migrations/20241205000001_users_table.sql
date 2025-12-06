-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free', -- 'free', 'pro'
  credits INT DEFAULT 0, -- For pay-per-use packs
  generations_this_month INT DEFAULT 0, -- For free tier limit
  generations_reset_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 month',
  subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- RLS Policies (Optional for now if only using Service Role Key)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
