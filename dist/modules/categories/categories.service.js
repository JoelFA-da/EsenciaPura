"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CategoriesService {
    // Listar categorías activas (público)
    async list() {
        return await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });
    }
    // Listar todas las categorías (admin)
    async listAll() {
        return await prisma.category.findMany({
            orderBy: { order: 'asc' },
        });
    }
    // Obtener una categoría por ID
    async findById(id) {
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
    async create(data) {
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
    async update(id, data) {
        return await prisma.category.update({
            where: { id },
            data,
        });
    }
    // Eliminar (desactivar) una categoría
    async delete(id) {
        return await prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    }
    // Eliminar permanentemente una categoría (solo si no tiene servicios)
    async deletePermanently(id) {
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
    async listWithServiceCount() {
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
exports.categoriesService = new CategoriesService();
