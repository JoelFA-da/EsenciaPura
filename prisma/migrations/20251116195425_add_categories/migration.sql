/*
  Warnings:

  - Added the required column `categoryId` to the `services` table without a default value. This is not possible if the table is not empty.

*/

-- Paso 1: Crear tabla de categorías
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Paso 2: Insertar categorías por defecto
INSERT INTO "categories" ("id", "name", "description", "imageUrl", "isActive", "order", "createdAt", "updatedAt") 
VALUES 
  ('cat-masajes', 'Masajes', 'Masajes terapéuticos y relajantes para tu bienestar', NULL, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-faciales', 'Tratamientos Faciales', 'Cuidado y rejuvenecimiento facial con productos naturales', NULL, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-corporales', 'Tratamientos Corporales', 'Tratamientos para el cuidado completo de tu cuerpo', NULL, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-especiales', 'Tratamientos Especiales', 'Servicios exclusivos y experiencias únicas', NULL, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Paso 3: Redefinir tabla services con la nueva columna categoryId
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "categoryId" TEXT NOT NULL DEFAULT 'cat-masajes',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Paso 4: Migrar datos existentes asignando categorías según el tipo de servicio
INSERT INTO "new_services" ("id", "name", "description", "price", "duration", "isActive", "imageUrl", "categoryId", "createdAt", "updatedAt") 
SELECT 
    "id", 
    "name", 
    "description", 
    "price", 
    "duration", 
    "isActive", 
    "imageUrl",
    CASE 
        WHEN LOWER("name") LIKE '%masaje%' OR LOWER("name") LIKE '%aromaterapia%' THEN 'cat-masajes'
        WHEN LOWER("name") LIKE '%facial%' OR LOWER("name") LIKE '%limpieza%' THEN 'cat-faciales'
        WHEN LOWER("name") LIKE '%corporal%' OR LOWER("name") LIKE '%exfoliaci%' THEN 'cat-corporales'
        ELSE 'cat-especiales'
    END,
    "createdAt", 
    "updatedAt" 
FROM "services";

DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
CREATE INDEX "services_categoryId_idx" ON "services"("categoryId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
