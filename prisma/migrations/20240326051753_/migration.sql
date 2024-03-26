/*
  Warnings:

  - You are about to alter the column `idoPrice` on the `pools` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `totalRaise` on the `pools` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "pools" ALTER COLUMN "idoPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalRaise" SET DATA TYPE DOUBLE PRECISION;
