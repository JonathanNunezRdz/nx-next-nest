/*
  Warnings:

  - Added the required column `offeringTradeId` to the `Waifu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receivingTradeId` to the `Waifu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Waifu" ADD COLUMN     "offeringTradeId" TEXT NOT NULL,
ADD COLUMN     "receivingTradeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_receivingTradeId_fkey" FOREIGN KEY ("receivingTradeId") REFERENCES "Trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_offeringTradeId_fkey" FOREIGN KEY ("offeringTradeId") REFERENCES "Trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
