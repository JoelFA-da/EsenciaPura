import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutos
  isActive: boolean;
  imageUrl?: string | null;
}

class ServicesService {
  // Listar todos los servicios activos
  async list(): Promise<Service[]> {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  // Obtener un servicio por ID
  async getById(id: string): Promise<Service | null> {
    return await prisma.service.findUnique({
      where: { id }
    });
  }

  // Crear un nuevo servicio (admin)
  async create(data: {
    name: string;
    description: string;
    price: number;
    duration: number;
    imageUrl?: string;
  }): Promise<Service> {
    return await prisma.service.create({
      data: {
        ...data,
        isActive: true
      }
    });
  }

  // Actualizar un servicio (admin)
  async update(id: string, data: Partial<Service>): Promise<Service> {
    return await prisma.service.update({
      where: { id },
      data
    });
  }

  // Desactivar un servicio (admin)
  async deactivate(id: string): Promise<Service> {
    return await prisma.service.update({
      where: { id },
      data: { isActive: false }
    });
  }
}

export const servicesService = new ServicesService();
