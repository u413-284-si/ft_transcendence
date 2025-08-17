-- CreateTable
CREATE TABLE "BackupCode" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "backupCode" TEXT,
    CONSTRAINT "BackupCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authentications" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
