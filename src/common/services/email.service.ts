import nodemailer from 'nodemailer';
import { logger } from '@common/utils/logger';

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  bookingId: string;
}

class EmailService {
  private transporter;

  constructor() {
    // Configurar transporter de Nodemailer
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Enviar notificación de nueva reserva al negocio
  async sendNewBookingNotification(data: BookingEmailData): Promise<void> {
    try {
      const businessEmail = process.env.BUSINESS_EMAIL || 'esenciapura@example.com';

      await this.transporter.sendMail({
        from: `"Esencia Pura - Sistema de Reservas" <${process.env.SMTP_USER}>`,
        to: businessEmail,
        subject: `Nueva Reserva - ${data.serviceName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c5f2d;">Nueva Reserva Recibida</h2>
            <p>Se ha recibido una nueva solicitud de reserva con los siguientes detalles:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Cliente:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              <p><strong>Servicio:</strong> ${data.serviceName}</p>
              <p><strong>Fecha:</strong> ${data.date}</p>
              <p><strong>Hora:</strong> ${data.time}</p>
              <p><strong>ID de Reserva:</strong> ${data.bookingId}</p>
            </div>
            
            <p>Por favor, confirma esta reserva desde el panel de administración.</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Este es un mensaje automático del sistema de reservas de Esencia Pura.
            </p>
          </div>
        `
      });

      logger.info(`Email de nueva reserva enviado a ${businessEmail}`);
    } catch (error) {
      logger.error(`Error al enviar email de nueva reserva: ${error}`);
      throw error;
    }
  }

  // Enviar confirmación al cliente
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
