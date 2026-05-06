import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: products, error } = await supabase.from("products").select("*");
  
  return Response.json({
    products,
    error,
    count: products?.length || 0,
  });
}