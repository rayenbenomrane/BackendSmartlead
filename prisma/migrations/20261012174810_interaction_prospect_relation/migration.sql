/*
  Warnings:

  - You are about to drop the column `leadId` on the `Interaction` table. All the data in the column will be lost.
  - Added the required column `prospectId` to the `Interaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_leadId_fkey";

-- DropIndex
DROP INDEX "Interaction_leadId_idx";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "leadId",
ADD COLUMN     "prospectId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Interaction_prospectId_idx" ON "Interaction"("prospectId");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
