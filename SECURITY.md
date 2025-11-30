# Seguridad

## Autenticación JWT

El sistema utiliza JWT para proteger rutas administrativas.

### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-1",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Uso del Token

Incluir en header `Authorization`:

```bash
Authorization: Bearer <token>
```

## Variables de Entorno

```env
JWT_SECRET=<generar-clave-segura>
DATABASE_URL=<conexión-postgresql>
SENDGRID_API_KEY=<api-key>
IMGBB_API_KEY=<api-key>
```

## Endpoints Protegidos

Requieren autenticación JWT:
- POST/PATCH/DELETE `/services/*`
- POST/PATCH `/bookings/*`
- POST `/upload/*`

Endpoints públicos:
- GET `/services`
- GET `/bookings/available-slots`
