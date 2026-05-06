import { createClient } from "@supabase/supabase-js";

export type Duration = "1 mes" | "3 meses" | "6 meses" | "12 meses";

export interface Product {
  id: string;
  image: string;
  title: string;
  priceUSD: number;
  priceCOP: number;
  duration: Duration;
  createdAt: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_KEY exists:", !!supabaseKey);

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*");
  
  if (error) {
    console.log("Supabase error:", error.message);
    return [];
  }
  
  return data || [];
}
