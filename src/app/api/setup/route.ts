import { getSql } from "@/lib/neon";

export async function GET() {
  const sql = getSql();
  
  try {
    const result = await sql.query(`
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
    
    return Response.json({ success: true, message: "Tabla creada o ya existente" });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}