import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// This is the secret sauce for making Neon work in background functions
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

// Create the connection pool
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;