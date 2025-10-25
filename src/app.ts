import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { errorHandler } from './common/middleware/errorHandler';
import { requestLogger } from './common/middleware/requestLogger';
import authRouter from './modules/auth/auth.routes';
import servicesRouter from './modules/services/services.routes';
import bookingsRouter from './modules/bookings/bookings.routes';

export function createApp() {
  const app = express();

  // Helmet con configuración para permitir recursos inline (CSS, fonts)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
      },
    },
  }));
  
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  // Servir archivos estáticos (frontend)
  app.use(express.static(path.join(__dirname, '../public')));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/auth', authRouter);
  app.use('/services', servicesRouter);
  app.use('/bookings', bookingsRouter);

  // Servir index.html para todas las rutas no-API (SPA fallback)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.use(errorHandler());
  return app;
}
