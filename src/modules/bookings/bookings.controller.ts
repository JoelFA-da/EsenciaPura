import { Request, Response } from 'express';
import { z } from 'zod';
import { bookingsService } from './bookings.service';

// Schema de validación para crear reserva (ADMIN - después de Google Form)
const createBookingSchema = z.object({
  serviceId: z.string().cuid('ID de servicio inválido'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:mm)'),
  notes: z.string().optional(),
  formSubmissionId: z.string().optional(),
  skipAvailabilityCheck: z.boolean().optional() // Admin puede forzar reserva en slot ocupado
});

// Crear una nueva reserva (ADMIN ONLY - después de revisar Google Form)
// NOTA: Los usuarios NO usan este endpoint. Ellos ven slots disponibles y completan Google Form.
//       El admin recibe el email de Google Forms y usa este endpoint para registrar la reserva.
export async function createBooking(req: Request, res: Response) {
  try {
    const validation = createBookingSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        details: validation.error.issues 
      });
    }

    const booking = await bookingsService.create(validation.data);
    
    // NO enviar email al negocio (ya lo recibió de Google Forms)
    // Solo crear la reserva en el sistema
    
    return res.status(201).json({ 
      message: 'Reserva creada exitosamente en el sistema.',
      booking 
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al crear la reserva' });
  }
}

// Listar todas las reservas (admin)
export async function listBookings(req: Request, res: Response) {
  try {
    const { status, date } = req.query;
    
    const bookings = await bookingsService.list({
      status: status as any,
      date: date as string
    });
    
    return res.json({ bookings });
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar reservas' });
  }
}

// Obtener reserva por ID (admin)
export async function getBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const booking = await bookingsService.getById(id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    return res.json({ booking });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener reserva' });
  }
}

// Confirmar reserva (admin)
// NOTA: No se envía email automático porque los datos del cliente están en Google Forms.
//       El admin debe confirmar manualmente con el cliente usando la información del formulario.
export async function confirmBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const booking = await bookingsService.confirm(id);
    
    return res.json({ 
      message: 'Reserva confirmada exitosamente. Confirma manualmente con el cliente usando los datos de Google Forms.',
      booking 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al confirmar reserva' });
  }
}

// Cancelar reserva
export async function cancelBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const booking = await bookingsService.cancel(id);
    
    return res.json({ 
      message: 'Reserva cancelada exitosamente',
      booking 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al cancelar reserva' });
  }
}

// Obtener horarios disponibles (público)
export async function getAvailableSlots(req: Request, res: Response) {
  try {
    const { date, serviceId } = req.query;
    
    if (!date || !serviceId) {
      return res.status(400).json({ 
        error: 'Se requieren los parámetros date y serviceId' 
      });
    }
    
    const slots = await bookingsService.getAvailableSlots(
      date as string,
      serviceId as string
    );
    
    return res.json({ 
      date,
      serviceId,
      availableSlots: slots 
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al obtener horarios' });
  }
}

// Obtener vista completa de calendario (ADMIN - muestra todos los slots)
export async function getCalendarView(req: Request, res: Response) {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ 
        error: 'Se requiere el parámetro date (formato YYYY-MM-DD)' 
      });
    }
    
    const calendar = await bookingsService.getCalendarView(date as string);
    
    return res.json(calendar);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al obtener calendario' });
  }
}
