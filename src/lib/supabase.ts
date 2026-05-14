import { getSql } from "./neon";

async function ensureTableExists(sql: any, tableName: string) {
  try {
    await sql.query(`SELECT 1 FROM ${tableName} LIMIT 1`, []);
  } catch {
    if (tableName === "products") {
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
  }
}

export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      then: async (resolve: (value: { data: unknown[]; error: null | Error }) => void) => {
        try {
          console.log(`SELECT de tabla: ${table}`);
          const sql = getSql();
          await ensureTableExists(sql, table);
          const cols = columns === "*" ? "*" : columns || "*";
          const rows = await sql.query(`SELECT ${cols} FROM ${table}`, []);
          console.log(`Rows obtenidas de ${table}:`, rows.length);
          resolve({ data: rows, error: null });
        } catch (e) {
          console.error(`Error en SELECT de ${table}:`, e);
          resolve({ data: [], error: e as Error });
        }
      },
      range: (start: number, end: number) => ({
        then: async (resolve: (value: { data: unknown[]; error: null | Error }) => void) => {
          try {
            const sql = getSql();
            await ensureTableExists(sql, table);
            const rows = await sql.query(`SELECT * FROM ${table} LIMIT ${end - start + 1} OFFSET ${start}`, []);
            resolve({ data: rows, error: null });
          } catch (e) {
            resolve({ data: [], error: e as Error });
          }
        },
      }),
    }),
    insert: (data: unknown[]) => ({
      select: () => ({
        then: async (resolve: (value: { data: unknown[]; error: null | Error }) => void) => {
          try {
            console.log(`INSERT en tabla: ${table}`);
            const sql = getSql();
            await ensureTableExists(sql, table);
            const row = data[0] as Record<string, unknown>;
            const cols = Object.keys(row).join(", ");
            const vals = Object.keys(row).map((_, i) => `$${i + 1}`).join(", ");
            const values = Object.values(row);
            console.log("Valores a insertar:", values);
            const [result] = await sql.query(
              `INSERT INTO ${table} (${cols}) VALUES (${vals}) RETURNING *`,
              values
            );
            console.log("Resultado insert:", result);
            resolve({ data: [result], error: null });
          } catch (e: any) {
            console.error(`Error en INSERT de ${table}:`, e);
            resolve({ data: [], error: e as Error });
          }
        },
      }),
    }),
    update: (data: Record<string, unknown>) => ({
      eq: (field: string, value: unknown) => ({
        then: async (resolve: (value: { error: null | Error }) => void) => {
          try {
            const sql = getSql();
            await ensureTableExists(sql, table);
            const sets = Object.keys(data).map((k, i) => `${k} = $${i + 1}`).join(", ");
            const values = [...Object.values(data), value];
            await sql.query(`UPDATE ${table} SET ${sets} WHERE ${field} = $${values.length}`, values);
            resolve({ error: null });
          } catch (e) {
            resolve({ error: e as Error });
          }
        },
      }),
    }),
    delete: () => ({
      eq: (field: string, value: unknown) => ({
        then: async (resolve: (value: { error: null | Error }) => void) => {
          try {
            const sql = getSql();
            await ensureTableExists(sql, table);
            await sql.query(`DELETE FROM ${table} WHERE ${field} = $1`, [value]);
            resolve({ error: null });
          } catch (e) {
            resolve({ error: e as Error });
          }
        },
      }),
    }),
  }),
};