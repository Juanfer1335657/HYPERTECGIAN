import { supabase } from "@/lib/supabase";

export async function POST() {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        title: "Producto de Prueba",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600",
        priceUSD: 99,
        priceCOP: 390000,
        duration: "1 mes",
      },
    ])
    .select();

  return Response.json({ data, error });
}