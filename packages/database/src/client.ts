import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  return url;
}

const queryClient = postgres(getDatabaseUrl());

export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
