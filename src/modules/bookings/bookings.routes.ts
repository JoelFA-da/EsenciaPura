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
import { bookingsService } from './bookings.service';
import { authenticate } from '../../common/middleware/authenticate';

const router = Router();

// Rutas públicas
router.get('/available-slots', getAvailableSlots); // Usuario: solo slots libres
router.post('/', createBooking); // PÚBLICO: cliente crea solicitud de reserva (envía email al admin)

// Rutas admin protegidas
router.get('/calendar', authenticate, getCalendarView); // ADMIN: vista completa (ocupados + libres)
router.get('/', authenticate, listBookings);
router.get('/:id', authenticate, getBooking);
router.patch('/:id/confirm', authenticate, confirmBooking);
router.patch('/:id/cancel', authenticate, cancelBooking);
router.patch('/:id/complete', authenticate, async (req, res) => {
  try {
    const booking = await bookingsService.complete(req.params.id);
    return res.json({ message: 'Reserva completada exitosamente', booking });
  } catch (error) {
    return res.status(500).json({ error: 'Error al completar reserva' });
  }
});

export default router;
