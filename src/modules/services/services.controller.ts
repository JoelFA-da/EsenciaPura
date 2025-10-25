import { Request, Response } from 'express';
import { z } from 'zod';
import { servicesService } from './services.service';

// Schema de validación para crear servicio
const createServiceSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  duration: z.number().int().positive(), // minutos
  imageUrl: z.string().url().optional()
});

// Listar servicios activos (público)
export async function listServices(_req: Request, res: Response) {
  const services = await servicesService.list();
  return res.json({ services });
}

// Obtener un servicio por ID (público)
export async function getService(req: Request, res: Response) {
  const { id } = req.params;
  const service = await servicesService.getById(id);
  
  if (!service) {
    return res.status(404).json({ error: 'Servicio no encontrado' });
  }
  
  return res.json({ service });
}

// Crear servicio (admin)
export async function createService(req: Request, res: Response) {
  const validation = createServiceSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }
  
  const service = await servicesService.create(validation.data);
  return res.status(201).json({ service });
}

// Actualizar servicio (admin)
export async function updateService(req: Request, res: Response) {
  const { id } = req.params;
  const service = await servicesService.update(id, req.body);
  return res.json({ service });
}

// Desactivar servicio (admin)
export async function deactivateService(req: Request, res: Response) {
  const { id } = req.params;
  const service = await servicesService.deactivate(id);
  return res.json({ service });
}
