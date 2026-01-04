/*
  Warnings:

  - You are about to drop the column `categories` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categories",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT '';
