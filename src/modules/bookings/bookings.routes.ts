import { Router } from 'express';
import {
  createBooking,
  listBookings,
  getBooking,
  confirmBooking,
  cancelBooking,
  getAvailableSlots,
  getCalendarView
} from './bookings.controller';

const router = Router();

// Rutas públicas
router.get('/available-slots', getAvailableSlots); // Usuario: solo slots libres

// Rutas admin (TODO: agregar middleware de autenticación)
router.post('/', createBooking); // ADMIN: crear reserva después de Google Form
router.get('/calendar', getCalendarView); // ADMIN: vista completa (ocupados + libres)
router.get('/', listBookings);
router.get('/:id', getBooking);
router.patch('/:id/confirm', confirmBooking);
router.patch('/:id/cancel', cancelBooking);

export default router;
