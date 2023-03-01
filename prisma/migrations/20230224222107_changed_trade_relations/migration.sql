/*
  Warnings:

  - You are about to drop the column `offeringTradeId` on the `Waifu` table. All the data in the column will be lost.
  - You are about to drop the column `receivingTradeId` on the `Waifu` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Waifu" DROP CONSTRAINT "Waifu_offeringTradeId_fkey";

-- DropForeignKey
ALTER TABLE "Waifu" DROP CONSTRAINT "Waifu_receivingTradeId_fkey";

-- AlterTable
ALTER TABLE "Waifu" DROP COLUMN "offeringTradeId",
DROP COLUMN "receivingTradeId",
ADD COLUMN     "offeredTradeId" TEXT,
ADD COLUMN     "wantedTradeId" TEXT;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_wantedTradeId_fkey" FOREIGN KEY ("wantedTradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_offeredTradeId_fkey" FOREIGN KEY ("offeredTradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
