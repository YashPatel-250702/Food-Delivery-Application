/*
  Warnings:

  - Added the required column `OwnerName` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderCapacity` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantType` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "OwnerName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderCapacity" INTEGER NOT NULL,
ADD COLUMN     "restaurantType" TEXT NOT NULL,
ALTER COLUMN "address" SET DATA TYPE TEXT;
