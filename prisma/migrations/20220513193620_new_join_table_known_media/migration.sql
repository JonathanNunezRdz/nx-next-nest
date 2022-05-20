/*
  Warnings:

  - You are about to drop the `_MediaToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MediaToUser" DROP CONSTRAINT "_MediaToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MediaToUser" DROP CONSTRAINT "_MediaToUser_B_fkey";

-- DropTable
DROP TABLE "_MediaToUser";

-- CreateTable
CREATE TABLE "KnownMedia" (
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "knownAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnownMedia_pkey" PRIMARY KEY ("userId","mediaId")
);

-- AddForeignKey
ALTER TABLE "KnownMedia" ADD CONSTRAINT "KnownMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnownMedia" ADD CONSTRAINT "KnownMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
