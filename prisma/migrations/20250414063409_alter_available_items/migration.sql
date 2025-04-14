/*
  Warnings:

  - You are about to drop the column `rate` on the `AvailableItems` table. All the data in the column will be lost.
  - Added the required column `description` to the `AvailableItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `AvailableItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvailableItems" DROP COLUMN "rate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
