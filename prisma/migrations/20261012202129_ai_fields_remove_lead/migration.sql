/*
  Warnings:

  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "ProspectStatus" ADD VALUE 'PROPOSAL_SENT';

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_ownerId_fkey";

-- AlterTable
ALTER TABLE "Prospect" ADD COLUMN     "aiActions" JSONB,
ADD COLUMN     "aiAnalysis" JSONB,
ADD COLUMN     "aiScoreDetails" JSONB,
ADD COLUMN     "aiSummary" JSONB,
ADD COLUMN     "aiUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "score" INTEGER;

-- DropTable
DROP TABLE "Lead";

-- DropEnum
DROP TYPE "LeadStatus";

-- CreateIndex
CREATE INDEX "Prospect_score_idx" ON "Prospect"("score");
