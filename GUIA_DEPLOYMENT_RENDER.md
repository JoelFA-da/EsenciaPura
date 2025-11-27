# 🚀 Guía Completa de Deployment en Render

## ✅ Pre-requisitos Completados

El código ya está listo para deployment. Se realizaron los siguientes cambios:

### 1. URLs del Frontend Actualizadas
# 🚀 Guía Completa de Deployment en Render

## ✅ Pre-requisitos Completados

El código ya está listo para deployment. Se realizaron los siguientes cambios:

### 1. URLs del Frontend Actualizadas
✅ Todos los archivos JavaScript ahora usan `window.location.origin` en lugar de `http://localhost:3000`
- `public/admin/js/bookings.js`
- `public/admin/js/dashboard.js`
- `public/admin/js/services.js`
- `public/admin/js/categories.js`
- `public/admin/js/login.js`
- `public/js/reserva.js`
- `public/js/app.js`
- `public/js/services-list.js`
- `public/js/service-detail.js`

Esto significa que **NO necesitas cambiar nada en el código** al publicar.

---

## 📋 Paso 1: Preparar el Repositorio Git

### 1.1 Inicializar Git (si no está inicializado)
```bash
cd /home/joel.fernandez/Documents/TCU
git init
git add .
git commit -m "Preparado para deployment en Render"
```

### 1.2 Subir a GitHub
```bash
# Crear repositorio en GitHub (https://github.com/new)
# Nombre sugerido: esencia-pura

git remote add origin https://github.com/TU-USUARIO/esencia-pura.git
git branch -M main
git push -u origin main
```

---

## 🌐 Paso 2: Crear Cuenta en Render

1. Ve a **https://render.com**
2. Click en **"Get Started"**
3. Regístrate con tu cuenta de GitHub
4. Autoriza a Render para acceder a tus repositorios

---

## 🛠️ Paso 3: Crear el Web Service

### 3.1 Dashboard de Render
1. Una vez logueado, click en **"New +"** (esquina superior derecha)
2. Selecciona **"Web Service"**

### 3.2 Conectar Repositorio
1. Busca y selecciona el repositorio **esencia-pura** (o el nombre que le pusiste)
2. Click en **"Connect"**

### 3.3 Configuración del Servicio
Completa los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `esenciapura` (o el nombre que prefieras) |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Root Directory** | Dejar vacío |
| **Runtime** | `Node` |
| **Build Command** | `npm ci && npx prisma generate && npm run build` |
| **Start Command** | `npx prisma migrate deploy && npm start` |
| **Instance Type** | `Free` |

### 3.4 Agregar Disco Persistente (IMPORTANTE para SQLite)
1. Scroll hacia abajo hasta **"Disks"**
2. Click en **"Add Disk"**
3. Configuración del disco:
   - **Name**: `esenciapura-sqlite`
   - **Mount Path**: `/data`
   - **Size**: `1 GB` (suficiente y gratis)

---

## 🔐 Paso 4: Configurar Variables de Entorno

En la misma página, scroll hasta **"Environment Variables"** y agrega:

### Variables Obligatorias:

```bash
# Base de Datos
DATABASE_URL=file:/data/esenciapura.db

# Servidor
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=Esenciapuraluz.09@gmail.com
SMTP_PASS=tmuz qsbw mczn tnal
BUSINESS_EMAIL=Esenciapuraluz.09@gmail.com
BUSINESS_PHONE=8882-6504

# JWT Secret (CAMBIAR por seguridad)
JWT_SECRET=esenciapura-production-secret-2025-change-me
```

### 4.1 Generar JWT Secret Seguro (RECOMENDADO)

En tu terminal local, ejecuta:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y úsalo como valor de `JWT_SECRET`.

### 4.2 Agregar Variables en Render
Para cada variable:
1. Click en **"Add Environment Variable"**
2. Pega el **Key** (nombre) y **Value** (valor)
3. Repite para todas las variables

---

## 🚀 Paso 5: Desplegar

1. Click en **"Create Web Service"** (botón azul al final)
2. Render comenzará a:
   - ✅ Clonar tu repositorio
   - ✅ Instalar dependencias (`npm ci`)
   - ✅ Generar cliente de Prisma
   - ✅ Compilar TypeScript (`npm run build`)
   - ✅ Ejecutar migraciones de base de datos
   - ✅ Iniciar el servidor

3. **Espera 3-5 minutos** mientras se completa el despliegue

---

## 🎉 Paso 6: Verificar el Deployment

### 6.1 Obtener la URL
Una vez completado, verás tu URL en la parte superior:
```
https://esenciapura.onrender.com
```

### 6.2 Probar Endpoints

#### Test de Salud
```bash
curl https://esenciapura.onrender.com/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T..."
}
```

#### Test de Servicios
```bash
curl https://esenciapura.onrender.com/services
```

Respuesta esperada:
```json
{
  "services": []
}
```

### 6.3 Acceder al Sitio Web

Abre en tu navegador:
- **Frontend Público**: `https://esenciapura.onrender.com`
- **Panel Admin**: `https://esenciapura.onrender.com/admin`

---

## 🗄️ Paso 7: Inicializar la Base de Datos

### 7.1 Ejecutar Seed (Datos Iniciales)

Opción A - Desde Render Dashboard:
1. En el dashboard de tu servicio, ve a **"Shell"** (menú lateral)
2. Click en **"Launch Shell"**
3. Ejecuta:
```bash
npm run prisma:seed
```

Opción B - Desde terminal local (si tienes Render CLI):
```bash
render shell esenciapura
npm run prisma:seed
```

Esto creará:
- ✅ Usuario administrador inicial
- ✅ Categorías de servicios
- ✅ Servicios de ejemplo
- ✅ Horarios de trabajo

---

## 👤 Paso 8: Primer Login de Admin

### 8.1 Credenciales Predeterminadas
```
Email: admin@esenciapura.com
Password: admin123
```

⚠️ **IMPORTANTE**: Cambia la contraseña inmediatamente después del primer login.

### 8.2 Cambiar Contraseña

Opción A - Desde Shell:
```bash
npm run update-password admin@esenciapura.com nueva-contraseña-segura
```

Opción B - Crear nuevo admin y eliminar el default:
1. Login con credenciales default
2. Crear nuevo usuario admin desde el panel
3. Logout y login con nuevo usuario
4. Eliminar usuario default

---

## 🔧 Paso 9: Configuración Post-Deployment

### 9.1 Configurar Dominio Personalizado (Opcional)

Si tienes un dominio (ej: `esenciapura.com`):

1. En Render Dashboard → **"Settings"** → **"Custom Domains"**
2. Click **"Add Custom Domain"**
3. Ingresa tu dominio: `esenciapura.com`
4. Render te dará registros DNS para configurar
5. Agrega los registros en tu proveedor de dominios (Namecheap, GoDaddy, etc.)
6. Espera propagación DNS (10-30 minutos)

### 9.2 Verificar Email SMTP

Prueba que los emails funcionen:
1. Ve al sitio público
2. Haz una reserva de prueba con tu email
3. Verifica que recibas:
   - Email de confirmación al cliente
   - Email de notificación al admin

Si no funciona:
- Verifica que `SMTP_PASS` sea la App Password de Gmail (16 dígitos)
- Verifica que la cuenta tenga verificación en 2 pasos activa

---

## 🐛 Troubleshooting

### Error: "Application failed to respond"

**Solución**:
1. Ve a **"Logs"** en Render Dashboard
2. Busca errores en rojo
3. Verifica que todas las variables de entorno estén configuradas

### Error: "P1003: Database does not exist"

**Solución**:
1. Verifica que el disco esté montado en `/data`
2. Verifica que `DATABASE_URL=file:/data/esenciapura.db`
3. Re-deploy el servicio

### Error: "Cannot find module 'dist/server.js'"

**Solución**:
1. Verifica que el Build Command incluya `npm run build`
2. Verifica que `tsconfig.json` tenga `"outDir": "./dist"`
3. Re-deploy

### Sitio muy lento en primer acceso

Es normal con el plan Free de Render:
- Los servicios gratuitos entran en "sleep" después de 15 minutos sin uso
- El primer acceso puede tardar 30-60 segundos en "despertar"
- Los siguientes accesos serán rápidos

**Solución** (si quieres evitarlo):
- Usa un servicio como UptimeRobot (gratis) para hacer ping cada 5 minutos
- O actualiza a plan Starter ($7/mes) sin sleep

---

## 📊 Monitoreo y Mantenimiento

### Logs en Tiempo Real
```
Render Dashboard → Tu Servicio → "Logs"
```

### Ver Base de Datos
Opción A - Shell:
```bash
render shell esenciapura
npx prisma studio
```

Opción B - Local con conexión remota:
```bash
# No disponible con SQLite en disco remoto
# Usar Shell de Render
```

### Backups de Base de Datos

**IMPORTANTE**: Render NO hace backups automáticos del disco en plan Free.

**Solución Manual**:
1. Programa backups semanales desde Shell:
```bash
render shell esenciapura
cp /data/esenciapura.db /tmp/backup-$(date +%Y%m%d).db
# Descargar con SFTP o S3
```

**Solución Recomendada**:
- Considera migrar a PostgreSQL para backups automáticos
- O usa plan Render con backups incluidos

---

## 🔄 Actualizaciones Futuras

### Deploy Automático
Render está configurado para auto-deploy cuando haces push a `main`:

```bash
# Hacer cambios en el código
git add .
git commit -m "Actualización de funcionalidad X"
git push origin main
```

Render detectará el push y desplegará automáticamente.

### Deploy Manual
Si deshabilitaste auto-deploy:
1. Render Dashboard → Tu Servicio
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Costos

### Plan Free (actual)
- ✅ **$0/mes**
- ✅ 750 horas/mes (suficiente para 1 proyecto)
- ✅ 1 GB disco persistente gratis
- ❌ Sleep después de 15 min inactividad
- ❌ Sin backups automáticos

### Plan Starter (recomendado para producción)
- 💵 **$7/mes**
- ✅ Sin sleep (siempre activo)
- ✅ 10 GB disco persistente
- ✅ Backups automáticos diarios
- ✅ SSL gratuito
- ✅ Dominio personalizado

---

## ✅ Checklist Final

Antes de entregar el proyecto, verifica:

- [ ] Sitio accesible en URL de Render
- [ ] Frontend carga correctamente
- [ ] Panel admin funciona (login + CRUD)
- [ ] Sistema de reservas funciona
- [ ] Emails se envían correctamente
- [ ] Base de datos tiene datos iniciales (seed)
- [ ] Contraseña de admin cambiada
- [ ] Variables de entorno configuradas
- [ ] SSL activo (https://)
- [ ] Logs sin errores críticos

---

## 📞 Soporte

Si encuentras problemas:

1. **Render Docs**: https://render.com/docs
2. **Render Community**: https://community.render.com
3. **Render Support**: support@render.com (responden en 24-48h)

---

## 🎓 Para la Presentación del TCU

### Demostración en Vivo
Prepara:
1. **URL del sitio**: Escríbela en tu presentación
2. **Credenciales de admin**: Para mostrar panel
3. **Flow completo**:
   - Cliente hace reserva → Recibe email
   - Admin ve reserva → Confirma
   - Mostrar calendario bloqueado

### Documentación a Entregar
Incluye esta guía en tu informe final con:
- Captura de pantalla del dashboard de Render
- Logs del deployment exitoso
- Evidencia de emails funcionando
- Métricas de uso (disponibles en Render)

---

¡Éxito con tu proyecto! 🚀✨
- [ ] SSL activo (https://)
- [ ] Logs sin errores críticos

---

## 📞 Soporte

Si encuentras problemas:

1. **Render Docs**: https://render.com/docs
2. **Render Community**: https://community.render.com
3. **Render Support**: support@render.com (responden en 24-48h)

---

## 🎓 Para la Presentación del TCU

### Demostración en Vivo
Prepara:
1. **URL del sitio**: Escríbela en tu presentación
2. **Credenciales de admin**: Para mostrar panel
3. **Flow completo**:
   - Cliente hace reserva → Recibe email
   - Admin ve reserva → Confirma
   - Mostrar calendario bloqueado

### Documentación a Entregar
Incluye esta guía en tu informe final con:
- Captura de pantalla del dashboard de Render
- Logs del deployment exitoso
- Evidencia de emails funcionando
- Métricas de uso (disponibles en Render)

---

¡Éxito con tu proyecto! 🚀✨
