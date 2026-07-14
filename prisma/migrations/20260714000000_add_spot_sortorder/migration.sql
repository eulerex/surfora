-- AlterTable
ALTER TABLE "Spot" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 1000;

-- CreateIndex
CREATE INDEX "Spot_sortOrder_idx" ON "Spot"("sortOrder");

