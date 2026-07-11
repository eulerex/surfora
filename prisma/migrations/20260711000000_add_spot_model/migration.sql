-- CreateEnum
CREATE TYPE "Region" AS ENUM ('SHONAN', 'CHIBA', 'SHIZUOKA', 'MIYAZAKI');

-- CreateTable
CREATE TABLE "Spot" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nameJa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameZh" TEXT,
    "region" "Region" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "trainAccessible" BOOLEAN NOT NULL DEFAULT false,
    "beginnerFriendly" BOOLEAN NOT NULL DEFAULT false,
    "boardTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "optimalSwellDir" TEXT,
    "offshoreWindDir" TEXT,
    "descJa" TEXT,
    "descEn" TEXT,
    "descZh" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Spot_slug_key" ON "Spot"("slug");

-- CreateIndex
CREATE INDEX "Spot_region_idx" ON "Spot"("region");

