/*
  Warnings:

  - Added the required column `bracket` to the `tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tournaments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "maxPlayers" INTEGER NOT NULL DEFAULT 4,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "adminId" INTEGER NOT NULL,
    "bracket" JSONB NOT NULL,
    CONSTRAINT "tournaments_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tournaments" ("adminId", "id", "isPrivate", "maxPlayers", "name", "status") SELECT "adminId", "id", "isPrivate", "maxPlayers", "name", "status" FROM "tournaments";
DROP TABLE "tournaments";
ALTER TABLE "new_tournaments" RENAME TO "tournaments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
