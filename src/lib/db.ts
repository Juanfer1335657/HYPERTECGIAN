import { supabase } from "./supabase";

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

export async function getProducts(): Promise<Product[]> {
  console.log("Fetching products from:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  const { data, error } = await supabase
    .from("products")
    .select("*");
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  console.log("Products found:", data?.length || 0);
  return data || [];
}
