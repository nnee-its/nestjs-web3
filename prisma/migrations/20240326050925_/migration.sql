/*
  Warnings:

  - You are about to drop the `Pool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Pool";

-- CreateTable
CREATE TABLE "pools" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "projectName" TEXT NOT NULL,
    "idoPrice" DECIMAL(65,30) NOT NULL,
    "totalRaise" DECIMAL(65,30) NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenNetwork" TEXT NOT NULL,
    "idoNetwork" TEXT NOT NULL,
    "socials" JSONB NOT NULL,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);
