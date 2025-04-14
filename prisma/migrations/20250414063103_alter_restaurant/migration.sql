/*
  Warnings:

  - You are about to drop the column `orderCapacity` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `closingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderCapacityPerDay` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "orderCapacity",
ADD COLUMN     "closingTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "openTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "orderCapacityPerDay" INTEGER NOT NULL;
