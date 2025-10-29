import { PrismaClient, Prisma } from "./generated/prisma";


const connectionString = process.env.DATABASE_URL || "";
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const loggerLevel = parseInt(process.env.NEXT_PUBLIC_LOGGER_LEVEL || "2", 10);

const prismaOptions: Prisma.PrismaClientOptions = {
  datasources: {
    db: {
      url: connectionString,
    },
  },
}

if (!isNaN(loggerLevel) && loggerLevel) {
  switch (loggerLevel) {
    case 5:
    case 6:
      prismaOptions.log = ["error"];
      break;
    case 4:
      prismaOptions.log = ["warn", "error"];
      break;
    case 3:
      prismaOptions.log = ["info", "error", "warn"];
      break;
    default:
      // For values 0, 1, 2 (or anything else below 3)
      prismaOptions.log = ["query", "info", "error", "warn"];
      break;
  }
}

const baseClient = globalForPrisma.prisma || new PrismaClient(prismaOptions);
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = baseClient;


export type { PrismaClient, Prisma };
export const prisma = baseClient;
