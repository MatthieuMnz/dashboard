import 'server-only';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);
