import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction | null = null;

export function getSql(): NeonQueryFunction {
  if (!_sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _sql = neon(databaseUrl);
  }
  return _sql;
}

export function sql(...args: Parameters<NeonQueryFunction>) {
  return getSql()(...args);
}