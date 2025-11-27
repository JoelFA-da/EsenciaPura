import { Router } from 'express';
import {
  listServices,
  listAllServices,
  getService,
  createService,
  updateService,
  deactivateService,
  deleteService
} from './services.controller';
import { authenticate } from '../../common/middleware/authenticate';

const router = Router();

// Rutas públicas
router.get('/', listServices);  // Solo servicios activos
router.get('/:id', getService);

// Rutas admin protegidas
router.get('/admin/all', authenticate, listAllServices);  // Todos los servicios (activos + inactivos)
router.post('/', authenticate, createService);
router.patch('/:id', authenticate, updateService);
router.delete('/:id', authenticate, deleteService);

export default router;
