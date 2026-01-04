/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'This is a great product!',
ADD COLUMN     "minimumStock" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
