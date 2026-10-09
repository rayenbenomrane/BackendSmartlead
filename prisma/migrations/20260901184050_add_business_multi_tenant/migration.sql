/*
  Warnings:

  - A unique constraint covering the columns `[matriculeFiscale]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matriculeFiscale` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceDomain` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "address" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "matriculeFiscale" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "serviceDomain" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Business_matriculeFiscale_key" ON "Business"("matriculeFiscale");
