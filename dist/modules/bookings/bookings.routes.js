"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = require("./bookings.controller");
const bookings_service_1 = require("./bookings.service");
const authenticate_1 = require("../../common/middleware/authenticate");
const router = (0, express_1.Router)();
// Rutas públicas
router.get('/available-slots', bookings_controller_1.getAvailableSlots); // Usuario: solo slots libres
router.post('/', bookings_controller_1.createBooking); // PÚBLICO: cliente crea solicitud de reserva (envía email al admin)
// Rutas admin protegidas
router.get('/calendar', authenticate_1.authenticate, bookings_controller_1.getCalendarView); // ADMIN: vista completa (ocupados + libres)
router.get('/', authenticate_1.authenticate, bookings_controller_1.listBookings);
router.get('/:id', authenticate_1.authenticate, bookings_controller_1.getBooking);
router.patch('/:id/confirm', authenticate_1.authenticate, bookings_controller_1.confirmBooking);
router.patch('/:id/cancel', authenticate_1.authenticate, bookings_controller_1.cancelBooking);
router.patch('/:id/complete', authenticate_1.authenticate, async (req, res) => {
    try {
        const booking = await bookings_service_1.bookingsService.complete(req.params.id);
        return res.json({ message: 'Reserva completada exitosamente', booking });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al completar reserva' });
    }
});
exports.default = router;
