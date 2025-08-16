/*
  Warnings:

  - The primary key for the `BackupCode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `BackupCode` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BackupCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "backupCode" TEXT,
    CONSTRAINT "BackupCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authentications" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BackupCode" ("backupCode", "userId") SELECT "backupCode", "userId" FROM "BackupCode";
DROP TABLE "BackupCode";
ALTER TABLE "new_BackupCode" RENAME TO "BackupCode";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
