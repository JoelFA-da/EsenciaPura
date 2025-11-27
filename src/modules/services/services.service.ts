import { PrismaClient, Service } from '@prisma/client';

const prisma = new PrismaClient();

// Tipo extendido para servicios con categoría
export type ServiceWithCategory = Service & {
  category?: {
    id: string;
    name: string;
  };
};

class ServicesService {
  // Listar todos los servicios activos (solo para frontend público)
  // Opcional: filtrar por categoryId
  async list(categoryId?: string): Promise<ServiceWithCategory[]> {
    return await prisma.service.findMany({
      where: { 
        isActive: true,
        ...(categoryId && { categoryId })
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  // Listar TODOS los servicios (activos e inactivos) - SOLO ADMIN
  async listAll(): Promise<ServiceWithCategory[]> {
    return await prisma.service.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  // Obtener un servicio por ID
  async getById(id: string): Promise<ServiceWithCategory | null> {
    return await prisma.service.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  // Crear un nuevo servicio (admin)
  async create(data: {
    name: string;
    description: string;
    price: number;
    duration: number;
    categoryId: string;
    imageUrl?: string;
    isActive?: boolean;
  }): Promise<Service> {
    return await prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });
  }

  // Actualizar un servicio (admin)
  async update(id: string, data: Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Service> {
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

  // Eliminar un servicio permanentemente (admin)
  async delete(id: string): Promise<void> {
    await prisma.service.delete({
      where: { id }
    });
  }
}

export const servicesService = new ServicesService();
