import { getSql } from "@/lib/neon";

export async function GET() {
  const sql = getSql();
  try {
    const tables = await sql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    return Response.json({ tables });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}