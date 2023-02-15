-- DropForeignKey
ALTER TABLE "KnownMedia" DROP CONSTRAINT "KnownMedia_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaImage" DROP CONSTRAINT "MediaImage_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Waifu" DROP CONSTRAINT "Waifu_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "WaifuImage" DROP CONSTRAINT "WaifuImage_waifuId_fkey";

-- AddForeignKey
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnownMedia" ADD CONSTRAINT "KnownMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaifuImage" ADD CONSTRAINT "WaifuImage_waifuId_fkey" FOREIGN KEY ("waifuId") REFERENCES "Waifu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
