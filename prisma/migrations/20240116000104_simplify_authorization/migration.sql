/*
  Warnings:

  - You are about to drop the `Authorization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Authorization" DROP CONSTRAINT "Authorization_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "token" TEXT;

-- DropTable
DROP TABLE "Authorization";
