"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRoutes = void 0;
const express_1 = require("express");
const categories_controller_1 = require("./categories.controller");
const authenticate_1 = require("../../common/middleware/authenticate");
const router = (0, express_1.Router)();
exports.categoriesRoutes = router;
// Rutas públicas
router.get('/', categories_controller_1.listCategories);
router.get('/:id', categories_controller_1.getCategory);
// Rutas admin protegidas
router.get('/admin/all', authenticate_1.authenticate, categories_controller_1.listAllCategories);
router.get('/admin/stats', authenticate_1.authenticate, categories_controller_1.listCategoriesWithCount);
router.post('/', authenticate_1.authenticate, categories_controller_1.createCategory);
router.patch('/:id', authenticate_1.authenticate, categories_controller_1.updateCategory);
router.delete('/:id', authenticate_1.authenticate, categories_controller_1.deleteCategory);
