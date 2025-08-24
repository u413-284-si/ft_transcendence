/*
  Warnings:

  - You are about to drop the column `bracket` on the `tournaments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tournamentId,bracketMatchNumber]` on the table `matches` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "matches" ADD COLUMN "bracketMatchNumber" INTEGER;

-- CreateTable
CREATE TABLE "bracket_matches" (
    "tournamentId" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "player1Nickname" TEXT,
    "player2Nickname" TEXT,
    "player1Type" TEXT NOT NULL DEFAULT 'HUMAN',
    "player2Type" TEXT NOT NULL DEFAULT 'HUMAN',
    "winner" TEXT,
    "nextMatchNumber" INTEGER,
    "winnerSlot" INTEGER,

    PRIMARY KEY ("tournamentId", "matchNumber"),
    CONSTRAINT "bracket_matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bracket_matches_tournamentId_matchNumber_fkey" FOREIGN KEY ("tournamentId", "matchNumber") REFERENCES "matches" ("tournamentId", "bracketMatchNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "roundReached" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tournaments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tournaments" ("id", "isFinished", "isPrivate", "maxPlayers", "name", "roundReached", "updatedAt", "userId", "userNickname") SELECT "id", "isFinished", "isPrivate", "maxPlayers", "name", "roundReached", "updatedAt", "userId", "userNickname" FROM "tournaments";
DROP TABLE "tournaments";
ALTER TABLE "new_tournaments" RENAME TO "tournaments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "matches_tournamentId_bracketMatchNumber_key" ON "matches"("tournamentId", "bracketMatchNumber");
