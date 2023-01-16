/*
  Warnings:

  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `KnownMedia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Media` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MediaImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Waifu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `WaifuImage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "KnownMedia" DROP CONSTRAINT "KnownMedia_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "KnownMedia" DROP CONSTRAINT "KnownMedia_userId_fkey";

-- DropForeignKey
ALTER TABLE "MediaImage" DROP CONSTRAINT "MediaImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "MediaImage" DROP CONSTRAINT "MediaImage_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "UserImage" DROP CONSTRAINT "UserImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "UserImage" DROP CONSTRAINT "UserImage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Waifu" DROP CONSTRAINT "Waifu_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Waifu" DROP CONSTRAINT "Waifu_userId_fkey";

-- DropForeignKey
ALTER TABLE "WaifuImage" DROP CONSTRAINT "WaifuImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "WaifuImage" DROP CONSTRAINT "WaifuImage_waifuId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP CONSTRAINT "Image_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Image_id_seq";

-- AlterTable
ALTER TABLE "KnownMedia" DROP CONSTRAINT "KnownMedia_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "mediaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "KnownMedia_pkey" PRIMARY KEY ("userId", "mediaId");

-- AlterTable
ALTER TABLE "Media" DROP CONSTRAINT "Media_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Media_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Media_id_seq";

-- AlterTable
ALTER TABLE "MediaImage" DROP CONSTRAINT "MediaImage_pkey",
ALTER COLUMN "mediaId" SET DATA TYPE TEXT,
ALTER COLUMN "imageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MediaImage_pkey" PRIMARY KEY ("mediaId", "imageId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UserImage" DROP CONSTRAINT "UserImage_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "imageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserImage_pkey" PRIMARY KEY ("userId", "imageId");

-- AlterTable
ALTER TABLE "Waifu" DROP CONSTRAINT "Waifu_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "mediaId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Waifu_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Waifu_id_seq";

-- AlterTable
ALTER TABLE "WaifuImage" DROP CONSTRAINT "WaifuImage_pkey",
ALTER COLUMN "waifuId" SET DATA TYPE TEXT,
ALTER COLUMN "imageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "WaifuImage_pkey" PRIMARY KEY ("waifuId", "imageId");

-- AddForeignKey
ALTER TABLE "UserImage" ADD CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserImage" ADD CONSTRAINT "UserImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnownMedia" ADD CONSTRAINT "KnownMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnownMedia" ADD CONSTRAINT "KnownMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaifuImage" ADD CONSTRAINT "WaifuImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaifuImage" ADD CONSTRAINT "WaifuImage_waifuId_fkey" FOREIGN KEY ("waifuId") REFERENCES "Waifu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
