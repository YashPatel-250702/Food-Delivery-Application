import { PrismaClient } from "../generated/client/deno/edge.js";
import { config } from "https://deno.land/std@0.163.0/dotenv/mod.ts";

export default async function getPrismaClient() {
    const envVars = await config();

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: Deno.env.get("DATABASE_URL") || envVars.DATABASE_URL || "",
            },
        },
    });

    return prisma;
}
