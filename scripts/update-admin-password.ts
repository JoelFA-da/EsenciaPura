import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdminPassword() {
  console.log('🔐 Actualizando contraseña del admin...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.update({
    where: { email: 'admin@esenciapura.com' },
    data: { password: hashedPassword }
  });
  
  console.log(`✅ Contraseña actualizada para: ${user.email}`);
  console.log('📧 Email: admin@esenciapura.com');
  console.log('🔑 Password: admin123');
}

updateAdminPassword()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
