import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction | null = null;

export function getSql(): NeonQueryFunction {
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

export function sql(...args: Parameters<NeonQueryFunction>) {
  return getSql()(...args);
}