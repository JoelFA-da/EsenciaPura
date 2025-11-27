# 📧 CONFIGURAR EMAIL SMTP PARA ESENCIA PURA

## ⚠️ PROBLEMA ACTUAL
El archivo `.env` tiene placeholders en las credenciales SMTP:
```env
SMTP_USER=tu-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
```

**Sin credenciales reales, los emails NO se enviarán.**

---

## ✅ SOLUCIÓN: Configurar Gmail App Password

### Paso 1: Activar Verificación en 2 Pasos
1. Ve a **Google Account**: https://myaccount.google.com/security
2. En "Cómo inicias sesión en Google", haz clic en **Verificación en dos pasos**
3. Sigue los pasos para activarla (necesitas tu teléfono)

### Paso 2: Generar App Password
1. Ve a **App Passwords**: https://myaccount.google.com/apppasswords
2. En "Seleccionar app", elige **Correo**
3. En "Seleccionar dispositivo", elige **Otro (nombre personalizado)**
4. Escribe: `Esencia Pura Booking System`
5. Haz clic en **Generar**
6. **COPIA la contraseña de 16 dígitos** (aparece con espacios: `xxxx xxxx xxxx xxxx`)

### Paso 3: Actualizar `.env`
Abre el archivo `.env` y reemplaza:

```env
# Antes:
SMTP_USER=tu-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
BUSINESS_EMAIL=admin@esenciapura.com

# Después (con TUS datos reales):
SMTP_USER=Esenciapuraluz.09@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # La contraseña de app que copiaste
BUSINESS_EMAIL=Esenciapuraluz.09@gmail.com
```

⚠️ **IMPORTANTE**: 
- Usa el email `Esenciapuraluz.09@gmail.com` que ya tenías configurado
- La contraseña NO es la contraseña normal de Gmail
- Es la "App Password" de 16 dígitos generada en paso 2

### Paso 4: Reiniciar el servidor
```bash
# Detén el servidor (Ctrl + C en la terminal)
# Vuelve a iniciar:
npm run dev
```

---

## 🧪 PROBAR QUE FUNCIONA

### Test 1: Crear reserva desde admin panel
1. Ve a http://localhost:3000/admin/bookings.html
2. Haz clic en **+ Nueva Reserva**
3. Llena el formulario:
   - Servicio: Masaje Relajante
   - Nombre: Test Cliente
   - **Email: tu-email-personal@gmail.com** (para recibir el email)
   - Teléfono: 8888-8888
   - Fecha: Mañana
   - Hora: Cualquier slot disponible
4. Haz clic en **Crear Reserva**

### Test 2: Verificar emails enviados
✅ **Email 1** (al negocio): `Esenciapuraluz.09@gmail.com` debe recibir:
   - Asunto: `🔔 Nueva Solicitud de Reserva - Masaje Relajante`
   - Contiene: Datos del cliente y servicio

✅ **Email 2** (al cliente): Tu email personal debe recibir:
   - Asunto: `✨ Solicitud de Reserva Recibida - Masaje Relajante`
   - Contiene: Instrucciones de pago SINPE (₡5,000)

### Test 3: Verificar botones de admin
1. En la tabla de reservas, encuentra la que acabas de crear
2. Debe mostrar estado: **Pendiente** (amarillo)
3. Debe tener 2 botones: **✅ Confirmar** y **❌ Cancelar**
4. Haz clic en **✅ Confirmar**
5. El estado debe cambiar a **Confirmada** (verde)
6. Ahora debe mostrar: **❌ Cancelar** y **✔️ Completar**

---

## 📊 FLUJO COMPLETO DE RESERVA

```
┌─────────────────────────────────────────────────────────┐
│ 1. CLIENTE llena formulario web (público)              │
│    - Elige servicio, fecha, hora                       │
│    - Ingresa nombre, email, teléfono                   │
│    - Hace clic en "Reservar"                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. SISTEMA crea reserva en estado PENDING              │
│    - Guarda en base de datos                           │
│    - Envía 2 emails:                                   │
│      a) Al negocio (info del cliente)                  │
│      b) Al cliente (instrucciones de pago)             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. ADMIN revisa email y panel admin                    │
│    - Ve reserva PENDING en lista                       │
│    - Contacta cliente por WhatsApp                     │
│    - Cliente envía comprobante SINPE (₡5,000)          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. ADMIN confirma reserva                              │
│    - Hace clic en botón "✅ Confirmar"                 │
│    - Estado cambia a CONFIRMED                         │
│    - Cliente ya tiene su cita confirmada               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. DÍA DE LA CITA                                      │
│    - Cliente llega al spa                              │
│    - Admin marca "✔️ Completar"                        │
│    - Estado cambia a COMPLETED                         │
│    - Cliente paga saldo restante (efectivo/SINPE)      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "Invalid login: 535-5.7.8"
**Causa**: Contraseña incorrecta o no es App Password
**Solución**: 
1. Verifica que usaste App Password (no la contraseña normal)
2. Asegúrate de copiar los 16 dígitos completos
3. Puedes dejar espacios: `xxxx xxxx xxxx xxxx`

### ❌ Error: "Less secure app access"
**Causa**: Gmail bloqueó el acceso
**Solución**: Ya NO necesitas esto si usas App Password (son más seguras)

### ❌ No llegan los emails
**Causa**: Credenciales incorrectas o servidor no reiniciado
**Solución**:
1. Verifica `.env` tiene las credenciales correctas
2. Reinicia el servidor: `npm run dev`
3. Revisa la carpeta SPAM en Gmail

### ❌ Botones de admin no funcionan
**Causa**: Ya arreglado! Era un bug en `bookings.js`
**Solución**: El código ya fue corregido (usa `window.bookingsData[index]`)

---

## 📝 RESULTADO ESPERADO

Después de configurar:
- ✅ Panel admin funcional
- ✅ Botones Confirmar/Cancelar/Completar funcionan
- ✅ Se envían 2 emails por cada reserva nueva
- ✅ Email al negocio con datos del cliente
- ✅ Email al cliente con instrucciones de pago
- ✅ Templates bonitos con colores de Esencia Pura (lavanda)
- ✅ Información de SINPE incluida (₡5,000 anticipo)

---

## 🚀 SIGUIENTE PASO: DEPLOYMENT EN RENDER

Una vez que todo funcione local, configurar en Render Dashboard:
1. Variables de entorno (SMTP_USER, SMTP_PASS, etc.)
2. Base de datos PostgreSQL (Supabase ya configurado)
3. Verificar que los emails se envían en producción

**NOTA**: Las App Passwords funcionan IGUAL en local y producción.
