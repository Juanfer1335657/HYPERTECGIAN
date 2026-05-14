import { neon } from "@neondatabase/serverless";

let _sql: any = null;

export function getSql() {
  if (!_sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("DATABASE_URL no está configurada");
      throw new Error("DATABASE_URL environment variable is not set");
    }
    console.log("Inicializando conexión a Neon...");
    _sql = neon(databaseUrl);
    console.log("Conexión a Neon inicializada correctamente");
  }
  return _sql;
}

export const sql = Object.assign(getSql(), {
  query: async function(query: string, params: any[] = []) {
    const sqlFn = getSql();
    return sqlFn.query(query, params);
  }
});