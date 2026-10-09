-- CreateEnum
CREATE TYPE "ProspectStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "ProspectSource" AS ENUM ('WEBSITE', 'FACEBOOK', 'LINKEDIN', 'REFERRAL', 'OTHER');

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "industry" TEXT,
    "region" TEXT,
    "website" TEXT,
    "source" "ProspectSource" NOT NULL DEFAULT 'OTHER',
    "status" "ProspectStatus" NOT NULL DEFAULT 'NEW',
    "estimatedValue" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prospect_businessId_idx" ON "Prospect"("businessId");

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
