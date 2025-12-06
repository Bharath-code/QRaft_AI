import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for API routes (Server-side admin)
// Using supabase-js directly is fine with Service Key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
