/*
  Warnings:

  - You are about to drop the column `totpSecret` on the `authentications` table. All the data in the column will be lost.
  - Made the column `backupCode` on table `BackupCode` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BackupCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "backupCode" TEXT NOT NULL,
    CONSTRAINT "BackupCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authentications" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BackupCode" ("backupCode", "id", "userId") SELECT "backupCode", "id", "userId" FROM "BackupCode";
DROP TABLE "BackupCode";
ALTER TABLE "new_BackupCode" RENAME TO "BackupCode";
CREATE TABLE "new_authentications" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT,
    "refreshToken" TEXT,
    "authProvider" TEXT NOT NULL DEFAULT 'LOCAL',
    "twoFASecret" TEXT,
    "hasTwoFA" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "authentications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_authentications" ("authProvider", "hasTwoFA", "password", "refreshToken", "userId") SELECT "authProvider", "hasTwoFA", "password", "refreshToken", "userId" FROM "authentications";
DROP TABLE "authentications";
ALTER TABLE "new_authentications" RENAME TO "authentications";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
