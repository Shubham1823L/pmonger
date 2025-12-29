/*
  Warnings:

  - You are about to drop the column `authorId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_authorId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "authorId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
