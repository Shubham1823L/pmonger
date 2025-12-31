/*
  Warnings:

  - The values [DRAFT,PUBLISHED] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('Draft', 'Published');
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "public"."ProductStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "avatarPublicId" DROP NOT NULL;
