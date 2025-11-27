"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.listBookings = listBookings;
exports.getBooking = getBooking;
exports.confirmBooking = confirmBooking;
exports.cancelBooking = cancelBooking;
exports.getAvailableSlots = getAvailableSlots;
exports.getCalendarView = getCalendarView;
const zod_1 = require("zod");
const bookings_service_1 = require("./bookings.service");
const email_service_1 = require("../../common/services/email.service");
// Schema de validación para crear reserva (CLIENTE - solicitud de reserva)
const createBookingSchema = zod_1.z.object({
    serviceId: zod_1.z.string().min(1, 'Servicio es requerido'),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    startTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:mm)'),
    customerName: zod_1.z.string().min(1, 'Nombre del cliente es requerido'),
    customerEmail: zod_1.z.string().email('Email inválido').optional(), // Opcional para admin
    customerPhone: zod_1.z.string().min(1, 'Teléfono del cliente es requerido'),
    notes: zod_1.z.string().optional(),
    formSubmissionId: zod_1.z.string().optional(),
    skipAvailabilityCheck: zod_1.z.boolean().optional() // Admin puede forzar reserva en slot ocupado
});
// Crear una nueva reserva (PÚBLICO - solicitud del cliente)
// El cliente llena el formulario web y esto envía un email al admin
async function createBooking(req, res) {
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
        const booking = await bookings_service_1.bookingsService.create(data);
        // Verificar que el booking tenga el servicio incluido
        if (!booking.service) {
            throw new Error('Error al obtener información del servicio');
        }
        // Enviar email al admin con los datos del cliente
        try {
            await email_service_1.emailService.sendNewBookingNotification({
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
        }
        catch (emailError) {
            console.error('❌ Error al enviar email al admin:', emailError);
            // No fallar la reserva si el email falla
        }
        // Enviar instrucciones de pago al cliente (SOLO si hay email)
        if (data.customerEmail) {
            try {
                await email_service_1.emailService.sendPaymentInstructions({
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
            }
            catch (emailError) {
                console.error('❌ Error al enviar email al cliente:', emailError);
                // No fallar la reserva si el email falla
            }
        }
        return res.status(201).json({
            message: 'Solicitud de reserva recibida. Te contactaremos pronto para confirmar.',
            booking
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error al crear la reserva' });
    }
}
// Listar todas las reservas (admin)
async function listBookings(req, res) {
    try {
        const { status, date } = req.query;
        const bookings = await bookings_service_1.bookingsService.list({
            status: status,
            date: date
        });
        return res.json({ bookings });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al listar reservas' });
    }
}
// Obtener reserva por ID (admin)
async function getBooking(req, res) {
    try {
        const { id } = req.params;
        const booking = await bookings_service_1.bookingsService.getById(id);
        if (!booking) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        return res.json({ booking });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al obtener reserva' });
    }
}
// Confirmar reserva (admin)
// NOTA: No se envía email automático porque los datos del cliente están en Google Forms.
//       El admin debe confirmar manualmente con el cliente usando la información del formulario.
async function confirmBooking(req, res) {
    try {
        const { id } = req.params;
        const booking = await bookings_service_1.bookingsService.confirm(id);
        return res.json({
            message: 'Reserva confirmada exitosamente. Confirma manualmente con el cliente usando los datos de Google Forms.',
            booking
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al confirmar reserva' });
    }
}
// Cancelar reserva
async function cancelBooking(req, res) {
    try {
        const { id } = req.params;
        const booking = await bookings_service_1.bookingsService.cancel(id);
        return res.json({
            message: 'Reserva cancelada exitosamente',
            booking
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al cancelar reserva' });
    }
}
// Obtener horarios disponibles (público)
async function getAvailableSlots(req, res) {
    try {
        const { date, serviceId } = req.query;
        if (!date || !serviceId) {
            return res.status(400).json({
                error: 'Se requieren los parámetros date y serviceId'
            });
        }
        const slots = await bookings_service_1.bookingsService.getAvailableSlots(date, serviceId);
        return res.json({
            date,
            serviceId,
            availableSlots: slots
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error al obtener horarios' });
    }
}
// Obtener vista completa de calendario (ADMIN - muestra todos los slots)
async function getCalendarView(req, res) {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({
                error: 'Se requiere el parámetro date (formato YYYY-MM-DD)'
            });
        }
        const calendar = await bookings_service_1.bookingsService.getCalendarView(date);
        return res.json(calendar);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error al obtener calendario' });
    }
}
