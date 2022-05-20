/*
  Warnings:

  - The values [ANIME,MANGA,VIDEOGAME] on the enum `MediaType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ImageFormat" AS ENUM ('apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp');

-- AlterEnum
BEGIN;
CREATE TYPE "MediaType_new" AS ENUM ('anime', 'manga', 'videogame');
ALTER TABLE "Media" ALTER COLUMN "type" TYPE "MediaType_new" USING ("type"::text::"MediaType_new");
ALTER TYPE "MediaType" RENAME TO "MediaType_old";
ALTER TYPE "MediaType_new" RENAME TO "MediaType";
DROP TYPE "MediaType_old";
COMMIT;
