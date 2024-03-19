import { PrismaClient } from "@prisma/client";

export const repository = new PrismaClient();
export default repository;