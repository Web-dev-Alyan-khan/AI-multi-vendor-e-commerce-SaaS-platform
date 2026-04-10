import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon" // Corrected import
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

// Configuration for serverless environments
if (typeof window === 'undefined') {
    neonConfig.webSocketConstructor = ws;
}

// Optional: Force fetch for environments that don't support WebSockets
// neonConfig.poolQueryViaFetch = true 

const connectionString = `${process.env.DATABASE_URL}`;

// PrismaNeon requires a Pool instance, not a direct connection string object
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// Use a singleton pattern to prevent multiple active connections in development
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;