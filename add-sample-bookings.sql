-- ========================================
-- AGREGAR RESERVAS DE PRUEBA
-- Ejecutar en SQL Editor de Supabase
-- ========================================

-- Reserva 1: Masaje Relajante (Confirmada)
INSERT INTO "bookings" ("id", "serviceId", "date", "startTime", "endTime", "customerName", "customerPhone", "status", "notes", "createdAt", "updatedAt")
VALUES (
  'booking-001',
  'service-1',
  '2025-11-29 00:00:00',  -- Viernes 29 de noviembre
  '10:00',
  '11:00',
  'María González',
  '8888-8888',
  'CONFIRMED',
  'Primera sesión - cliente regular',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Reserva 2: Limpieza Facial (Pendiente)
INSERT INTO "bookings" ("id", "serviceId", "date", "startTime", "endTime", "customerName", "customerPhone", "status", "notes", "createdAt", "updatedAt")
VALUES (
  'booking-002',
  'service-2',
  '2025-11-30 00:00:00',  -- Sábado 30 de noviembre
  '14:00',
  '15:00',
  'Carlos Rodríguez',
  '7777-7777',
  'PENDING',
  'Pendiente de confirmación de pago',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Reserva 3: Aromaterapia (Confirmada)
INSERT INTO "bookings" ("id", "serviceId", "date", "startTime", "endTime", "customerName", "customerPhone", "status", "notes", "createdAt", "updatedAt")
VALUES (
  'booking-003',
  'service-3',
  '2025-12-02 00:00:00',  -- Lunes 2 de diciembre
  '09:00',
  '10:30',
  'Ana Patricia Mora',
  '6666-6666',
  'CONFIRMED',
  'Cliente solicita aceites cítricos',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Reserva 4: Masaje Relajante (Completada)
INSERT INTO "bookings" ("id", "serviceId", "date", "startTime", "endTime", "customerName", "customerPhone", "status", "notes", "createdAt", "updatedAt")
VALUES (
  'booking-004',
  'service-1',
  '2025-11-25 00:00:00',  -- Lunes 25 de noviembre (pasada)
  '15:00',
  '16:00',
  'Juan Pérez',
  '5555-5555',
  'COMPLETED',
  'Sesión completada exitosamente',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ========================================
-- RESULTADO ESPERADO
-- ========================================
-- 4 reservas creadas:
-- - 2 CONFIRMED (próximas)
-- - 1 PENDING (por confirmar)
-- - 1 COMPLETED (pasada)
-- ========================================
