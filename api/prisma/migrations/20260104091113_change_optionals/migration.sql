/*
  Warnings:

  - Made the column `avatarPublicId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "avatarPublicId" SET NOT NULL,
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "category" DROP DEFAULT;
