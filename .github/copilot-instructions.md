- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements

- [x] Scaffold the Project

- [x] Customize the Project

- [x] Install Required Extensions

- [x] Compile the Project

- [x] Create and Run Task

- [x] Launch the Project

- [x] Ensure Documentation is Complete

- [x] Extract Real Requirements from PDF

- [x] Adapt Architecture for Booking System

- [x] Configure Prisma ORM with PostgreSQL

- [x] Create Services & Bookings Modules

- [x] Integrate Email Notifications

## Project Information
This is the **Esencia Pura Booking System** - a Node.js + TypeScript + Express API for managing spa/wellness treatment reservations. The project includes:

### Core Features
- **Services Management**: CRUD operations for spa treatments (GET /services, POST /services, PATCH /services/:id)
- **Booking System with Google Forms Integration**: 
  - Users see available slots via GET /available-slots
  - Users fill Google Form (not direct API POST)
  - Admin receives email from Google Forms
  - Admin creates reservation in system via POST /bookings
  - Admin confirms via PATCH /bookings/:id/confirm → sends email to customer
- **2-View Calendar System**:
  - **User View**: GET /available-slots (only free slots)
  - **Admin View**: GET /calendar (all slots with booking details)
- **Email Notifications**: Only confirmation emails to customers (via Nodemailer)
- **Calendar Logic**: 1-hour time slots, availability checking, working hours configuration

### Booking Workflow (IMPORTANT!)
```
1. User → Selects available slot → Opens Google Form (pre-filled)
2. User → Completes Google Form → Submits
3. Google Forms → Sends email to business (BUSINESS_EMAIL)
4. Admin → Reviews email → Logs into admin panel
5. Admin → POST /bookings (creates reservation with form data)
6. Admin → PATCH /bookings/:id/confirm → Sends confirmation email to customer
```

**NOTE**: Users DO NOT call POST /bookings directly. Only admin uses this endpoint after reviewing Google Forms submissions.

### Technology Stack
- **Runtime**: Node.js 20+ (via NVM)
- **Framework**: Express 4.19 + TypeScript 5.9
- **Database**: PostgreSQL (Prisma ORM)
- **Email**: Nodemailer (SMTP - Gmail/Zoho)
- **Validation**: Zod
- **Date Handling**: date-fns
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest + Supertest
- **Logging**: Pino

### Database Schema (Prisma)
- **User**: Admin accounts (email, password, role)
- **Service**: Spa treatments (name, description, price, duration, imageUrl)
- **Booking**: Reservations (customer info, service, date, time, status: PENDING/CONFIRMED/CANCELLED/COMPLETED)
- **WorkingHours**: Business hours per day of week
- **Media**: Gallery images/videos

### API Endpoints
```
# Public
GET    /health                          → Health check
GET    /services                        → List active services
GET    /services/:id                    → Get service details
GET    /bookings/available-slots        → Get available time slots (query: date, serviceId)
                                           USERS ONLY - Shows only free slots for Google Form selection

# Admin (TODO: add auth middleware)
POST   /services                        → Create service
PATCH  /services/:id                    → Update service
DELETE /services/:id                    → Deactivate service
GET    /bookings/calendar               → Get complete calendar view (all slots: free + occupied)
                                           Returns: { date, slots: [{ time, isAvailable, booking? }] }
POST   /bookings                        → Create reservation (ADMIN ONLY - after Google Form review)
                                           Body includes: formSubmissionId, skipAvailabilityCheck
                                           Does NOT send email (already received from Google Forms)
GET    /bookings                        → List all reservations (filter by status, date)
GET    /bookings/:id                    → Get reservation details
PATCH  /bookings/:id/confirm            → Confirm reservation (sends email to customer)
PATCH  /bookings/:id/cancel             → Cancel reservation
POST   /auth/register                   → Register admin user
POST   /auth/login                      → Admin login (JWT)
```

### Project Structure
```
src/
├── modules/
│   ├── auth/           # Admin authentication (JWT stubs)
│   ├── services/       # Spa treatments management
│   └── bookings/       # Reservation system + calendar
├── common/
│   ├── middleware/     # errorHandler, requestLogger
│   ├── services/       # emailService (Nodemailer)
│   ├── errors/         # AppError class
│   └── utils/          # logger (Pino)
├── config/             # Environment variables
├── app.ts              # Express app factory
└── server.ts           # Entry point
prisma/
└── schema.prisma       # Database models
```

## Development Guidelines
- Run `npm run dev` for development mode with hot reload (tsx)
- Run `npm test` to execute tests
- Run `npm run build` to compile TypeScript → dist/
- Run `npx prisma studio` to explore database
- Run `npx prisma migrate dev` to apply schema changes
- Environment variables in `.env` (see `.env.example`)

## Requirements Mapping (from PDF)
### Functional Requirements Implemented
- ✅ RF-02: Services section (GET /services)
- ✅ RF-04: Online booking (POST /bookings)
- ✅ RF-05: Booking form validation (Zod schemas)
- ✅ RF-06: Email notifications (emailService)
- ✅ RF-07: Show only available slots (GET /available-slots)
- ✅ RF-08: Dual calendar view (client sees availability, admin sees all bookings)
- ✅ RF-12: Manual confirmation after partial payment (PATCH /bookings/:id/confirm)

### Non-Functional Requirements
- ✅ RNF-02: Spanish only (all messages in Spanish)
- ✅ RNF-03: Low-cost deployment ready (Render + free PostgreSQL)
- ✅ RNF-04: Editable config (services via API, working hours in DB)

### Pending Implementation
- [ ] RF-01: Landing page (frontend)
- [ ] RF-03: Gallery (Media model ready, endpoints pending)
- [ ] RF-09: JSON-based config editor (admin panel)
- [ ] RF-10: Footer content (frontend)
- [ ] RF-11: Responsive design (frontend)
- [ ] RNF-01: Relaxing UI design (frontend)
- [ ] RNF-05: <3s load times (frontend optimization)
- [ ] JWT authentication middleware for admin routes
- [ ] Database seeding script (initial services + working hours)
- [ ] Integration tests for booking flow
- [ ] Deployment configuration for Render

## Next Steps
1. **Add Authentication Middleware**: Protect admin endpoints with JWT verification
2. **Seed Database**: Create script to populate initial services and working hours
3. **Add Integration Tests**: Test complete booking flow (create → notify → confirm)
4. **Configure Deployment**: Create Dockerfile and Render configuration
5. **Document API**: Generate OpenAPI/Swagger documentation
6. **Frontend Integration**: Develop React/Vue client consuming this API
