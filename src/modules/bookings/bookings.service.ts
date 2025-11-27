import { PrismaClient } from '@prisma/client';
import { addHours, format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

// Tipos de estado de reserva (usamos string literal en vez del enum de Prisma)
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface CreateBookingData {
  serviceId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  customerName?: string; // Nombre del cliente
  customerEmail?: string; // Email del cliente
  customerPhone?: string; // Teléfono del cliente
  notes?: string;
  formSubmissionId?: string; // ID del formulario de Google Forms (opcional)
  skipAvailabilityCheck?: boolean; // Admin puede forzar reserva
}

export interface Booking {
  id: string;
  serviceId: string;
  service?: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  formSubmissionId?: string | null;
  notes?: string | null;
  createdAt: Date;
}

class BookingsService {
  // Crear una nueva reserva (ADMIN ONLY - después de revisar Google Form)
  async create(data: CreateBookingData): Promise<Booking> {
    // Obtener el servicio para calcular la duración
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    });

    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    // Calcular hora de fin basado en la duración del servicio
    const [hours, minutes] = data.startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + service.duration * 60000);
    const endTime = format(endDate, 'HH:mm');

    // Validar disponibilidad SOLO si no es admin forzando reserva
    if (!data.skipAvailabilityCheck) {
      const isAvailable = await this.checkAvailability(
        data.date,
        data.startTime,
        endTime
      );

      if (!isAvailable) {
        throw new Error('El horario seleccionado no está disponible');
      }
    }

    // Crear reserva
    return await prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        date: parseISO(data.date),
        startTime: data.startTime,
        endTime,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        formSubmissionId: data.formSubmissionId,
        notes: data.notes,
        status: 'PENDING'
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        }
      }
    });
  }

  // Verificar disponibilidad de un horario
  async checkAvailability(
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const bookings = await prisma.booking.findMany({
      where: {
        date: parseISO(date),
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    // Verificar si hay conflictos de horario
    for (const booking of bookings) {
      const existingStart = booking.startTime;
      const existingEnd = booking.endTime;

      // Verificar solapamiento
      if (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      ) {
        return false;
      }
    }

    return true;
  }

  // Obtener todas las reservas (admin)
  async list(filters?: {
    status?: BookingStatus;
    date?: string;
  }): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.date && { date: parseISO(filters.date) })
      },
      include: {
        service: true
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    });
  }

  // Obtener reserva por ID
  async getById(id: string): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        }
      }
    }) as Booking | null;
  }

  // Confirmar una reserva (admin)
  async confirm(id: string): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: { status: 'CONFIRMED' }
    });
  }

  // Cancelar una reserva
  async cancel(id: string): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
  }

  // Completar una reserva (admin)
  async complete(id: string): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });
  }

  // Obtener horarios disponibles para un día específico
  async getAvailableSlots(date: string, serviceId: string): Promise<string[]> {
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    // Obtener día de la semana (0 = domingo, 1 = lunes, etc.)
    const dateObj = parseISO(date);
    const dayOfWeek = dateObj.getDay();

    // Obtener horario de trabajo para ese día
    const workingHours = await prisma.workingHours.findUnique({
      where: { dayOfWeek }
    });

    if (!workingHours || !workingHours.isActive) {
      return []; // No hay horario de trabajo para este día
    }

    // Generar slots de 1 hora desde apertura hasta cierre
    const slots: string[] = [];
    const [startHour, startMin] = workingHours.startTime.split(':').map(Number);
    const [endHour, endMin] = workingHours.endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      // Calcular hora de fin para este slot
      const slotEndDate = new Date();
      slotEndDate.setHours(currentHour, currentMin, 0, 0);
      slotEndDate.setMinutes(slotEndDate.getMinutes() + service.duration);
      const slotEnd = format(slotEndDate, 'HH:mm');

      // Verificar disponibilidad
      const isAvailable = await this.checkAvailability(date, timeSlot, slotEnd);
      
      if (isAvailable) {
        slots.push(timeSlot);
      }

      // Avanzar 1 hora
      currentHour += 1;
    }

    return slots;
  }

  // Obtener vista de calendario completo (admin) - TODOS los slots
  async getCalendarView(date: string): Promise<{
    date: string;
    slots: Array<{
      time: string;
      isAvailable: boolean;
      booking?: {
        id: string;
        service: string;
        status: string;
        formSubmissionId?: string | null;
      };
    }>;
  }> {
    // Obtener día de la semana
    const dateObj = parseISO(date);
    const dayOfWeek = dateObj.getDay();

    // Obtener horario de trabajo
    const workingHours = await prisma.workingHours.findUnique({
      where: { dayOfWeek }
    });

    if (!workingHours || !workingHours.isActive) {
      return { date, slots: [] };
    }

    // Obtener todas las reservas del día
    const bookings = await prisma.booking.findMany({
      where: {
        date: dateObj,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      include: {
        service: {
          select: {
            name: true
          }
        }
      }
    });

    // Generar todos los slots (ocupados y libres)
    const slots = [];
    const [startHour, startMin] = workingHours.startTime.split(':').map(Number);
    const [endHour, endMin] = workingHours.endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      // Buscar si hay una reserva en este horario
      const booking = bookings.find((b: any) => b.startTime === timeSlot);

      if (booking) {
        slots.push({
          time: timeSlot,
          isAvailable: false,
          booking: {
            id: booking.id,
            service: booking.service.name,
            status: booking.status,
            formSubmissionId: booking.formSubmissionId
          }
        });
      } else {
        slots.push({
          time: timeSlot,
          isAvailable: true
        });
      }

      // Avanzar 1 hora
      currentHour += 1;
    }

    return { date, slots };
  }
}

export const bookingsService = new BookingsService();
