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

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
  }
  return supabase;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await getSupabase().from("products").select("*");
    return data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}