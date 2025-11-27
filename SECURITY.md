# Seguridad - Esencia Pura Booking System

## Implementación de Autenticación JWT

### ✅ Rutas Protegidas

Todas las rutas administrativas ahora requieren autenticación JWT mediante Bearer token.

#### Categories (Categorías)
- ✅ `GET /categories/admin/all` - Ver todas las categorías (activas + inactivas)
- ✅ `GET /categories/admin/stats` - Estadísticas de categorías
- ✅ `POST /categories` - Crear categoría
- ✅ `PATCH /categories/:id` - Actualizar categoría
- ✅ `DELETE /categories/:id` - Eliminar categoría

#### Services (Servicios)
- ✅ `GET /services/admin/all` - Ver todos los servicios (activos + inactivos)
- ✅ `POST /services` - Crear servicio
- ✅ `PATCH /services/:id` - Actualizar servicio
- ✅ `DELETE /services/:id` - Eliminar servicio

#### Bookings (Reservas)
- ✅ `POST /bookings` - Crear reserva
- ✅ `GET /bookings` - Listar todas las reservas
- ✅ `GET /bookings/calendar` - Vista de calendario completa
- ✅ `GET /bookings/:id` - Ver detalles de reserva
- ✅ `PATCH /bookings/:id/confirm` - Confirmar reserva
- ✅ `PATCH /bookings/:id/cancel` - Cancelar reserva
- ✅ `PATCH /bookings/:id/complete` - Completar reserva

### 🔓 Rutas Públicas (sin autenticación)

- `GET /categories` - Listar categorías activas
- `GET /categories/:id` - Ver categoría específica
- `GET /services` - Listar servicios activos
- `GET /services/:id` - Ver servicio específico
- `GET /bookings/available-slots` - Ver horarios disponibles

## Configuración

### Variables de Entorno

```env
# Autenticación
JWT_SECRET=esenciapura-secret-key-2025

# Email de negocio
BUSINESS_EMAIL=Esenciapuraluz.09@gmail.com
```

**IMPORTANTE:** En producción, cambiar `JWT_SECRET` por un valor seguro generado aleatoriamente.

## Middleware de Autenticación

### Ubicación
`src/common/middleware/authenticate.ts`

### Funcionamiento
1. Extrae el token del header `Authorization: Bearer <token>`
2. Verifica el token usando `JWT_SECRET`
3. Extrae `userId` y `email` del payload
4. Los agrega al objeto `req` (AuthRequest)
5. Retorna error 401 si el token es inválido o falta

### Uso en Rutas
```typescript
import { authenticate } from '../../common/middleware/authenticate';

router.post('/services', authenticate, createService);
router.patch('/services/:id', authenticate, updateService);
```

## Frontend - Admin Panel

### Login
- Ubicación: `/public/admin/login.html`
- Al iniciar sesión exitosamente, guarda el JWT en `localStorage`
- Verifica expiración del token automáticamente

### Envío de Token
Todos los archivos admin JavaScript envían el token:
- `/public/admin/js/categories.js` ✅
- `/public/admin/js/services.js` ✅
- `/public/admin/js/bookings.js` ✅

### Función Helper
```javascript
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin/login.html';
        throw new Error('No hay sesión activa');
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}
```

### Ejemplo de Uso
```javascript
const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
});
```

## Manejo de Errores

### 401 Unauthorized
- Si el token es inválido/expirado, la API retorna 401
- El frontend redirige automáticamente a `/admin/login.html`
- El token se elimina del localStorage

### Mensajes de Error
```json
{
  "error": "No se proporcionó token de autenticación"
}
```

```json
{
  "error": "Token inválido o expirado"
}
```

## Próximos Pasos (Recomendaciones)

### Alta Prioridad
1. **Cambiar JWT_SECRET en producción** - Usar variable de entorno segura
2. **Agregar refresh tokens** - Para renovar sesiones sin re-login
3. **Rate limiting mejorado** - Limitar intentos de login
4. **Logs de seguridad** - Registrar intentos de acceso no autorizados

### Media Prioridad
5. **2FA (Two-Factor Auth)** - Autenticación de dos factores para admin
6. **Roles y permisos** - Diferenciar entre admin y super-admin
7. **Audit logs** - Registrar todas las acciones administrativas

### Baja Prioridad
8. **Password policies** - Requisitos de complejidad de contraseña
9. **Session management** - Control de sesiones activas
10. **IP whitelisting** - Restringir acceso admin por IP

## Pruebas de Seguridad

### Verificar Protección
```bash
# Sin token - debe fallar con 401
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'

# Con token válido - debe funcionar
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Test"}'
```

### Login de Prueba
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@esenciapura.com","password":"tu_password"}'
```

## Notas Importantes

1. **Todos los endpoints admin están protegidos** ✅
2. **Los tokens expiran** - Configurado en auth.service.ts
3. **HTTPS requerido en producción** - Para seguridad del token
4. **CORS configurado** - Permite solo orígenes autorizados
5. **Rate limiting activo** - Protección contra fuerza bruta

---

**Implementado el:** 16 de Noviembre, 2025  
**Última actualización:** 16 de Noviembre, 2025
