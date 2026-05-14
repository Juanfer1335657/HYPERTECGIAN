import { getSql } from "./neon";

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
  try {
    const sql = getSql();
    try {
      await sql.query("SELECT 1 FROM products LIMIT 1", []);
    } catch {
      await sql.query(`
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          image TEXT NOT NULL,
          price_usd DECIMAL(10, 2) NOT NULL,
          price_cop BIGINT NOT NULL,
          duration TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, []);
    }
    const rows = await sql.query("SELECT * FROM products ORDER BY created_at DESC", []);
    return rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      image: row.image as string,
      title: row.title as string,
      priceUSD: Number(row.price_usd),
      priceCOP: Number(row.price_cop),
      duration: row.duration as Duration,
      createdAt: row.created_at as string,
    }));
  } catch (e) {
    console.error("Error getting products:", e);
    return [];
  }
}

export async function createProduct(product: {
  title: string;
  image: string;
  priceUSD: number;
  priceCOP: number;
  duration: Duration;
}): Promise<Product> {
  const sql = getSql();
  const [row] = await sql.query(
    `INSERT INTO products (title, image, price_usd, price_cop, duration)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [product.title, product.image, product.priceUSD, product.priceCOP, product.duration]
  );
  return {
    id: row.id as string,
    image: row.image as string,
    title: row.title as string,
    priceUSD: row.price_usd as number,
    priceCOP: row.price_cop as number,
    duration: row.duration as Duration,
    createdAt: row.created_at as string,
  };
}

export async function updateProduct(
  id: string,
  product: Partial<{
    title: string;
    image: string;
    priceUSD: number;
    priceCOP: number;
    duration: Duration;
  }>
): Promise<void> {
  const sql = getSql();
  const sets: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (product.title !== undefined) {
    sets.push(`title = $${idx++}`);
    values.push(product.title);
  }
  if (product.image !== undefined) {
    sets.push(`image = $${idx++}`);
    values.push(product.image);
  }
  if (product.priceUSD !== undefined) {
    sets.push(`price_usd = $${idx++}`);
    values.push(product.priceUSD);
  }
  if (product.priceCOP !== undefined) {
    sets.push(`price_cop = $${idx++}`);
    values.push(product.priceCOP);
  }
  if (product.duration !== undefined) {
    sets.push(`duration = $${idx++}`);
    values.push(product.duration);
  }

  if (sets.length === 0) return;

  values.push(id);
  await sql.query(`UPDATE products SET ${sets.join(", ")} WHERE id = $${idx}`, values);
}

export async function deleteProduct(id: string): Promise<void> {
  const sql = getSql();
  await sql.query("DELETE FROM products WHERE id = $1", [id]);
}