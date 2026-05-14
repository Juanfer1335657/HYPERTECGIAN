"use server";

import { getSql } from "@/lib/neon";
import { revalidatePath } from "next/cache";
import { Duration, getProducts } from "@/lib/db";

let _blob: any = null;
async function getBlob() {
  if (!_blob) {
    const { put: blobPut } = await import("@vercel/blob");
    _blob = blobPut;
  }
  return _blob;
}

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const imageURL = formData.get("imageURL") as string;
  const imageFile = formData.get("imageFile") as File;
  const priceUSD = parseFloat(formData.get("priceUSD") as string);
  const priceCOP = parseFloat(formData.get("priceCOP") as string);
  const duration = formData.get("duration") as Duration;

  if (!title || isNaN(priceUSD) || isNaN(priceCOP) || !duration) {
    throw new Error("Faltan campos requeridos");
  }

  let finalImage = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600";
  
  try {
    if (imageFile && imageFile.size > 0) {
      const put = await getBlob();
      const blob = await put(imageFile.name, imageFile, { access: "public" });
      finalImage = blob.url;
    } else if (imageURL) {
      finalImage = imageURL;
    }
  } catch (blobError) {
    if (imageURL) {
      finalImage = imageURL;
    }
  }

  const sql = getSql();
  const [result] = await sql.query(
    `INSERT INTO products (title, image, price_usd, price_cop, duration) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [title, finalImage, priceUSD, priceCOP, duration]
  );

  if (!result) {
    throw new Error("No se pudo crear el producto");
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
  if (!currentProduct) throw new Error("Producto no encontrado");

  let finalImage = currentProduct.image;
  try {
    if (imageFile && imageFile.size > 0) {
      const put = await getBlob();
      const blob = await put(imageFile.name, imageFile, { access: "public" });
      finalImage = blob.url;
    } else if (imageURL) {
      finalImage = imageURL;
    }
  } catch (e) {
    console.error("Error al actualizar imagen:", e);
  }

  const sql = getSql();
  await sql.query(
    `UPDATE products SET title = $1, image = $2, price_usd = $3, price_cop = $4, duration = $5 WHERE id = $6`,
    [
      title || currentProduct.title,
      finalImage,
      isNaN(priceUSD) ? currentProduct.priceUSD : priceUSD,
      isNaN(priceCOP) ? currentProduct.priceCOP : priceCOP,
      duration || currentProduct.duration,
      id
    ]
  );

  revalidatePath("/shop");
  revalidatePath("/admin");
}

export async function testConnection() {
  const sql = getSql();
  try {
    const result = await sql.query("SELECT COUNT(*) as count FROM products", []);
    return { data: result, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function deleteProduct(id: string) {
  const sql = getSql();
  await sql.query("DELETE FROM products WHERE id = $1", [id]);
  revalidatePath("/shop");
  revalidatePath("/admin");
}
