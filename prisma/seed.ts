import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // 1. Crear usuario admin
  console.log('👤 Creando usuario admin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@esenciapura.com' },
    update: {},
    create: {
      email: 'admin@esenciapura.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin'
    }
  });
  console.log(`✅ Admin creado: ${admin.email} (password: admin123)`);

  // 2. Crear categorías
  console.log('📂 Creando categorías...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'cat-masajes' },
      update: {},
      create: {
        id: 'cat-masajes',
        name: 'Masajes',
        description: 'Masajes terapéuticos y relajantes',
        imageUrl: null,
        order: 1,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { id: 'cat-faciales' },
      update: {},
      create: {
        id: 'cat-faciales',
        name: 'Tratamientos Faciales',
        description: 'Cuidado y belleza facial',
        imageUrl: null,
        order: 2,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { id: 'cat-corporales' },
      update: {},
      create: {
        id: 'cat-corporales',
        name: 'Tratamientos Corporales',
        description: 'Cuidado integral del cuerpo',
        imageUrl: null,
        order: 3,
        isActive: true
      }
    })
  ]);
  console.log(`✅ ${categories.length} categorías creadas`);

  // 3. Crear servicios (TODOS con duración de 60 minutos para calendario de 1 hora)
  console.log('💆 Creando servicios...');
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-1' },
      update: {},
      create: {
        id: 'service-1',
        name: 'Masaje Relajante',
        description: 'Masaje corporal completo que alivia tensiones y promueve la relajación profunda',
        price: 25000,
        duration: 60,
        categoryId: categories[0].id,
        isActive: true,
        imageUrl: null
      }
    }),
    prisma.service.upsert({
      where: { id: 'service-2' },
      update: {},
      create: {
        id: 'service-2',
        name: 'Facial Hidratante',
        description: 'Tratamiento facial profundo que hidrata y revitaliza la piel',
        price: 18000,
        duration: 60,
        categoryId: categories[1].id,
        isActive: true,
        imageUrl: null
      }
    }),
    prisma.service.upsert({
      where: { id: 'service-3' },
      update: {},
      create: {
        id: 'service-3',
        name: 'Aromaterapia',
        description: 'Terapia con aceites esenciales para equilibrar cuerpo y mente',
        price: 20000,
        duration: 60,
        categoryId: categories[0].id,
        isActive: true,
        imageUrl: null
      }
    }),
    prisma.service.upsert({
      where: { id: 'service-4' },
      update: {},
      create: {
        id: 'service-4',
        name: 'Reflexología Podal',
        description: 'Masaje terapéutico en puntos reflejos de los pies',
        price: 15000,
        duration: 60,
        categoryId: categories[0].id,
        isActive: true,
        imageUrl: null
      }
    }),
    prisma.service.upsert({
      where: { id: 'service-5' },
      update: {},
      create: {
        id: 'service-5',
        name: 'Exfoliación Corporal',
        description: 'Tratamiento que elimina células muertas y renueva la piel',
        price: 22000,
        duration: 60,
        categoryId: categories[2].id,
        isActive: true,
        imageUrl: null
      }
    })
  ]);
  console.log(`✅ ${services.length} servicios creados`);

  // 3. Crear horarios de trabajo (Lunes a Sábado)
  console.log('🕐 Creando horarios de trabajo...');
  const workingHours = await Promise.all([
    // Lunes (1)
    prisma.workingHours.upsert({
      where: { dayOfWeek: 1 },
      update: {},
      create: {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true
      }
    }),
    // Martes (2)
    prisma.workingHours.upsert({
      where: { dayOfWeek: 2 },
      update: {},
      create: {
        dayOfWeek: 2,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true
      }
    }),
    // Miércoles (3)
    prisma.workingHours.upsert({
      where: { dayOfWeek: 3 },
      update: {},
      create: {
        dayOfWeek: 3,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true
      }
    }),
    // Jueves (4)
    prisma.workingHours.upsert({
      where: { dayOfWeek: 4 },
      update: {},
      create: {
        dayOfWeek: 4,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true
      }
    }),
    // Viernes (5)
    prisma.workingHours.upsert({
      where: { dayOfWeek: 5 },
      update: {},
      create: {
        dayOfWeek: 5,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true
      }
    }),
    // Sábado (6)
    prisma.workingHours.upsert({
      where: { dayOfWeek: 6 },
      update: {},
      create: {
        dayOfWeek: 6,
        startTime: '10:00',
        endTime: '16:00',
        isActive: true
      }
    }),
    // Domingo (0) - Cerrado
    prisma.workingHours.upsert({
      where: { dayOfWeek: 0 },
      update: {},
      create: {
        dayOfWeek: 0,
        startTime: '00:00',
        endTime: '00:00',
        isActive: false
      }
    })
  ]);
  console.log(`✅ ${workingHours.length} horarios configurados`);

  // 4. Crear algunas reservas de ejemplo (opcional)
  console.log('📅 Creando reservas de ejemplo...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        serviceId: services[0].id,
        date: tomorrow,
        startTime: '10:00',
        endTime: '11:00',
        status: 'CONFIRMED',
        formSubmissionId: 'form-response-001',
        notes: 'Cliente prefiere masajista femenina'
      }
    }),
    prisma.booking.create({
      data: {
        serviceId: services[1].id,
        date: tomorrow,
        startTime: '14:00',
        endTime: '14:45',
        status: 'PENDING',
        formSubmissionId: 'form-response-002',
        notes: null
      }
    })
  ]);
  console.log(`✅ ${bookings.length} reservas de ejemplo creadas`);

  // 5. Crear contenido multimedia de ejemplo
  console.log('🖼️ Creando galería de ejemplo...');
  const media = await Promise.all([
    prisma.media.create({
      data: {
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef',
        title: 'Sala de Masajes',
        description: 'Ambiente relajante para tratamientos',
        order: 1,
        isActive: true
      }
    }),
    prisma.media.create({
      data: {
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
        title: 'Área de Relajación',
        description: 'Espacio para descanso post-tratamiento',
        order: 2,
        isActive: true
      }
    })
  ]);
  console.log(`✅ ${media.length} elementos multimedia creados`);

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📊 Resumen:');
  console.log(`   - 1 usuario admin`);
  console.log(`   - ${categories.length} categorías`);
  console.log(`   - ${services.length} servicios`);
  console.log(`   - ${workingHours.length} configuraciones de horario`);
  console.log(`   - ${bookings.length} reservas de ejemplo`);
  console.log(`   - ${media.length} elementos multimedia`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
