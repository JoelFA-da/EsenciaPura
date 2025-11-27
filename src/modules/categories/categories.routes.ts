import { Router } from 'express';
import {
  listCategories,
  listAllCategories,
  listCategoriesWithCount,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories.controller';
import { authenticate } from '../../common/middleware/authenticate';

const router = Router();

// Rutas públicas
router.get('/', listCategories);
router.get('/:id', getCategory);

// Rutas admin protegidas
router.get('/admin/all', authenticate, listAllCategories);
router.get('/admin/stats', authenticate, listCategoriesWithCount);
router.post('/', authenticate, createCategory);
router.patch('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export { router as categoriesRoutes };
