import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

// Tipos para creación y actualización
export interface CreateCategoryInput {
  name: string;
  description: string;
  imageUrl?: string;
  order?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  order?: number;
}

class CategoriesService {
  // Listar categorías activas (público)
  async list(): Promise<Category[]> {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  // Listar todas las categorías (admin)
  async listAll(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // Obtener una categoría por ID
  async findById(id: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  // Crear una categoría
  async create(data: CreateCategoryInput): Promise<Category> {
    return await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        order: data.order ?? 0,
      },
    });
  }

  // Actualizar una categoría
  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  // Eliminar (desactivar) una categoría
  async delete(id: string): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Eliminar permanentemente una categoría (solo si no tiene servicios)
  async deletePermanently(id: string): Promise<void> {
    // Verificar que no tenga servicios asociados
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    if (category._count.services > 0) {
      throw new Error('No se puede eliminar una categoría con servicios asociados');
    }

    await prisma.category.delete({
      where: { id },
    });
  }

  // Obtener categorías con conteo de servicios
  async listWithServiceCount(): Promise<Array<Category & { _count: { services: number } }>> {
    return await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });
  }
}

export const categoriesService = new CategoriesService();
