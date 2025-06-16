-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_authentications" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT,
    "refreshToken" TEXT,
    "authProvider" TEXT NOT NULL DEFAULT 'LOCAL',
    CONSTRAINT "authentications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_authentications" ("password", "refreshToken", "userId") SELECT "password", "refreshToken", "userId" FROM "authentications";
DROP TABLE "authentications";
ALTER TABLE "new_authentications" RENAME TO "authentications";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
