/*
  Warnings:

  - The primary key for the `Operator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `Operator` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Operator_signature_key";

-- DropIndex
DROP INDEX "Operator_walletAddress_key";

-- AlterTable
ALTER TABLE "Operator" DROP CONSTRAINT "Operator_pkey",
DROP COLUMN "id",
DROP COLUMN "signature",
ADD CONSTRAINT "Operator_pkey" PRIMARY KEY ("walletAddress");
