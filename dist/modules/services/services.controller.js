"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listServices = listServices;
exports.listAllServices = listAllServices;
exports.getService = getService;
exports.createService = createService;
exports.updateService = updateService;
exports.deactivateService = deactivateService;
exports.deleteService = deleteService;
const zod_1 = require("zod");
const services_service_1 = require("./services.service");
// Schema de validación para crear servicio
const createServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    price: zod_1.z.number().positive(),
    duration: zod_1.z.number().int().positive(),
    categoryId: zod_1.z.string().min(1, 'Debe seleccionar una categoría'),
    imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')).transform(val => val === '' ? undefined : val),
    benefits: zod_1.z.string().optional().or(zod_1.z.literal('')).transform(val => val === '' ? undefined : val),
    recommendations: zod_1.z.string().optional().or(zod_1.z.literal('')).transform(val => val === '' ? undefined : val),
    isActive: zod_1.z.boolean().optional()
});
// Schema para actualizar servicio
const updateServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().min(10).optional(),
    price: zod_1.z.number().positive().optional(),
    duration: zod_1.z.number().int().positive().optional(),
    categoryId: zod_1.z.string().min(1).optional(),
    imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')).nullable().transform(val => val === '' ? null : val),
    benefits: zod_1.z.string().optional().or(zod_1.z.literal('')).nullable().transform(val => val === '' ? null : val),
    recommendations: zod_1.z.string().optional().or(zod_1.z.literal('')).nullable().transform(val => val === '' ? null : val),
    isActive: zod_1.z.boolean().optional()
});
// Listar servicios activos (público) - con filtro opcional por categoría
async function listServices(req, res) {
    const categoryId = req.query.categoryId;
    const services = await services_service_1.servicesService.list(categoryId);
    return res.json(services);
}
// Listar TODOS los servicios - activos e inactivos (admin)
async function listAllServices(_req, res) {
    const services = await services_service_1.servicesService.listAll();
    return res.json(services);
}
// Obtener un servicio por ID (público)
async function getService(req, res) {
    const { id } = req.params;
    const service = await services_service_1.servicesService.getById(id);
    if (!service) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    return res.json(service);
}
// Crear servicio (admin)
async function createService(req, res) {
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
        const service = await services_service_1.servicesService.create(validation.data);
        console.log('✅ Service created:', service);
        return res.status(201).json(service);
    }
    catch (error) {
        console.error('💥 Error creating service:', error);
        return res.status(500).json({ error: error.message || 'Error creando servicio' });
    }
}
// Actualizar servicio (admin)
async function updateService(req, res) {
    try {
        const { id } = req.params;
        const validation = updateServiceSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Datos inválidos',
                details: validation.error.issues
            });
        }
        const service = await services_service_1.servicesService.update(id, validation.data);
        return res.json(service);
    }
    catch (error) {
        console.error('Error updating service:', error);
        return res.status(500).json({ error: error.message || 'Error actualizando servicio' });
    }
}
// Desactivar servicio (admin)
async function deactivateService(req, res) {
    try {
        const { id } = req.params;
        const service = await services_service_1.servicesService.deactivate(id);
        return res.json(service);
    }
    catch (error) {
        console.error('Error deactivating service:', error);
        return res.status(500).json({ error: error.message || 'Error desactivando servicio' });
    }
}
// Eliminar servicio permanentemente (admin)
async function deleteService(req, res) {
    try {
        const { id } = req.params;
        console.log('🗑️ Deleting service:', id);
        await services_service_1.servicesService.delete(id);
        console.log('✅ Service deleted successfully');
        return res.status(204).send();
    }
    catch (error) {
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
