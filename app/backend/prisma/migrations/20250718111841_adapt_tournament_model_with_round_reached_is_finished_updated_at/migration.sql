/*
  Warnings:

  - You are about to drop the column `status` on the `tournaments` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tournaments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "maxPlayers" INTEGER NOT NULL DEFAULT 4,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "userNickname" TEXT NOT NULL DEFAULT 'Mister Bombastic',
    "bracket" JSONB NOT NULL,
    "roundReached" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tournaments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tournaments" ("bracket", "id", "isPrivate", "maxPlayers", "name", "userId", "userNickname") SELECT "bracket", "id", "isPrivate", "maxPlayers", "name", "userId", "userNickname" FROM "tournaments";
DROP TABLE "tournaments";
ALTER TABLE "new_tournaments" RENAME TO "tournaments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
