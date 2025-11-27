"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_controller_1 = require("./services.controller");
const authenticate_1 = require("../../common/middleware/authenticate");
const router = (0, express_1.Router)();
// Rutas públicas
router.get('/', services_controller_1.listServices); // Solo servicios activos
router.get('/:id', services_controller_1.getService);
// Rutas admin protegidas
router.get('/admin/all', authenticate_1.authenticate, services_controller_1.listAllServices); // Todos los servicios (activos + inactivos)
router.post('/', authenticate_1.authenticate, services_controller_1.createService);
router.patch('/:id', authenticate_1.authenticate, services_controller_1.updateService);
router.delete('/:id', authenticate_1.authenticate, services_controller_1.deleteService);
exports.default = router;
