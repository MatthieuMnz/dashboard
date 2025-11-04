import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle',
  // If you later split schemas, prefer './lib/schema/**/*.ts'
  schema: ['./lib/schema.ts'],
  dbCredentials: {
    url: process.env.POSTGRES_URL!
  }
});


