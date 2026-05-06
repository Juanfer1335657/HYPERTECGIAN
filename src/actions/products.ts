"use server";

import { getProducts, Product, Duration } from "@/lib/db";
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

  const newProduct: Omit<Product, "id" | "createdAt"> = {
    title,
    image: finalImage,
    priceUSD,
    priceCOP,
    duration,
  };

  const { error } = await supabase.from("products").insert([newProduct]);
  
  if (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
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
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Product not found");

  const uploadedURL = await handleFileUpload(imageFile);
  let finalImage = products[index].image;
  if (uploadedURL) {
    finalImage = uploadedURL;
  } else if (imageURL) {
    finalImage = imageURL;
  }

  products[index] = {
    ...products[index],
    title: title || products[index].title,
    image: finalImage,
    priceUSD: isNaN(priceUSD) ? products[index].priceUSD : priceUSD,
    priceCOP: isNaN(priceCOP) ? products[index].priceCOP : priceCOP,
    duration: duration || products[index].duration,
  };

  await saveProducts(products);
  revalidatePath("/shop");
  revalidatePath("/admin");
}

export async function deleteProduct(id: string) {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  await saveProducts(filtered);
  revalidatePath("/shop");
  revalidatePath("/admin");
}
