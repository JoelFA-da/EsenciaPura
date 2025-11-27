import { Request, Response } from 'express';
import { z } from 'zod';
import { categoriesService } from './categories.service';
import { AppError } from '../../common/errors/AppError';

// Esquemas de validación
const createCategorySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
  order: z.number().int().min(0).optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

// Listar categorías activas (público)
export async function listCategories(_req: Request, res: Response) {
  const categories = await categoriesService.list();
  return res.json(categories);
}

// Listar todas las categorías (admin)
export async function listAllCategories(_req: Request, res: Response) {
  const categories = await categoriesService.listAll();
  return res.json(categories);
}

// Listar categorías con conteo de servicios (admin)
export async function listCategoriesWithCount(_req: Request, res: Response) {
  const categories = await categoriesService.listWithServiceCount();
  return res.json(categories);
}

// Obtener una categoría
export async function getCategory(req: Request, res: Response) {
  const { id } = req.params;
  
  const category = await categoriesService.findById(id);
  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }
  
  return res.json(category);
}

// Crear categoría
export async function createCategory(req: Request, res: Response) {
  const validation = createCategorySchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new AppError('Datos inválidos', 400, validation.error.errors);
  }
  
  const category = await categoriesService.create(validation.data);
  return res.status(201).json(category);
}

// Actualizar categoría
export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const validation = updateCategorySchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new AppError('Datos inválidos', 400, validation.error.errors);
  }
  
  const category = await categoriesService.update(id, validation.data);
  return res.json(category);
}

// Eliminar (desactivar) categoría
export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;
  const { permanent } = req.query;
  
  // Si se solicita eliminación permanente
  if (permanent === 'true') {
    try {
      await categoriesService.deletePermanently(id);
      return res.status(204).send(); // No content
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }
      throw error;
    }
  }
  
  // Por defecto, solo desactivar
  const category = await categoriesService.delete(id);
  return res.json(category);
}

// Eliminar permanentemente categoría
export async function deleteCategoryPermanently(req: Request, res: Response) {
  const { id } = req.params;
  
  try {
    await categoriesService.deletePermanently(id);
    return res.status(204).send(); // No content
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(error.message, 400);
    }
    throw error;
  }
}
