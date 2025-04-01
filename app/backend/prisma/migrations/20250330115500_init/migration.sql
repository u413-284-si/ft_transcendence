-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "avatar" TEXT,
    "dateJoined" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "authentications" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT,
    CONSTRAINT "authentications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_stats" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "matchesWon" INTEGER NOT NULL DEFAULT 0,
    "matchesLost" INTEGER NOT NULL DEFAULT 0,
    "winRate" REAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account_status" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lastActivity" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "account_status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "friends" (
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "friendId"),
    CONSTRAINT "friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "playerNickname" TEXT NOT NULL,
    "opponentNickname" TEXT NOT NULL,
    "tournamentId" INTEGER,
    "playerScore" INTEGER NOT NULL,
    "opponentScore" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "matches_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "maxPlayers" INTEGER NOT NULL DEFAULT 4,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "adminId" INTEGER NOT NULL,
    CONSTRAINT "tournaments_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
