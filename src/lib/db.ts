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
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("createdAt", { ascending: false });
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data || [];
}
