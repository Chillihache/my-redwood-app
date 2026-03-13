/*
  Warnings:

  - A unique constraint covering the columns `[url,searchId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Search" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "keywords" TEXT NOT NULL,
    "location" TEXT,
    "lastPage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Search_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Search" ("createdAt", "id", "keywords", "location", "userId") SELECT "createdAt", "id", "keywords", "location", "userId" FROM "Search";
DROP TABLE "Search";
ALTER TABLE "new_Search" RENAME TO "Search";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_url_searchId_key" ON "Profile"("url", "searchId");
