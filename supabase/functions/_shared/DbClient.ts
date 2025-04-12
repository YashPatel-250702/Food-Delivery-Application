import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

const supabase_Url:string = Deno.env.get("SUPABASE_URL")!;
const supabase_Anon_Key:string = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabase = createClient(supabase_Url, supabase_Anon_Key);
export default supabase;