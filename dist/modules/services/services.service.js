"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ServicesService {
    // Listar todos los servicios activos (solo para frontend público)
    // Opcional: filtrar por categoryId
    async list(categoryId) {
        return await prisma.service.findMany({
            where: {
                isActive: true,
                ...(categoryId && { categoryId })
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
    }
    // Listar TODOS los servicios (activos e inactivos) - SOLO ADMIN
    async listAll() {
        return await prisma.service.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
    }
    // Obtener un servicio por ID
    async getById(id) {
        return await prisma.service.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    // Crear un nuevo servicio (admin)
    async create(data) {
        return await prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
                categoryId: data.categoryId,
                imageUrl: data.imageUrl,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
    }
    // Actualizar un servicio (admin)
    async update(id, data) {
        return await prisma.service.update({
            where: { id },
            data
        });
    }
    // Desactivar un servicio (admin)
    async deactivate(id) {
        return await prisma.service.update({
            where: { id },
            data: { isActive: false }
        });
    }
    // Eliminar un servicio permanentemente (admin)
    async delete(id) {
        await prisma.service.delete({
            where: { id }
        });
    }
}
exports.servicesService = new ServicesService();
