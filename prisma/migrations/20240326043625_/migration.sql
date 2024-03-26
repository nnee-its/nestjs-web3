-- AlterTable
ALTER TABLE "operators" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Pool" (
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

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);
