"use server";

import { getProducts, Product, Duration } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const imageURL = formData.get("imageURL") as string;
  const imageFile = formData.get("imageFile") as File;
  const priceUSD = parseFloat(formData.get("priceUSD") as string);
  const priceCOP = parseFloat(formData.get("priceCOP") as string);
  const duration = formData.get("duration") as Duration;

  if (!title || !priceUSD || !priceCOP || !duration) {
    throw new Error("Missing required fields");
  }

  let finalImage = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600";
  
  if (imageFile && imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, {
      access: "public",
    });
    finalImage = blob.url;
  } else if (imageURL) {
    finalImage = imageURL;
  }

  const newProduct = {
    title,
    image: finalImage,
    priceUSD,
    priceCOP,
    duration,
  };

  console.log("Inserting product:", JSON.stringify(newProduct));
  
  const { error, data } = await supabase.from("products").insert([newProduct]).select();
  
  console.log("Insert result:", { error, data });
  
  if (error) {
    console.error("Error creating product:", JSON.stringify(error));
    throw new Error(error.message);
  }

  revalidatePath("/shop");
  revalidatePath("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const imageURL = formData.get("imageURL") as string;
  const imageFile = formData.get("imageFile") as File;
  const priceUSD = parseFloat(formData.get("priceUSD") as string);
  const priceCOP = parseFloat(formData.get("priceCOP") as string);
  const duration = formData.get("duration") as Duration;

  const products = await getProducts();
  const currentProduct = products.find((p) => p.id === id);
  if (!currentProduct) throw new Error("Product not found");

  let finalImage = currentProduct.image;
  if (imageFile && imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, { access: "public" });
    finalImage = blob.url;
  } else if (imageURL) {
    finalImage = imageURL;
  }

  const { error } = await supabase
    .from("products")
    .update({
      title: title || currentProduct.title,
      image: finalImage,
      priceUSD: isNaN(priceUSD) ? currentProduct.priceUSD : priceUSD,
      priceCOP: isNaN(priceCOP) ? currentProduct.priceCOP : priceCOP,
      duration: duration || currentProduct.duration,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }

  revalidatePath("/shop");
  revalidatePath("/admin");
}

export async function testConnection() {
  const { data, error } = await supabase.from("products").select("count").range(0, 0);
  return { data, error };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }

  revalidatePath("/shop");
  revalidatePath("/admin");
}
