import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set — check your .env.local file');
}

// Tagged-template query function: sql`select * from transactions where id = ${id}`
export const sql = neon(process.env.DATABASE_URL);
