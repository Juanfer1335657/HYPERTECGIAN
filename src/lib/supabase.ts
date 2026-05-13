import { getSql } from "./neon";

export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      then: async (resolve: (value: { data: unknown[]; error: null | Error }) => void) => {
        try {
          const cols = columns === "*" ? "*" : columns || "*";
          const sql = getSql();
          const rows = await sql(`SELECT ${cols} FROM ${table}`);
          resolve({ data: rows, error: null });
        } catch (e) {
          resolve({ data: [], error: e as Error });
        }
      },
      range: (start: number, end: number) => ({
        then: async (resolve: (value: { data: unknown[]; error: null | Error }) => void) => {
          try {
            const sql = getSql();
            const rows = await sql(`SELECT * FROM ${table} LIMIT ${end - start + 1} OFFSET ${start}`);
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
            const sql = getSql();
            const row = data[0] as Record<string, unknown>;
            const cols = Object.keys(row).join(", ");
            const vals = Object.keys(row).map((_, i) => `$${i + 1}`).join(", ");
            const values = Object.values(row);
            const [result] = await sql(
              `INSERT INTO ${table} (${cols}) VALUES (${vals}) RETURNING *`,
              ...values
            );
            resolve({ data: [result], error: null });
          } catch (e) {
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
            const sets = Object.keys(data).map((k, i) => `${k} = $${i + 1}`).join(", ");
            const values = [...Object.values(data), value];
            await sql(`UPDATE ${table} SET ${sets} WHERE ${field} = $${values.length}`, ...values);
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
            await sql(`DELETE FROM ${table} WHERE ${field} = $1`, [value]);
            resolve({ error: null });
          } catch (e) {
            resolve({ error: e as Error });
          }
        },
      }),
    }),
  }),
};