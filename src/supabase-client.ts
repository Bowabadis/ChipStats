import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mjlhlxkmakbwrjmziaft.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);