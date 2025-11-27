"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.listAllCategories = listAllCategories;
exports.listCategoriesWithCount = listCategoriesWithCount;
exports.getCategory = getCategory;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.deleteCategoryPermanently = deleteCategoryPermanently;
const zod_1 = require("zod");
const categories_service_1 = require("./categories.service");
const AppError_1 = require("../../common/errors/AppError");
// Esquemas de validación
const createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: zod_1.z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    imageUrl: zod_1.z.string().url('URL de imagen inválida').optional(),
    order: zod_1.z.number().int().min(0).optional(),
});
const updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().min(10).optional(),
    imageUrl: zod_1.z.string().url().optional(),
    isActive: zod_1.z.boolean().optional(),
    order: zod_1.z.number().int().min(0).optional(),
});
// Listar categorías activas (público)
async function listCategories(_req, res) {
    const categories = await categories_service_1.categoriesService.list();
    return res.json(categories);
}
// Listar todas las categorías (admin)
async function listAllCategories(_req, res) {
    const categories = await categories_service_1.categoriesService.listAll();
    return res.json(categories);
}
// Listar categorías con conteo de servicios (admin)
async function listCategoriesWithCount(_req, res) {
    const categories = await categories_service_1.categoriesService.listWithServiceCount();
    return res.json(categories);
}
// Obtener una categoría
async function getCategory(req, res) {
    const { id } = req.params;
    const category = await categories_service_1.categoriesService.findById(id);
    if (!category) {
        throw new AppError_1.AppError('Categoría no encontrada', 404);
    }
    return res.json(category);
}
// Crear categoría
async function createCategory(req, res) {
    const validation = createCategorySchema.safeParse(req.body);
    if (!validation.success) {
        throw new AppError_1.AppError('Datos inválidos', 400, validation.error.errors);
    }
    const category = await categories_service_1.categoriesService.create(validation.data);
    return res.status(201).json(category);
}
// Actualizar categoría
async function updateCategory(req, res) {
    const { id } = req.params;
    const validation = updateCategorySchema.safeParse(req.body);
    if (!validation.success) {
        throw new AppError_1.AppError('Datos inválidos', 400, validation.error.errors);
    }
    const category = await categories_service_1.categoriesService.update(id, validation.data);
    return res.json(category);
}
// Eliminar (desactivar) categoría
async function deleteCategory(req, res) {
    const { id } = req.params;
    const { permanent } = req.query;
    // Si se solicita eliminación permanente
    if (permanent === 'true') {
        try {
            await categories_service_1.categoriesService.deletePermanently(id);
            return res.status(204).send(); // No content
        }
        catch (error) {
            if (error instanceof Error) {
                throw new AppError_1.AppError(error.message, 400);
            }
            throw error;
        }
    }
    // Por defecto, solo desactivar
    const category = await categories_service_1.categoriesService.delete(id);
    return res.json(category);
}
// Eliminar permanentemente categoría
async function deleteCategoryPermanently(req, res) {
    const { id } = req.params;
    try {
        await categories_service_1.categoriesService.deletePermanently(id);
        return res.status(204).send(); // No content
    }
    catch (error) {
        if (error instanceof Error) {
            throw new AppError_1.AppError(error.message, 400);
        }
        throw error;
    }
}
