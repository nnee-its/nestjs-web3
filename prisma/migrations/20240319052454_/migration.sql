-- CreateEnum
CREATE TYPE "OperatorRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "Operator" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "walletKey" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "OperatorRole" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operator_walletAddress_key" ON "Operator"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_walletKey_key" ON "Operator"("walletKey");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_email_key" ON "Operator"("email");
