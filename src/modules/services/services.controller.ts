import { Request, Response } from 'express';
import { z } from 'zod';
import { servicesService } from './services.service';

// Schema de validación para crear servicio
const createServiceSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  categoryId: z.string().min(1, 'Debe seleccionar una categoría'),
  imageUrl: z.string().url().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  benefits: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  recommendations: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  isActive: z.boolean().optional()
});

// Schema para actualizar servicio
const updateServiceSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
  categoryId: z.string().min(1).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')).nullable().transform(val => val === '' ? null : val),
  benefits: z.string().optional().or(z.literal('')).nullable().transform(val => val === '' ? null : val),
  recommendations: z.string().optional().or(z.literal('')).nullable().transform(val => val === '' ? null : val),
  isActive: z.boolean().optional()
});

// Listar servicios activos (público) - con filtro opcional por categoría
export async function listServices(req: Request, res: Response) {
  const categoryId = req.query.categoryId as string | undefined;
  const services = await servicesService.list(categoryId);
  return res.json(services);
}

// Listar TODOS los servicios - activos e inactivos (admin)
export async function listAllServices(_req: Request, res: Response) {
  const services = await servicesService.listAll();
  return res.json(services);
}

// Obtener un servicio por ID (público)
export async function getService(req: Request, res: Response) {
  const { id } = req.params;
  const service = await servicesService.getById(id);
  
  if (!service) {
    return res.status(404).json({ error: 'Servicio no encontrado' });
  }
  
  return res.json(service);
}

// Crear servicio (admin)
export async function createService(req: Request, res: Response) {
  try {
    console.log('📥 Create service request body:', req.body);
    const validation = createServiceSchema.safeParse(req.body);
    
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.error.issues);
      return res.status(400).json({ 
        error: 'Datos inválidos',
        details: validation.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    console.log('✅ Validation passed:', validation.data);
    const service = await servicesService.create(validation.data);
    console.log('✅ Service created:', service);
    return res.status(201).json(service);
  } catch (error: any) {
    console.error('💥 Error creating service:', error);
    return res.status(500).json({ error: error.message || 'Error creando servicio' });
  }
}

// Actualizar servicio (admin)
export async function updateService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validation = updateServiceSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        details: validation.error.issues 
      });
    }
    
    const service = await servicesService.update(id, validation.data);
    return res.json(service);
  } catch (error: any) {
    console.error('Error updating service:', error);
    return res.status(500).json({ error: error.message || 'Error actualizando servicio' });
  }
}

// Desactivar servicio (admin)
export async function deactivateService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const service = await servicesService.deactivate(id);
    return res.json(service);
  } catch (error: any) {
    console.error('Error deactivating service:', error);
    return res.status(500).json({ error: error.message || 'Error desactivando servicio' });
  }
}

// Eliminar servicio permanentemente (admin)
export async function deleteService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting service:', id);
    await servicesService.delete(id);
    console.log('✅ Service deleted successfully');
    return res.status(204).send();
  } catch (error: any) {
    console.error('💥 Error deleting service:', error);
    
    // Si el servicio tiene reservas, no se puede eliminar
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'No se puede eliminar el servicio porque tiene reservas asociadas. Desactívalo en su lugar.' 
      });
    }
    
    return res.status(500).json({ error: error.message || 'Error eliminando servicio' });
  }
}
