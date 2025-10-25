import { Router } from 'express';
import {
  listServices,
  getService,
  createService,
  updateService,
  deactivateService
} from './services.controller';

const router = Router();

// Rutas públicas
router.get('/', listServices);
router.get('/:id', getService);

// Rutas admin (TODO: agregar middleware de autenticación)
router.post('/', createService);
router.patch('/:id', updateService);
router.delete('/:id', deactivateService);

export default router;
