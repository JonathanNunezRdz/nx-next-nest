/*
  Warnings:

  - You are about to drop the column `imageId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_imageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_imageId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "imageId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageId";

-- CreateTable
CREATE TABLE "UserImage" (
    "userId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "UserImage_pkey" PRIMARY KEY ("userId","imageId")
);

-- CreateTable
CREATE TABLE "MediaImage" (
    "mediaId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "MediaImage_pkey" PRIMARY KEY ("mediaId","imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_userId_key" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_imageId_key" ON "UserImage"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaImage_mediaId_key" ON "MediaImage"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaImage_imageId_key" ON "MediaImage"("imageId");

-- AddForeignKey
ALTER TABLE "UserImage" ADD CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserImage" ADD CONSTRAINT "UserImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
