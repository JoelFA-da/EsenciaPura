# Esencia Pura - Sistema de Reservas

API RESTful para gestión de reservas de spa y tratamientos de bienestar.

## Tecnologías

- **Backend**: Node.js + TypeScript + Express
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Email**: SendGrid API
- **Autenticación**: JWT
- **Validación**: Zod

## Instalación

```bash
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npx prisma generate
npx prisma migrate deploy
npm run build
```

## Desarrollo

```bash
npm run dev          # Servidor con hot-reload
npm run build        # Compilar TypeScript
npm start            # Producción
npm test             # Tests
```

## Estructura del Proyecto

```
src/
├── modules/         # Módulos de negocio
│   ├── auth/        # Autenticación
│   ├── services/    # Gestión de servicios
│   └── bookings/    # Sistema de reservas
├── common/          # Utilidades compartidas
│   ├── middleware/  # Middlewares Express
│   ├── services/    # Servicios (email, etc)
│   └── utils/       # Logger y utilidades
└── config/          # Configuración
```

## API Endpoints

### Públicos
- `GET /services` - Listar servicios activos
- `GET /services/:id` - Detalle de servicio
- `GET /bookings/available-slots` - Horarios disponibles

### Admin (requiere autenticación)
- `POST /services` - Crear servicio
- `PATCH /services/:id` - Actualizar servicio
- `GET /bookings/calendar` - Calendario completo
- `POST /bookings` - Crear reserva
- `PATCH /bookings/:id/confirm` - Confirmar reserva

## Configuración

Variables de entorno requeridas en `.env`:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=secret-key
SENDGRID_API_KEY=SG.xxx
BUSINESS_EMAIL=email@business.com
IMGBB_API_KEY=xxx
```

## Despliegue

El proyecto está configurado para Render.com con PostgreSQL.

## Licencia

Proyecto académico - Universidad Tecnica Nacional
