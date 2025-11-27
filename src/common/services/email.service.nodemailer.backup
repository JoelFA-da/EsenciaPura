import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
import { env } from '../../config/index';

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  bookingId: string;
}

export interface NewBookingNotificationData {
  booking: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    service: {
      name: string;
      price: number;
      duration: number;
    };
  };
  customer: {
    name: string;
    phone: string;
    notes?: string;
  };
}

export interface ClientPaymentInstructionsData {
  booking: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    service: {
      name: string;
      price: number;
      duration: number;
    };
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

class EmailService {
  private transporter;

  constructor() {
    // Configurar transporter de Nodemailer
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465, // true for 465 (SMTPS), false for 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Enviar notificación de nueva reserva al negocio (cuando CLIENTE crea solicitud)
  async sendNewBookingNotification(data: NewBookingNotificationData): Promise<void> {
    try {
      const businessEmail = process.env.BUSINESS_EMAIL || 'esenciapura@example.com';
      
      const dateFormatted = new Date(data.booking.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await this.transporter.sendMail({
        from: `"Esencia Pura - Sistema de Reservas" <${process.env.SMTP_USER}>`,
        to: businessEmail,
        subject: `🔔 Nueva Solicitud de Reserva - ${data.booking.service.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #9BA4D4 0%, #B8A4D4 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✨ Nueva Solicitud de Reserva</h1>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Se ha recibido una nueva solicitud de reserva. Los detalles son:</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9BA4D4;">
                <h2 style="color: #9BA4D4; margin-top: 0; font-size: 20px;">📋 Datos del Servicio</h2>
                <p style="margin: 8px 0;"><strong>Servicio:</strong> ${data.booking.service.name}</p>
                <p style="margin: 8px 0;"><strong>Fecha:</strong> ${dateFormatted}</p>
                <p style="margin: 8px 0;"><strong>Hora:</strong> ${data.booking.startTime} - ${data.booking.endTime}</p>
                <p style="margin: 8px 0;"><strong>Duración:</strong> ${data.booking.service.duration} minutos</p>
                <p style="margin: 8px 0;"><strong>Precio:</strong> ₡${data.booking.service.price.toLocaleString()}</p>
              </div>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #B8A4D4;">
                <h2 style="color: #B8A4D4; margin-top: 0; font-size: 20px;">👤 Datos del Cliente</h2>
                <p style="margin: 8px 0;"><strong>Nombre:</strong> ${data.customer.name}</p>
                <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${data.customer.phone}</p>
                ${data.customer.notes ? `<p style="margin: 8px 0;"><strong>Notas:</strong> ${data.customer.notes}</p>` : ''}
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  💡 <strong>Próximos pasos:</strong><br>
                  1. Contacta al cliente al <strong>${data.customer.phone}</strong><br>
                  2. Envía instrucciones de pago SINPE (₡5,000 anticipo)<br>
                  3. Confirma la reserva en el panel admin cuando recibas el pago
                </p>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                <strong>ID de Reserva:</strong> ${data.booking.id}
              </p>
              
              <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
                Este es un mensaje automático del sistema de reservas de Esencia Pura.<br>
                No respondas a este correo.
              </p>
            </div>
          </div>
        `
      });

      logger.info(`✅ Email de nueva reserva enviado a ${businessEmail} para booking ${data.booking.id}`);
    } catch (error) {
      logger.error(`❌ Error al enviar email de nueva reserva: ${error}`);
      throw error;
    }
  }

  // Enviar instrucciones de pago SINPE al cliente
  async sendPaymentInstructions(data: ClientPaymentInstructionsData): Promise<void> {
    try {
      const dateFormatted = new Date(data.booking.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const depositAmount = 5000; // ₡5,000 anticipo
      const businessPhone = process.env.BUSINESS_PHONE || '8882-6504';

      await this.transporter.sendMail({
        from: `"Esencia Pura" <${process.env.SMTP_USER}>`,
        to: data.customer.email,
        subject: `✨ Solicitud de Reserva Recibida - ${data.booking.service.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #9BA4D4 0%, #B8A4D4 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">✨ Esencia Pura</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Tu oasis de bienestar y relajación</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Hola <strong>${data.customer.name}</strong>,</p>
              <p style="font-size: 16px; color: #333;">
                ¡Gracias por elegir Esencia Pura! Hemos recibido tu solicitud de reserva y pronto nos pondremos en contacto contigo para confirmar.
              </p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9BA4D4;">
                <h2 style="color: #9BA4D4; margin-top: 0; font-size: 20px;">📋 Detalles de tu Reserva</h2>
                <p style="margin: 8px 0;"><strong>Servicio:</strong> ${data.booking.service.name}</p>
                <p style="margin: 8px 0;"><strong>Fecha:</strong> ${dateFormatted}</p>
                <p style="margin: 8px 0;"><strong>Hora:</strong> ${data.booking.startTime}</p>
                <p style="margin: 8px 0;"><strong>Duración:</strong> ${data.booking.service.duration} minutos</p>
                <p style="margin: 8px 0;"><strong>Precio Total:</strong> ₡${data.booking.service.price.toLocaleString()}</p>
                <p style="margin: 8px 0;"><strong>ID de Reserva:</strong> ${data.booking.id}</p>
              </div>
              
              <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                <h2 style="color: #2e7d32; margin-top: 0; font-size: 20px;">💳 Instrucciones de Pago</h2>
                <p style="margin: 8px 0; color: #333;">
                  Para confirmar tu reserva, realiza un depósito de anticipo por <strong style="font-size: 18px;">₡${depositAmount.toLocaleString()}</strong> mediante SINPE Móvil:
                </p>
                <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <p style="margin: 8px 0; font-size: 16px;"><strong>📱 Teléfono SINPE:</strong> <span style="color: #2e7d32; font-size: 20px;">${businessPhone}</span></p>
                  <p style="margin: 8px 0;"><strong>💰 Monto:</strong> ₡${depositAmount.toLocaleString()}</p>
                  <p style="margin: 8px 0;"><strong>📝 Concepto:</strong> Reserva ${data.booking.id}</p>
                </div>
                <p style="margin: 8px 0; color: #666; font-size: 14px;">
                  ⚠️ <strong>Importante:</strong> Por favor, envía el comprobante de pago por WhatsApp al ${businessPhone} junto con tu nombre y ID de reserva.
                </p>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  💡 <strong>Próximos Pasos:</strong><br>
                  1️⃣ Realiza el depósito de ₡${depositAmount.toLocaleString()} por SINPE Móvil<br>
                  2️⃣ Envía el comprobante por WhatsApp al ${businessPhone}<br>
                  3️⃣ Espera nuestra confirmación (te contactaremos al ${data.customer.phone})<br>
                  4️⃣ El saldo restante de ₡${(data.booking.service.price - depositAmount).toLocaleString()} se cancela el día de tu cita
                </p>
              </div>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #666;">¿Tienes dudas? Contáctanos:</p>
                <a href="https://wa.me/506${businessPhone.replace(/-/g, '')}" 
                   style="display: inline-block; background-color: #25d366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                  💬 WhatsApp: ${businessPhone}
                </a>
              </div>
              
              <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center;">
                Este es un mensaje automático del sistema de reservas de Esencia Pura.<br>
                Por favor, no respondas directamente a este correo. Usa WhatsApp para comunicarte con nosotros.
              </p>
            </div>
          </div>
        `
      });

      logger.info(`✅ Instrucciones de pago enviadas a ${data.customer.email} para booking ${data.booking.id}`);
    } catch (error) {
      logger.error(`❌ Error al enviar instrucciones de pago: ${error}`);
      throw error;
    }
  }

  // Enviar confirmación al cliente (legacy, mantener para compatibilidad)
  async sendBookingConfirmation(data: BookingEmailData): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Esencia Pura" <${process.env.SMTP_USER}>`,
        to: data.customerEmail,
        subject: `Confirmación de Reserva - ${data.serviceName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c5f2d;">¡Tu Reserva ha sido Confirmada!</h2>
            <p>Hola ${data.customerName},</p>
            <p>Tu reserva en Esencia Pura ha sido confirmada exitosamente.</p>
            
            <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2c5f2d;">Detalles de tu Reserva</h3>
              <p><strong>Servicio:</strong> ${data.serviceName}</p>
              <p><strong>Fecha:</strong> ${data.date}</p>
              <p><strong>Hora:</strong> ${data.time}</p>
              <p><strong>Código de Reserva:</strong> ${data.bookingId}</p>
            </div>
            
            <p>Te esperamos en la fecha y hora indicadas. Si necesitas realizar algún cambio, por favor contáctanos.</p>
            
            <p style="margin-top: 30px;">
              Saludos,<br>
              <strong>Equipo Esencia Pura</strong>
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Si no solicitaste esta reserva, por favor ignora este correo.
            </p>
          </div>
        `
      });

      logger.info(`Email de confirmación enviado a ${data.customerEmail}`);
    } catch (error) {
      logger.error(`Error al enviar email de confirmación: ${error}`);
      throw error;
    }
  }

  // Verificar configuración del servicio de email
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Conexión SMTP verificada exitosamente');
      return true;
    } catch (error) {
      logger.error(`Error al verificar conexión SMTP: ${error}`);
      return false;
    }
  }
}

export const emailService = new EmailService();
