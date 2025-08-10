-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_stats" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "matchesWon" INTEGER NOT NULL DEFAULT 0,
    "winstreakCur" INTEGER NOT NULL DEFAULT 0,
    "winstreakMax" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_stats" ("matchesPlayed", "matchesWon", "userId") SELECT "matchesPlayed", "matchesWon", "userId" FROM "user_stats";
DROP TABLE "user_stats";
ALTER TABLE "new_user_stats" RENAME TO "user_stats";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
