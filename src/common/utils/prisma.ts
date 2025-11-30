import { PrismaClient } from '@prisma/client';

// Singleton pattern para Prisma Client
// Evita crear múltiples conexiones a la base de datos
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Cerrar conexiones al terminar el proceso
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
