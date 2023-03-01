-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('pending', 'declined', 'accepted');

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "status" "TradeStatus" NOT NULL DEFAULT E'pending';
