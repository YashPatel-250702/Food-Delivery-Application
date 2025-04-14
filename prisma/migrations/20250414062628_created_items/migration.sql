-- CreateTable
CREATE TABLE "AvailableItems" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "AvailableItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AvailableItems" ADD CONSTRAINT "AvailableItems_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
