import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: products, error } = await supabase.from("products").select("*").limit(5);
  
  return Response.json({
    products,
    error,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}