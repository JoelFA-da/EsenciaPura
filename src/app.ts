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
import { categoriesRoutes } from './modules/categories/categories.routes';

export function createApp() {
  const app = express();

  // Helmet con configuración para permitir recursos inline (CSS, fonts, scripts)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
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
      max: 1000, // Aumentado para desarrollo
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
  app.use('/categories', categoriesRoutes);
  app.use('/services', servicesRouter);
  app.use('/bookings', bookingsRouter);

  // Servir index.html para todas las rutas no-API (SPA fallback)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.use(errorHandler());
  return app;
}
