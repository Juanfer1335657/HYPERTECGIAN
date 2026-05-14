import { neon } from "@neondatabase/serverless";

let _sql: any = null;

export function getSql() {
  if (!_sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _sql = neon(databaseUrl);
  }
  return _sql;
}

export const sql = Object.assign(getSql(), {
  query: async function(query: string, params: any[] = []) {
    const sqlFn = getSql();
    return sqlFn.query(query, params);
  }
});