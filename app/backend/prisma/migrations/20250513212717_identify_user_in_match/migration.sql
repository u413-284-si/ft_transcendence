/*
  Warnings:

  - You are about to drop the column `opponentNickname` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `playerNickname` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `playerScore` on the `matches` table. All the data in the column will be lost.
  - Added the required column `player1Nickname` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1Score` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Nickname` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Score` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1Id" INTEGER,
    "player2Id" INTEGER,
    "player1Nickname" TEXT NOT NULL,
    "player2Nickname" TEXT NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "tournamentId" INTEGER,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "matches_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "matches_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_matches" ("id", "player1Id", "player2Id", "player1Nickname", "player2Nickname", "player1Score", "player2Score", "tournamentId", "date")
SELECT
    "id",
    NULL,              -- player1Id
    NULL,              -- player2Id
    "playerNickname",  -- player1Nickname
    "opponentNickname",-- player2Nickname
    "playerScore",     -- player1Score
    "opponentScore",   -- player2Score
    "tournamentId",
    "date" FROM "matches";
DROP TABLE "matches";
ALTER TABLE "new_matches" RENAME TO "matches";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
