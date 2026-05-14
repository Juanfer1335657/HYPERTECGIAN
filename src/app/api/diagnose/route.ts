import { getSql } from "@/lib/neon";
import { NextResponse } from "next/server";

export async function GET() {
  const diagnostico: any = {
    timestamp: new Date().toISOString(),
    database: {},
    tablaProducts: {},
  };

  try {
    const sql = getSql();
    diagnostico.database.status = "conectado";

    const tablas = await sql.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `, []);
    diagnostico.database.tablas = tablas.map((t: any) => t.table_name);

    if (tablas.find((t: any) => t.table_name === "products")) {
      diagnostico.tablaProducts.existe = true;
      const columnas = await sql.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'products'
      `, []);
      diagnostico.tablaProducts.columnas = columnas;
    } else {
      diagnostico.tablaProducts.existe = false;
    }
  } catch (e: any) {
    diagnostico.error = e.message;
  }

  return NextResponse.json(diagnostico);
}