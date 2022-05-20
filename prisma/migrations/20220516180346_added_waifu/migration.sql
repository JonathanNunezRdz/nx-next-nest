-- CreateEnum
CREATE TYPE "WaifuLevel" AS ENUM ('topWaifu', 'jonin', 'chunin', 'genin', 'freeAgent');

-- CreateTable
CREATE TABLE "Waifu" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "level" "WaifuLevel" NOT NULL,
    "since" TIMESTAMP(3) NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Waifu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaifuImage" (
    "waifuId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "WaifuImage_pkey" PRIMARY KEY ("waifuId","imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Waifu_name_mediaId_key" ON "Waifu"("name", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "WaifuImage_waifuId_key" ON "WaifuImage"("waifuId");

-- CreateIndex
CREATE UNIQUE INDEX "WaifuImage_imageId_key" ON "WaifuImage"("imageId");

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaifuImage" ADD CONSTRAINT "WaifuImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaifuImage" ADD CONSTRAINT "WaifuImage_waifuId_fkey" FOREIGN KEY ("waifuId") REFERENCES "Waifu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
