-- ========================================
-- ESENCIA PURA - MIGRACIÓN COMPLETA PARA POSTGRESQL
-- Ejecutar este script en el SQL Editor de Supabase
-- ========================================

-- 1. CREAR ENUM PARA BOOKINGS
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- 2. TABLA USERS (Administradores)
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 3. TABLA CATEGORIES (Categorías de servicios)
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 4. TABLA SERVICES (Servicios/Tratamientos)
CREATE TABLE "services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "benefits" TEXT,
    "recommendations" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") 
        REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. TABLA BOOKINGS (Reservas)
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "formSubmissionId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "bookings_serviceId_fkey" FOREIGN KEY ("serviceId") 
        REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 6. TABLA WORKING_HOURS (Horarios de trabajo)
CREATE TABLE "working_hours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayOfWeek" INTEGER NOT NULL UNIQUE,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 7. TABLA MEDIA (Galería multimedia)
CREATE TABLE "media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ========================================
-- ÍNDICES PARA MEJORAR PERFORMANCE
-- ========================================
CREATE INDEX "bookings_date_startTime_idx" ON "bookings"("date", "startTime");
CREATE INDEX "bookings_serviceId_idx" ON "bookings"("serviceId");
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
CREATE INDEX "services_categoryId_idx" ON "services"("categoryId");
CREATE INDEX "media_order_idx" ON "media"("order");

-- ========================================
-- DATOS INICIALES (SEED)
-- ========================================

-- INSERTAR CATEGORÍAS
INSERT INTO "categories" ("id", "name", "description", "imageUrl", "isActive", "order", "createdAt", "updatedAt")
VALUES 
  ('cat-masajes', 'Masajes', 'Masajes terapéuticos y relajantes para tu bienestar', NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-faciales', 'Tratamientos Faciales', 'Cuidado y rejuvenecimiento facial con productos naturales', NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-especiales', 'Tratamientos Especiales', 'Servicios exclusivos y experiencias únicas', NULL, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- INSERTAR USUARIO ADMIN
-- Password: admin123 (bcrypt hash)
INSERT INTO "users" ("id", "email", "password", "name", "role", "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@esenciapura.com',
  '$2a$10$YourHashHere',  -- Cambiar por hash real después
  'Administrador',
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- INSERTAR SERVICIOS DE EJEMPLO
INSERT INTO "services" ("id", "name", "description", "price", "duration", "isActive", "categoryId", "benefits", "recommendations", "createdAt", "updatedAt")
VALUES 
  (
    'service-1',
    'Masaje Relajante',
    'Masaje terapéutico de cuerpo completo con técnicas de relajación profunda',
    25000,
    60,
    true,
    'cat-masajes',
    E'Reduce el estrés y la ansiedad\nMejora la circulación sanguínea\nAlivia tensión muscular\nPromueve mejor sueño',
    E'Evitar comidas pesadas antes del masaje\nHidratarse bien antes y después\nComunicar áreas de dolor o sensibilidad',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'service-2',
    'Limpieza Facial Profunda',
    'Tratamiento facial completo con limpieza, exfoliación y mascarilla nutritiva',
    20000,
    60,
    true,
    'cat-faciales',
    E'Elimina impurezas y células muertas\nDesobstruye los poros\nMejora textura de la piel\nPromueve regeneración celular',
    E'No usar maquillaje el día del tratamiento\nEvitar exposición solar directa después\nMantener hidratación constante',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'service-3',
    'Aromaterapia Completa',
    'Sesión de aromaterapia con aceites esenciales seleccionados según tus necesidades',
    30000,
    90,
    true,
    'cat-especiales',
    E'Equilibra emociones\nMejora estado de ánimo\nFortalece sistema inmune\nPromueve bienestar integral',
    E'Informar sobre alergias o sensibilidades\nLlegar 10 minutos antes para relajarse\nEvitar cafeína antes de la sesión',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- INSERTAR HORARIOS DE TRABAJO (Lunes a Sábado: 9am - 6pm)
INSERT INTO "working_hours" ("id", "dayOfWeek", "startTime", "endTime", "isActive", "createdAt", "updatedAt")
VALUES 
  ('wh-mon', 1, '09:00', '18:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('wh-tue', 2, '09:00', '18:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('wh-wed', 3, '09:00', '18:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('wh-thu', 4, '09:00', '18:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('wh-fri', 5, '09:00', '18:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('wh-sat', 6, '09:00', '18:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========================================
-- FIN DE LA MIGRACIÓN
-- ========================================
