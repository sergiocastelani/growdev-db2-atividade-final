import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prisma from "../daos/prisma/_setup";

jest.mock("../../src/daos/prisma/_setup", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
    setupFilesAfterEnv: ["<rootDir>/tests/config/user_dao.mock.ts"],
}));

beforeEach(() => {
    mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;