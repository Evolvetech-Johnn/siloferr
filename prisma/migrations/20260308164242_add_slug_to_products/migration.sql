/*
  Warnings:

  - The required column `slug` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "details" TEXT,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "images" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "priceRequestCnt" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "createdAt", "description", "id", "image", "isFeatured", "priceRequestCnt", "title", "updatedAt") SELECT "category", "createdAt", "description", "id", "image", "isFeatured", "priceRequestCnt", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE TABLE "new_QuoteRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT,
    "equipmentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuoteRequest_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QuoteRequest" ("company", "createdAt", "email", "equipmentId", "id", "message", "name", "phone", "status", "updatedAt") SELECT "company", "createdAt", "email", "equipmentId", "id", "message", "name", "phone", "status", "updatedAt" FROM "QuoteRequest";
DROP TABLE "QuoteRequest";
ALTER TABLE "new_QuoteRequest" RENAME TO "QuoteRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
