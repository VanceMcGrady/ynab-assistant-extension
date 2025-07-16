// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABSE_URL;
const supabaseAnonKey = process.env.SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
