import { Request, Response } from 'express';
import { z } from 'zod';
import { bookingsService } from './bookings.service';
import { emailService } from '../../common/services/email.service';
import { env } from '../../config';

// Schema de validación para crear reserva (CLIENTE - solicitud de reserva)
const createBookingSchema = z.object({
  serviceId: z.string().min(1, 'Servicio es requerido'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:mm)'),
  customerName: z.string().min(1, 'Nombre del cliente es requerido'),
  customerEmail: z.string().email('Email inválido').optional(), // Opcional para admin
  customerPhone: z.string().min(1, 'Teléfono del cliente es requerido'),
  notes: z.string().optional(),
  formSubmissionId: z.string().optional(),
  skipAvailabilityCheck: z.boolean().optional() // Admin puede forzar reserva en slot ocupado
});

// Crear una nueva reserva (PÚBLICO - solicitud del cliente)
// El cliente llena el formulario web y esto envía un email al admin
export async function createBooking(req: Request, res: Response) {
  try {
    const validation = createBookingSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        details: validation.error.issues 
      });
    }

    const data = validation.data;
    
    // Crear la reserva en estado "pending"
    const booking = await bookingsService.create(data);
    
    // Verificar que el booking tenga el servicio incluido
    if (!booking.service) {
      throw new Error('Error al obtener información del servicio');
    }
    
    // Enviar email al admin con los datos del cliente
    try {
      await emailService.sendNewBookingNotification({
        booking: {
          id: booking.id,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          service: booking.service // Ya verificado que existe
        },
        customer: {
          name: data.customerName,
          phone: data.customerPhone,
          notes: data.notes
        }
      });
    } catch (emailError) {
      console.error('❌ Error al enviar email al admin:', emailError);
      // No fallar la reserva si el email falla
    }
    
    // Enviar instrucciones de pago al cliente (SOLO si hay email)
    if (data.customerEmail) {
      try {
        await emailService.sendPaymentInstructions({
          booking: {
            id: booking.id,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            service: booking.service
          },
          customer: {
            name: data.customerName,
            email: data.customerEmail,
            phone: data.customerPhone
          }
        });
      } catch (emailError) {
        console.error('❌ Error al enviar email al cliente:', emailError);
        // No fallar la reserva si el email falla
      }
    }
    
    return res.status(201).json({ 
      message: 'Solicitud de reserva recibida. Te contactaremos pronto para confirmar.',
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
