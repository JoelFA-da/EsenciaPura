# Esencia Pura - Booking System API 🌿

**Backend API para sistema de reservas de tratamientos de spa/bienestar**

Sistema de gestión de reservas desarrollado con Node.js, TypeScript, Express y PostgreSQL. Permite a clientes reservar tratamientos en línea y a administradores gestionar citas mediante un panel de control.

---

## 📋 Características

### ✅ Implementado
- **Gestión de Servicios**: CRUD completo para tratamientos del spa
- **Sistema de Reservas**: Creación por admin después de validar Google Form
- **Calendario de 2 Vistas**: 
  - **Usuario**: Solo slots disponibles (GET /available-slots)
  - **Admin**: Calendario completo con slots ocupados y libres (GET /calendar)
- **Integración Google Forms**: Flujo completo de reserva
- **Notificaciones Email**: Confirmación al cliente cuando admin aprueba
- **Horarios Configurables**: WorkingHours por día de la semana
- **Autenticación Básica**: Stubs de registro/login (JWT)
- **Validación de Datos**: Esquemas Zod en todos los endpoints
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Logging**: Pino con pretty output en desarrollo

### 🚧 Pendiente
- Middleware de autenticación JWT para rutas admin
- Módulo de galería (Media)
- Seeding de base de datos
- Tests de integración
- Documentación OpenAPI/Swagger
- Configuración de deployment (Render/Docker)

---

## 🔄 Flujo de Reservas (Google Forms Integration)

### Para el Usuario (Cliente):

1. **Consultar disponibilidad**: Usuario accede a la página web
2. **Ver slots disponibles**: Frontend llama `GET /bookings/available-slots?date=2025-02-15&serviceId=xxx`
3. **Seleccionar horario**: Usuario elige un slot libre
4. **Completar formulario**: Se abre Google Forms con el slot pre-seleccionado
5. **Envío automático**: Google Forms envía email al negocio con los datos

### Para el Admin (Empresa):

1. **Recibir notificación**: Email de Google Forms con datos del cliente
2. **Revisar solicitud**: Admin verifica datos y disponibilidad en calendario
3. **Ver calendario completo**: `GET /bookings/calendar?date=2025-02-15` (muestra todos los slots)
4. **Crear reserva**: Admin usa `POST /bookings` con datos del formulario
5. **Confirmar reserva**: `PATCH /bookings/:id/confirm` → Envía email de confirmación al cliente

### Diagrama de Flujo:
```
Usuario → Selecciona Slot → Google Form → Email al Negocio
                                               ↓
                                         Admin Revisa
                                               ↓
                                    POST /bookings (crear)
                                               ↓
                                    PATCH /confirm (aprobar)
                                               ↓
                                    Email Confirmación → Cliente
```

---

## 🛠 Tecnologías

- **Runtime**: Node.js 20.19.5 (vía NVM)
- **Framework**: Express 4.19.2 + TypeScript 5.9.3
- **Base de Datos**: PostgreSQL + Prisma ORM 6.18.0
- **Email**: Nodemailer
- **Validación**: Zod 3.23.0
- **Fechas**: date-fns
- **Testing**: Jest 29.7.0 + Supertest 6.3.4
- **Linting**: ESLint + Prettier

---

## 📦 Instalación

### Prerequisitos

Necesitás **Node.js >= 20**. Si tenés Node.js v12 (del sistema), instalá **NVM**:

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Cargar NVM en la sesión actual
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar Node.js 20
nvm install 20
nvm use 20

# Verificar
node -v  # debería mostrar v20.x.x
```

También necesitás **PostgreSQL** (local o remoto):

```bash
# Opción 1: PostgreSQL local (Ubuntu/Debian)
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Opción 2: Usar Docker
docker run --name esenciapura-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Opción 3: Usar servicio en la nube (Render, Supabase, Neon, etc.)
```

### Instalación del proyecto

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd TCU

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver sección Variables de Entorno)

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Ejecutar migraciones de base de datos
npx prisma migrate dev --name init

# 6. (Opcional) Explorar base de datos
npx prisma studio
```

---

## 🚀 Scripts

```bash
# Desarrollo (con hot reload)
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start

# Tests
npm test

# Linting
npm run lint

# Formatear código
npm run format

# Prisma: generar cliente
npx prisma generate

# Prisma: crear migración
npx prisma migrate dev --name <nombre>

# Prisma: aplicar migraciones en producción
npx prisma migrate deploy

# Prisma: abrir GUI de base de datos
npx prisma studio
```

---

## 📂 Estructura del Proyecto

```
src/
├── modules/
│   ├── auth/                      # Autenticación de admin (JWT stubs)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   ├── services/                  # Gestión de tratamientos del spa
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   └── services.routes.ts
│   └── bookings/                  # Sistema de reservas + calendario
│       ├── bookings.controller.ts
│       ├── bookings.service.ts
│       └── bookings.routes.ts
├── common/
│   ├── middleware/                # errorHandler, requestLogger
│   ├── services/                  # emailService (Nodemailer)
│   ├── errors/                    # AppError class
│   └── utils/                     # logger (Pino)
├── config/                        # Variables de entorno
├── app.ts                         # Factory de Express app
└── server.ts                      # Entry point
prisma/
├── schema.prisma                  # Modelos de base de datos
└── migrations/                    # Historial de migraciones
```

---

## 🗄️ Modelo de Datos (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
}

model Service {
  id          String    @id @default(cuid())
  name        String
  description String?
  price       Float
  duration    Int       // minutos
  imageUrl    String?
  isActive    Boolean   @default(true)
  bookings    Booking[]
  createdAt   DateTime  @default(now())
}

model Booking {
  id               String   @id @default(cuid())
  serviceId        String
  service          Service  @relation(fields: [serviceId], references: [id])
  date             DateTime
  startTime        String   // "HH:mm"
  endTime          String   // "HH:mm"
  status           BookingStatus @default(PENDING)
  formSubmissionId String?  // ID de Google Forms
  notes            String?
  createdAt        DateTime @default(now())
  
  @@index([date, startTime])
  @@index([serviceId])
  @@index([status])
}

# NOTA: Los datos del cliente (nombre, email, teléfono) están en Google Forms.
# La tabla Booking solo registra qué slots están ocupados.

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model WorkingHours {
  id        String  @id @default(cuid())
  dayOfWeek Int     // 0=Domingo, 6=Sábado
  startTime String  // "HH:mm"
  endTime   String  // "HH:mm"
  isActive  Boolean @default(true)
}

model Media {
  id          String    @id @default(cuid())
  type        MediaType
  url         String
  title       String?
  description String?
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
}

enum MediaType {
  IMAGE
  VIDEO
}
```

---

## 🔌 API Endpoints

### Públicos

```http
# Health Check
GET /health
Response: { "status": "ok", "timestamp": "..." }

# Servicios
GET /services
Response: [{ id, name, description, price, duration, imageUrl }, ...]

GET /services/:id
Response: { id, name, description, price, duration, imageUrl }

# Slots Disponibles (USUARIO - solo libres)
GET /bookings/available-slots?date=2025-02-15&serviceId=clxyz...
Response: {
  "date": "2025-02-15",
  "serviceId": "clxyz...",
  "availableSlots": ["09:00", "10:00", "11:00", "14:00"]
}
Notes: Retorna SOLO horarios libres para que el usuario seleccione y complete Google Form
```

### Admin (⚠️ Sin autenticación por ahora)

```http
# Vista Completa de Calendario (ADMIN - ocupados + libres)
GET /bookings/calendar?date=2025-02-15
Response: {
  "date": "2025-02-15",
  "slots": [
    { "time": "09:00", "isAvailable": true },
    { 
      "time": "10:00", 
      "isAvailable": false,
      "booking": {
        "id": "clxyz...",
        "customerName": "María González",
        "service": "Masaje Relajante",
        "status": "CONFIRMED"
      }
    },
    { "time": "11:00", "isAvailable": true },
    ...
  ]
}
Notes: Vista admin que muestra TODOS los slots del día

# Servicios
POST /services
Body: { "name": "Masaje Relajante", "description": "...", "price": 50, "duration": 60 }

PATCH /services/:id
Body: { "price": 55, "isActive": false }

DELETE /services/:id
Notes: Marca como inactivo (soft delete)

# Reservas (ADMIN ONLY)
POST /bookings
Body: {
  "serviceId": "clxyz...",
  "date": "2025-02-15",
  "startTime": "10:00",
  "notes": "Cliente prefiere masajista femenina (opcional)",
  "formSubmissionId": "response-123",  // ID del Google Form (opcional)
  "skipAvailabilityCheck": false  // true = admin puede forzar slot ocupado
}
Response: { id, serviceId, date, startTime, endTime, status: "PENDING", formSubmissionId, ... }
Notes: ADMIN ONLY - Se usa después de revisar el Google Form
       NO incluye datos del cliente (están en Google Forms)
       NO envía email (ya lo recibió de Google Forms)

GET /bookings?status=PENDING&date=2025-02-15
Response: [{ id, service: {...}, date, time, status, formSubmissionId }, ...]

GET /bookings/:id
Response: { id, serviceId, service, date, startTime, endTime, status, notes, formSubmissionId }

PATCH /bookings/:id/confirm
Response: { id, status: "CONFIRMED", ... }
Notes: Marca slot como confirmado
       Admin debe confirmar manualmente con cliente usando datos de Google Forms

PATCH /bookings/:id/cancel
Response: { id, status: "CANCELLED", ... }

# Autenticación
POST /auth/register
Body: { "email": "admin@esenciapura.com", "password": "..." }

POST /auth/login
Body: { "email": "...", "password": "..." }
Notes: Retorna JWT (stub por ahora)
```

---

## ⚙️ Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Servidor
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Base de Datos (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/esenciapura?schema=public"

# SMTP Email (Gmail ejemplo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
BUSINESS_EMAIL=admin@esenciapura.com

# Autenticación
JWT_SECRET=tu-secreto-super-seguro-aqui
```

### Notas SMTP:
- **Gmail**: Crear "App Password" en https://myaccount.google.com/apppasswords
- **Zoho**: SMTP: smtp.zoho.com, Puerto: 587
- **Outlook**: SMTP: smtp-mail.outlook.com, Puerto: 587

---

## 📝 Configuración de Google Forms

### Crear Formulario de Reservas

1. **Ir a Google Forms**: https://forms.google.com
2. **Crear nuevo formulario**: "Reserva - Esencia Pura"
3. **Agregar campos**:
   - Nombre completo (texto corto, obligatorio)
   - Email (texto corto, obligatorio, validación email)
   - Teléfono (texto corto, obligatorio)
   - Servicio deseado (lista desplegable o texto)
   - Fecha seleccionada (texto corto, YYYY-MM-DD)
   - Horario seleccionado (texto corto, HH:mm)
   - Notas adicionales (párrafo, opcional)

4. **Configurar notificaciones**:
   - Settings → Responses → "Get email notifications for new responses"
   - Email destino: `BUSINESS_EMAIL` del .env

5. **Habilitar en el frontend**:
```javascript
// Cuando usuario selecciona slot:
const formUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url&entry.123456=${date}&entry.789012=${time}&entry.345678=${serviceId}`;
window.open(formUrl, '_blank');
```

### Workflow Completo

```
1. Usuario selecciona slot en calendario web
   ↓
2. Se abre Google Form pre-llenado con fecha/hora/servicio
   ↓
3. Usuario completa nombre, email, teléfono, notas
   ↓
4. Submit → Email automático a BUSINESS_EMAIL
   ↓
5. Admin revisa email y accede al panel admin
   ↓
6. Admin crea reserva: POST /bookings (solo serviceId + date + startTime)
   ↓
7. Admin confirma: PATCH /bookings/:id/confirm (marca slot como ocupado)
   ↓
8. Admin contacta manualmente al cliente usando datos del email de Google Forms
```

**Nota**: Los datos del cliente (nombre, email, teléfono) NO se almacenan en la base de datos.
Solo se guardan en las respuestas de Google Forms. El admin debe consultar el email de Google
Forms para obtener la información de contacto del cliente.

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm test -- --watch

# Test con cobertura
npm test -- --coverage
```

Estructura de tests:

```
tests/
├── health.test.ts           # Test del endpoint /health
├── services.test.ts         # (TODO) Tests de servicios
└── bookings.test.ts         # (TODO) Tests de reservas
```

---

## 📋 Requerimientos del PDF

### Funcionales Implementados ✅

- **RF-02**: Sección de servicios (GET /services)
- **RF-04**: Reserva en línea (integración con Google Forms + POST /bookings admin)
- **RF-05**: Validación de formularios (Zod schemas + Google Forms)
- **RF-06**: Notificaciones por email (confirmación al cliente tras aprobación admin)
- **RF-07**: Mostrar solo espacios disponibles (GET /available-slots para usuarios)
- **RF-08**: Vista dual de calendario:
  - **Usuario**: GET /available-slots (solo libres)
  - **Admin**: GET /calendar (todos los slots con estado)
- **RF-12**: Confirmación manual tras revisar Google Form (PATCH /bookings/:id/confirm)

### No Funcionales Implementados ✅

- **RNF-02**: Español únicamente (todos los mensajes en español)
- **RNF-03**: Despliegue económico (listo para Render + PostgreSQL gratis)
- **RNF-04**: Configuración editable (servicios vía API, horarios en DB)

### Pendientes 🚧

- **RF-01**: Página de inicio (frontend)
- **RF-03**: Galería multimedia (modelo Media listo, endpoints pendientes)
- **RF-09**: Editor de configuración basado en JSON (panel admin)
- **RF-10**: Contenido del footer (frontend)
- **RF-11**: Diseño responsive (frontend)
- **RNF-01**: Diseño UI relajante (frontend)
- **RNF-05**: Tiempos de carga <3s (optimización frontend)

---

## 🚀 Deployment

### Render.com (Recomendado - 100% Gratis) 🌟

**Plan Free incluye:**
- ✅ Servidor Node.js (750 horas/mes gratis)
- ✅ PostgreSQL 1GB (gratis, se borra después de 90 días de inactividad)
- ✅ SSL/HTTPS automático
- ✅ **Dominio personalizado gratis** (ej: api.esenciapura.com)
- ✅ Deploy automático desde GitHub
- ⚠️ Se duerme después de 15 min de inactividad (~30seg para despertar)

---

#### Paso 1: Crear Cuenta en Render

1. Ir a https://render.com
2. Crear cuenta (conectar con GitHub)
3. Autorizar acceso al repositorio

---

#### Paso 2: Crear Base de Datos PostgreSQL

1. En Render Dashboard → **New +** → **PostgreSQL**
2. Configuración:
   - **Name**: `esenciapura-db`
   - **Database**: `esenciapura`
   - **User**: (auto-generado)
   - **Region**: `Oregon (US West)` o el más cercano
   - **Plan**: **Free** (1GB)
3. Click **Create Database**
4. Esperar 2-3 minutos a que se cree
5. **Copiar "External Database URL"** (la necesitarás en el paso 3)

```
Ejemplo:
postgresql://esenciapura_db_user:AB12cd...@dpg-xxx.oregon-postgres.render.com/esenciapura_db
```

---

#### Paso 3: Crear Web Service (API)

1. En Render Dashboard → **New +** → **Web Service**
2. Conectar repositorio de GitHub
3. Configuración:

| Campo | Valor |
|-------|-------|
| **Name** | `esenciapura-api` |
| **Region** | `Oregon (US West)` (mismo que la DB) |
| **Branch** | `main` o `master` |
| **Root Directory** | (dejar vacío) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npx prisma migrate deploy && npm start` |
| **Plan** | **Free** |

4. Click **Advanced** y agregar **Environment Variables**:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=<PEGAR_EXTERNAL_DATABASE_URL_DEL_PASO_2>

# SMTP (usar Gmail App Password o Zoho)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-de-16-caracteres
BUSINESS_EMAIL=admin@esenciapura.com

# JWT
JWT_SECRET=<GENERAR_RANDOM_STRING_SEGURO>

# Logging
LOG_LEVEL=info
```

> **Nota**: Para generar JWT_SECRET usa: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

5. Click **Create Web Service**
6. Esperar 5-10 minutos al primer deploy

---

#### Paso 4: Verificar Deployment

Una vez completado, Render te dará una URL como:
```
https://esenciapura-api.onrender.com
```

Probar en el navegador:
```
https://esenciapura-api.onrender.com/health
```

Deberías ver:
```json
{"status": "ok", "timestamp": "2025-10-25T..."}
```

---

#### Paso 5: Configurar Dominio Personalizado (Opcional)

**Si tenés dominio propio** (ej: `esenciapura.com`):

1. En tu Web Service → **Settings** → **Custom Domains**
2. Click **Add Custom Domain**
3. Ingresar: `api.esenciapura.com` (o el subdominio que prefieras)
4. Render te mostrará un registro DNS para configurar:

```
Tipo: CNAME
Nombre: api
Valor: esenciapura-api.onrender.com
```

5. Ir a tu proveedor de dominios (GoDaddy, Namecheap, etc.)
6. Agregar el registro CNAME en la configuración DNS
7. Esperar 5-60 minutos a que se propague
8. Render generará SSL/HTTPS automáticamente

**Resultado final:**
```
✅ https://api.esenciapura.com/health
✅ https://api.esenciapura.com/services
✅ https://api.esenciapura.com/bookings/available-slots
```

**Proveedores de dominios recomendados (Costa Rica):**
- **Namecheap**: ~$10/año (.com), panel DNS simple
- **Cloudflare Registrar**: ~$9/año (.com), incluye protección DDoS
- **GoDaddy**: ~$15/año (.com), soporte en español
- **Akky.cr**: Dominios `.cr` locales

**Estructura recomendada:**
```
esenciapura.com              → Sitio web (frontend)
api.esenciapura.com          → API backend (este proyecto)
admin.esenciapura.com        → Panel administrativo
```

---

#### Paso 6: Configurar Auto-Deploy (Opcional pero Recomendado)

Render ya detecta automáticamente los push a GitHub:

1. Hacer cambios en el código local
2. Commit y push:
   ```bash
   git add .
   git commit -m "Actualizar servicios"
   git push origin main
   ```
3. Render automáticamente:
   - Detecta el push
   - Ejecuta build
   - Despliega la nueva versión
   - ✅ ¡Listo!

---

### Costos y Limitaciones del Plan Free

| Recurso | Límite Free | Suficiente para Spa? |
|---------|-------------|---------------------|
| **Servidor** | 750 horas/mes | ✅ Sí (24/7 = 720h) |
| **Base de Datos** | 1GB | ✅ Sí (~10,000 reservas) |
| **Bandwidth** | 100GB/mes | ✅ Sí (API usa poco) |
| **Sleep después de 15min** | Primer request tarda 30seg | ⚠️ Aceptable |
| **Builds** | 500 min/mes | ✅ Sí (~10-20 deploys) |

**Cuando necesiten upgrade:**
- Servidor sin sleep: **$7/mes**
- PostgreSQL persistente: **$7/mes**
- Total: **$14/mes** (muy económico)

---

### Troubleshooting

**Error: "Build failed"**
- Verificar que `package.json` tenga `"engines": { "node": "20.x" }`
- Revisar logs en Render Dashboard

**Error: "Database connection failed"**
- Verificar que `DATABASE_URL` esté correctamente copiado
- Debe empezar con `postgresql://` (External, no Internal)

**API responde lento (30 segundos)**
- Normal en plan Free después de 15 min de inactividad
- Solución: Upgrade a $7/mes o usar servicio de "keep-alive" (UptimeRobot)

**SSL no funciona en dominio custom**
- Esperar hasta 1 hora después de configurar DNS
- Verificar que el CNAME apunte correctamente

---

## 🛠 Próximos Pasos

1. **Implementar autenticación JWT**: Middleware para proteger rutas admin
2. **Seed database**: Script para crear servicios y horarios iniciales
3. **Tests de integración**: Flujo completo de reserva (crear → notificar → confirmar)
4. **Documentación API**: Swagger/OpenAPI
5. **Frontend**: Cliente React/Vue consumiendo esta API
6. **Galería**: Endpoints GET/POST/DELETE para Media
7. **CI/CD**: GitHub Actions para tests automáticos

---

## 📖 Documentación Adicional

- **Prisma Docs**: https://www.prisma.io/docs
- **Express Best Practices**: https://expressjs.com/en/advanced/best-practice-security.html
- **Zod Validation**: https://zod.dev
- **Nodemailer**: https://nodemailer.com

---

## 📄 Licencia

Este proyecto es parte de un Trabajo Comunal Universitario (TCU) de la Universidad Tecnica Nacional.

