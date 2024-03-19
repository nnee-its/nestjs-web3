/*
  Warnings:

  - You are about to drop the column `walletKey` on the `Operator` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[signature]` on the table `Operator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signature` to the `Operator` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Operator_walletKey_key";

-- AlterTable
ALTER TABLE "Operator" DROP COLUMN "walletKey",
ADD COLUMN     "signature" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Operator_signature_key" ON "Operator"("signature");
