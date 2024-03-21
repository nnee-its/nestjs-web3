/*
  Warnings:

  - You are about to drop the `Operator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Operator";

-- CreateTable
CREATE TABLE "operators" (
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "role" "OperatorRole" NOT NULL DEFAULT 'VIEWER',
    "refreshToken" TEXT,

    CONSTRAINT "operators_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "operators_email_key" ON "operators"("email");
