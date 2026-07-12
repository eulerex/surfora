-- CreateTable
CREATE TABLE "Cam" (
    "id" SERIAL NOT NULL,
    "spotId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "nameJa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameZh" TEXT,
    "youtubeVideoId" TEXT,
    "youtubeChannelId" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'youtube',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cam_slug_key" ON "Cam"("slug");

-- CreateIndex
CREATE INDEX "Cam_spotId_idx" ON "Cam"("spotId");

-- AddForeignKey
ALTER TABLE "Cam" ADD CONSTRAINT "Cam_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

