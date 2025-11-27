# Bitácora de Trabajo - TCU Esencia Pura
## Sistema de Reservas para Spa y Bienestar

**Estudiante:** Joel Fernández  
**Proyecto:** Sistema de Reservas Esencia Pura  
**Institución:** Universidad de Costa Rica  
**Período:** Octubre - Noviembre 2025  
**Total de Horas:** 150 horas

---

## Detalle Diario de Actividades

### Viernes 17 de Octubre, 2025
**Horario:** 5pm – 9pm (4 hrs)  
**Horas acumuladas:** 4 hrs

**Tema:** Reunión inicial y análisis de requerimientos

**Actividades realizadas:**
- Reunión para creación de requerimientos necesarios de la página
- Explicación detallada de lo que se busca tener en la página
- Explicación de cómo se está manejando actualmente el sistema
- Con base a la información recopilada se crearán los requerimientos funcionales y no funcionales, cada uno con su respectivo ID
- Creación de guía para la futura compra de dominio .cr
- Creación de guía para la futura compra de un correo empresarial

**Evidencias:**
1. Documento de requerimientos funcionales (RF-01 a RF-12)
2. Documento de requerimientos no funcionales (RNF-01 a RNF-05)
3. Guía de compra de dominio .cr
4. Guía de creación de correo empresarial
5. Documentos firmados en carpeta del drive

---

### Sábado 18 de Octubre, 2025
**Horario:** 2pm – 7pm (5 hrs)  
**Horas acumuladas:** 9 hrs

**Tema:** Documentación técnica y selección de tecnologías

**Actividades realizadas:**
- Creación de documento con requerimientos funcionales y no funcionales
- Selección de tecnologías que mejor se adaptan a las necesidades de la empresa
- Criterios de selección: bajo o nulo costo, experiencia previa, aptas para proyectos pequeños
- Documentación de stack tecnológico completo:
  - Runtime & Core: Node.js 20.19.5, TypeScript 5.9.3, Express 4.19.2
  - Database: PostgreSQL 16.x, Prisma ORM 6.18.0
  - Security: bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit
  - Validation: Zod, date-fns
  - Logging: Pino, pino-http, pino-pretty
  - Testing: Jest, Supertest, ts-jest
  - Frontend: HTML5, CSS3, Vanilla JavaScript
  - Infrastructure: Render.com, Git, npm

**Evidencias:**
1. Documento completo de tecnologías con versiones y justificaciones
2. Tabla comparativa de opciones evaluadas
3. Stack tecnológico definido y aprobado

---

### Domingo 19 de Octubre, 2025
**Horario:** 2pm – 6pm (4 hrs)  
**Horas acumuladas:** 13 hrs

**Tema:** Guías de configuración empresarial

**Actividades realizadas:**
- Creación de guía para compra de dominio .cr
- Explicación de cómo incorporar dominio a Render
- Creación de guía para creación de correo empresarial
- Documentos firmados guardados en carpeta del drive (original y escaneado)

**Evidencias:**
1. Guía completa de compra de dominio .cr (PDF en drive)
2. Guía de integración de dominio con Render
3. Guía de creación de correo empresarial
4. Documentos firmados por ambas partes

---

### Lunes 20 de Octubre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 19 hrs

**Tema:** Configuración inicial del proyecto

**Actividades realizadas:**
- Instalación de Node.js 20.19.5 con NVM (30 min)
- Inicialización del proyecto npm (15 min)
- Setup de TypeScript + configuración tsconfig.json (1 hr)
- Instalación de Express + tipos (45 min)
- Estructura de carpetas (src/, modules/, common/) (45 min)
- Configuración de scripts npm (dev, build, start) (45 min)
- Instalación de ESLint + Prettier (45 min)
- Primer "Hello World" con Express + TypeScript (45 min)

**Evidencias:**
1. Compilación exitosa de TypeScript
2. Servidor Express corriendo en puerto 3000
3. Estructura de carpetas creada
4. Scripts npm funcionales

---

### Martes 21 de Octubre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 25 hrs

**Tema:** Base de datos y Prisma

**Actividades realizadas:**
- Instalación de Prisma CLI y @prisma/client (15 min)
- Inicialización de Prisma (prisma init) (15 min)
- Diseño del schema.prisma inicial (User, Service) (2 hrs)
- Configuración de PostgreSQL en Render.com (1 hr)
- Conexión a DB remota y primera migración (1 hr)
- Generación de Prisma Client (15 min)
- Testing de conexión con consulta básica (30 min)
- Troubleshooting de problemas de conexión (45 min)

**Evidencias:**
1. Base de datos conectada y funcional
2. Primera migración aplicada exitosamente
3. Prisma Client generado
4. Consultas de prueba funcionando

---

### Miércoles 22 de Octubre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 31 hrs

**Tema:** Completar schema y seed

**Actividades realizadas:**
- Expansión del schema (Booking, WorkingHours, Media) (1.5 hrs)
- Ajuste de relaciones entre modelos (1 hr)
- Simplificación del modelo Booking (sin campos de cliente) (45 min)
- Creación de migración con cambios (30 min)
- Desarrollo del seed script completo (2 hrs)
- Ejecución y verificación del seed (15 min)

**Evidencias:**
1. Migración aplicada correctamente
2. Todos los modelos relacionados
3. Script de seed funcional
4. Datos de prueba cargados

---

### Jueves 23 de Octubre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 37 hrs

**Tema:** Middleware y servicios comunes

**Actividades realizadas:**
- Instalación de Pino para logging (15 min)
- Creación de logger.ts con configuración (45 min)
- Middleware requestLogger.ts (1 hr)
- Middleware errorHandler.ts (1 hr)
- Instalación de Helmet, CORS, rate-limit (30 min)
- Configuración de seguridad en app.ts (1 hr)
- Setup de Nodemailer (email.service.ts) (1 hr)
- Configuración de variables de entorno (.env) (30 min)

**Evidencias:**
1. Headers de seguridad (Helmet) configurados
2. CORS configurado para frontend
3. Rate limiting activo (rechaza después de 1000 requests temporalmente)
4. Logger Pino funcionando: `src/common/utils/logger.ts`
5. Email service: `src/common/services/email.service.ts`
6. Middleware de errores: `src/common/middleware/errorHandler.ts`
7. Request logger: `src/common/middleware/requestLogger.ts`

---

### Sábado 25 de Octubre, 2025
**Horario:** 1pm – 7pm (6 hrs)  
**Horas acumuladas:** 43 hrs

**Tema:** Módulo de Autenticación - Backend

**Actividades realizadas:**
- Instalación de bcryptjs + jsonwebtoken + tipos (15 min)
- Diseño de auth.service.ts (estructura) (1 hr)
- Implementación de register() con hashing (1.5 hrs)
- Implementación de login() con JWT (1.5 hrs)
- Implementación de verifyToken() (45 min)
- Creación de auth.controller.ts (1 hr)
- Testing inicial (15 min)

**Evidencias:**
1. Endpoint de registro funcional
2. Login funcional con JWT
3. Validación de credenciales incorrectas
4. Tokens JWT generados correctamente

---

### Lunes 27 de Octubre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 49 hrs

**Tema:** Completar Backend de Servicios + Inicio Frontend

**Actividades realizadas:**
- Crear services.controller.ts completo (2 hrs)
  - Implementar listServices(), getService(), createService()
  - Implementar updateService(), deleteService()
  - Agregar validación con Zod schemas
  - Manejo de errores try/catch
- Crear services.routes.ts (30 min)
  - GET / (listar servicios)
  - GET /:id (obtener servicio)
  - POST / (crear servicio)
  - PATCH /:id (actualizar servicio)
  - DELETE /:id (eliminar servicio)
- Testing de endpoints de servicios (1.5 hrs)
  - Probar CRUD completo
  - Verificar validaciones Zod
  - Probar casos de error (404, 400, 500)
- Iniciar estructura frontend (2 hrs)
  - Crear carpeta admin
  - Estructura base HTML5
  - Setup de Google Fonts (Inter)
  - Archivo admin.css con variables CSS

**Evidencias:**
1. Endpoints funcionando correctamente
2. Servicio creado exitosamente
3. Validación de errores implementada
4. Folders y archivos frontend creados

---

### Martes 28 de Octubre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 55 hrs

**Tema:** Página de Login del Admin Panel

**Actividades realizadas:**
- Diseñar login.html (2 hrs)
  - Estructura semántica HTML5
  - Formulario con email y password
  - Mensaje de error dinámico
  - Responsive design
- Estilos de login (admin.css) (2 hrs)
  - Gradient background (purple)
  - Card central con sombra
  - Animaciones de inputs (focus states)
  - Loading spinner CSS
  - Responsive breakpoints
- JavaScript de login (login.js) (2 hrs)
  - Event listener del formulario
  - Fetch a POST /auth/login
  - Guardar token en localStorage
  - Redirección a /admin/index.html
  - Manejo de errores
  - Auto-redirect si ya está logueado

**Evidencias:**
1. Archivos admin creados
2. Login funcional con validación
3. Token almacenado en localStorage
4. Redirección automática funcionando

---

### Miércoles 29 de Octubre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 61 hrs

**Tema:** Dashboard Principal del Admin

**Actividades realizadas:**
- Estructura de index.html (2 hrs)
  - Layout con sidebar + main content
  - Navegación (Dashboard, Servicios, Reservas)
  - Stats cards (3 cards con iconos)
  - Tabla de reservas recientes
  - Tabla de servicios
  - Footer con logout
- CSS del dashboard (1.5 hrs)
  - Sidebar fixed con navegación
  - Grid de stats cards
  - Estilos de tablas (hover states)
  - Badges de estado (success, warning, secondary)
  - Responsive layout (mobile: stacked)
- JavaScript dashboard.js (2.5 hrs)
  - checkAuth() - verificar token
  - loadStats() - cargar estadísticas
  - loadRecentBookings() - últimas 5 reservas
  - loadServices() - listar servicios
  - Logout functionality
  - Formateo de fechas y moneda

**Evidencias:**
1. Dashboard requiere credenciales correctas
2. Métricas mostradas correctamente
3. Tablas de reservas y servicios funcionales
4. Sistema de autenticación integrado

---

### Jueves 30 de Octubre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 67 hrs

**Tema:** Gestión de Servicios - Frontend (Parte 1)

**Actividades realizadas:**
- HTML de services.html (1.5 hrs)
  - Layout con sidebar (igual que dashboard)
  - Header con botón "Nuevo Servicio"
  - Tabla de servicios (6 columnas)
  - Modal para crear/editar servicio
  - Formulario completo en modal
- CSS de servicios y modal (2 hrs)
  - Estilos de tabla completa
  - Modal overlay con backdrop
  - Formulario dentro del modal
  - Botones de acción (Editar, Desactivar)
  - Estados de hover en botones
  - Form validation states
- JavaScript services.js (base) (2.5 hrs)
  - loadServices() - GET /services
  - openModal() / closeModal()
  - Renderizado de tabla con datos
  - Event listeners de botones
  - checkAuth() integration

**Evidencias:**
1. Ventana de visualización de servicios creada
2. Modal funcional para crear/editar
3. Tabla renderiza servicios correctamente

---

### Sábado 1 de Noviembre, 2025
**Horario:** 2pm – 8pm (6 hrs)  
**Horas acumuladas:** 73 hrs

**Tema:** Gestión de Servicios - CRUD (Parte 1)

**Actividades realizadas:**
- Implementar crear servicio (3 hrs)
  - Submit handler del formulario
  - POST /services con datos
  - Validación frontend (campos requeridos)
  - Feedback de éxito/error
  - Recargar lista después de crear
- Implementar toggle activar/desactivar (1 hr)
  - PATCH /services/:id con { isActive: false }
  - Confirmación antes de desactivar
  - Mostrar servicio opaco cuando inactivo
  - Botón cambia a "Activar" para inactivos
- Debugging y refinamiento (2 hrs)
  - Corregir bug duration vs durationMinutes
  - Arreglar event listeners (onclick → addEventListener)
  - Logging extensivo para debugging
  - Manejo de errores mejorado

**Evidencias:**
1. Portal para crear nuevo servicio funcional
2. Formulario con validación completa
3. Toggle activar/desactivar implementado

---

### Lunes 3 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 79 hrs

**Tema:** Gestión de Servicios - CRUD (Parte 2)

**Actividades realizadas:**
- Función de Editar Servicio (2 hrs)
  - Botón "Editar" en cada fila de la tabla
  - Modal se abre con formulario pre-llenado
  - Obtención de datos desde window.servicesData
  - Función editService(serviceIndex) implementada
  - Llamada a API PATCH /services/:id
  - Actualización de tabla sin recargar página
  - Mensajes de éxito/error
- Función de Toggle Activar/Desactivar (2 hrs)
  - Botón toggle tipo switch en cada fila
  - Función toggleServiceStatus(serviceId, newStatus)
  - Llamada a API PATCH /services/:id con isActive
  - Actualización visual inmediata (opacidad 0.5 para inactivos)
  - Recarga de tabla para reflejar cambios
- Función de Eliminar Servicio (2 hrs)
  - Botón "Eliminar" solo visible en servicios inactivos
  - Confirmación con confirm() antes de eliminar
  - Función deleteService(serviceId)
  - Llamada a API DELETE /services/:id
  - Manejo de error si tiene reservas asociadas (código P2003)
  - Mensaje específico: "No se puede eliminar porque tiene reservas"
  - Recarga de tabla tras eliminación exitosa

**Evidencias:**
1. Función de editar completa y funcional
2. Toggle de activar/desactivar implementado
3. Eliminación con validación de reservas asociadas

---

### Martes 4 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 85 hrs

**Tema:** Página Principal Frontend (Parte 1)

**Actividades realizadas:**
- Estructura HTML de Landing Page (2 hrs)
  - Navbar sticky con logo "Esencia Pura"
  - Hero section con gradiente y CTA "Reservar Ahora"
  - Sección "Bienvenido" con descripción del spa
  - Grid de servicios (estructura base)
  - Sección de contacto con información
  - Footer con enlaces rápidos y redes sociales
- Sistema de Diseño - CSS Base (3 hrs)
  - Definición de variables CSS (colores, fuentes, espaciado)
  - Paleta spa: Verde salvia (#7A9D7E), Beige (#D4C5B0), Dorado (#B88B58)
  - Tipografía: Cormorant Garamond (headings) + Montserrat (body)
  - Estilos de navbar sticky
  - Hero section con overlay y gradiente
  - Estilos de botones (primary, secondary)
  - Grid system para servicios
  - Estilos de footer
- JavaScript - Carga de Servicios (1 hr)
  - Función fetchServices() - GET /services
  - Función renderServices(services) - crear cards dinámicamente
  - Detección de iconos según tipo de servicio
  - Formateo de precio en colones
  - Evento DOMContentLoaded para inicialización

**Evidencias:**
1. Landing page con diseño profesional
2. Sistema de colores spa implementado
3. Carga dinámica de servicios funcional

---

### Miércoles 5 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 91 hrs

**Tema:** Página "Sobre Nosotros"

**Actividades realizadas:**
- Estructura y Header de Página (1 hr)
  - Page header con gradiente y título
  - Navbar consistente con página principal
  - Breadcrumb (Inicio / Sobre Nosotros)
  - Footer idéntico a landing page
- Sección "Nuestra Historia" (1.5 hrs)
  - Grid de 2 columnas: texto + imagen
  - Texto sobre origen y filosofía del spa
  - Placeholder de imagen con gradiente y emoji
  - Atributo onerror para mostrar placeholder si imagen falla
- Sección "Nuestros Valores" (1.5 hrs)
  - Grid de 4 tarjetas (auto-fit, responsive)
  - 4 valores: Naturalidad, Profesionalismo, Calidad, Tranquilidad
  - Iconos emoji grandes
  - Hover effect con elevación
  - Descripción de cada valor
- Sección "Misión y Visión" (1 hr)
  - Grid de 2 tarjetas con gradiente verde
  - Misión: Texto real sobre bienestar holístico
  - Visión: Texto real sobre referente en la comunidad
  - Iconos emoji
  - Fondo con degradado
- Sección "Nuestro Equipo" (1 hr)
  - Grid de 3 terapeutas
  - Fotos circulares (150px) con placeholder
  - Nombres y roles de terapeutas
  - Biografías breves
  - Hover effect en tarjetas

**Evidencias:**
1. Página "Sobre Nosotros" completa
2. Todas las secciones con contenido real
3. Diseño coherente con landing page
4. Responsive design implementado

---

### Jueves 6 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 97 hrs

**Tema:** Página de Detalle de Servicio

**Actividades realizadas:**
- Template HTML y Estructura (1.5 hrs)
  - Breadcrumb dinámico (Inicio / Servicios / [Nombre])
  - Header de servicio: imagen grande + info
  - Meta información: duración con SVG clock icon + precio destacado
  - Descripción completa del servicio
  - Grid de 3 tarjetas de detalle
  - CTA section con 2 botones
  - Estados de UI: loading, error, content
- JavaScript - Carga Dinámica (2 hrs)
  - Función loadServiceDetail() - parseo de URL param ?id=xxx
  - Función displayService(service) - renderizado de datos
  - Llamada a GET /services/:id
  - Actualización de breadcrumb dinámico
  - Actualización de title de página
  - Manejo de imagen o placeholder
  - Estados: loading → success/error
- Sistema de Contenido Específico por Servicio (2 hrs)
  - Objeto serviceContent con 6 tipos de servicios
  - Función getServiceType(serviceName) - detección automática
  - Contenido personalizado para cada tipo:
    - Masaje: Beneficios de relajación muscular
    - Deportivo: Beneficios de recuperación atlética
    - Aromaterapia: Beneficios de aceites esenciales
    - Reflexología: Beneficios de puntos reflejos
    - Facial: Beneficios de cuidado de piel
    - Default: Beneficios generales
  - Arrays de beneficios y expectativas específicas
  - Renderizado dinámico de listas
- Botón "Ver más" en Landing (0.5 hrs)
  - Modificación de renderServices() en app.js
  - Agregado enlace "Ver más detalles →" en cada card
  - URL: /service-detail.html?id=${service.id}
  - Estilos de botón link

**Evidencias:**
1. Página de detalle de servicio funcional
2. Contenido dinámico según tipo de servicio
3. Breadcrumbs y navegación correcta
4. Integración con landing page

---

### Viernes 7 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 103 hrs

**Tema:** Módulo de Categorías - Backend y Frontend

**Actividades realizadas:**
- Backend - Estructura del módulo categories (1 hr)
  - categories.controller.ts con CRUD completo
  - categories.routes.ts con endpoints
  - categories.service.ts con lógica de negocio
- Backend - Implementación de endpoints (2 hrs)
  - GET /categories → Lista todas las categorías
  - GET /categories/:id → Detalle con servicios anidados
  - POST /categories → Crear categoría (admin)
  - PATCH /categories/:id → Actualizar (admin)
  - DELETE /categories/:id → Eliminar (admin)
- Migración de base de datos (30 min)
  - Actualización de schema.prisma para categorías
  - Creación de migración add_categories
  - Relación entre Service y Category
- Frontend Admin - Página de categorías (1.5 hrs)
  - admin/categories.html con tabla y modal
  - Formulario para crear/editar categorías
  - Tabla con estadísticas de servicios por categoría
- Frontend Admin - JavaScript (1 hr)
  - admin/js/categories.js con CRUD
  - Fetch de categorías con estadísticas
  - Modal para crear/editar
  - Validación de formularios
  - Manejo de errores

**Evidencias:**
1. Módulo de categorías completo en backend
2. Migración de DB aplicada exitosamente
3. Admin panel de categorías funcional
4. CRUD completo de categorías operativo

---

### Lunes 10 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 109 hrs

**Tema:** Módulo de Reservas - Backend (Parte 1)

**Actividades realizadas:**
- Estructura del módulo bookings (1 hr)
  - bookings.controller.ts base
  - bookings.routes.ts con rutas
  - bookings.service.ts con lógica
- Implementación de lógica de slots (2 hrs)
  - Función getAvailableSlots() que:
    - Consulta WorkingHours por día de semana
    - Genera slots de 1 hora cada uno
    - Verifica conflictos con bookings existentes
    - Retorna solo slots disponibles
  - Validación de horarios y disponibilidad
- Endpoint de slots disponibles (1 hr)
  - GET /bookings/available-slots?date=YYYY-MM-DD&serviceId=X
  - Parseo y validación de query params
  - Integración con getAvailableSlots()
  - Formato de respuesta JSON
- Testing de disponibilidad (2 hrs)
  - Pruebas con diferentes fechas
  - Verificación de conflictos de horario
  - Pruebas de validación
  - Casos edge (fin de semana, feriados)

**Evidencias:**
1. Módulo de bookings estructurado
2. Función de slots disponibles funcional
3. Endpoint GET /available-slots operativo
4. Tests de disponibilidad pasando

---

### Martes 11 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 115 hrs

**Tema:** Módulo de Reservas - Backend (Parte 2)

**Actividades realizadas:**
- Implementación de POST /bookings (1.5 hrs)
  - Endpoint para crear reserva (solo admin)
  - Validación de datos con Zod
  - Verificación de disponibilidad antes de crear
  - Estado inicial: "pending"
  - Campos: serviceId, date, startTime, endTime, status, notes
- Implementación de PATCH /bookings/:id/confirm (1.5 hrs)
  - Endpoint para confirmar reserva
  - Cambio de estado a "confirmed"
  - Marca slot como ocupado
  - Validación de que existe la reserva
- Implementación de PATCH /bookings/:id/cancel (1 hr)
  - Endpoint para cancelar reserva
  - Cambio de estado a "cancelled"
  - Libera slot para nueva reserva
- Implementación de GET /bookings (1 hr)
  - Listar todas las reservas (admin)
  - Filtros por status (pending, confirmed, cancelled)
  - Filtro por fecha
  - Incluye información del servicio
- Testing de flujo completo (1 hr)
  - Crear reserva → Confirmar → Verificar slot ocupado
  - Crear reserva → Cancelar → Verificar slot libre
  - Validación de conflictos

**Evidencias:**
1. Endpoints de gestión de reservas completos
2. Estados de reserva funcionando (pending, confirmed, cancelled)
3. Validación de conflictos implementada
4. Flujo completo de reserva testeado

---

### Miércoles 12 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 121 hrs

**Tema:** Vista de Calendario y Migración de Campos Adicionales

**Actividades realizadas:**
- Implementación de GET /bookings/calendar (2 hrs)
  - Endpoint para vista de calendario admin
  - Función getCalendarView() que retorna:
    - Fecha solicitada
    - Array de slots con información:
      - time (hora del slot)
      - isAvailable (boolean)
      - booking (datos si está ocupado)
  - Diferenciación de vistas:
    - Usuario: solo slots libres (GET /available-slots)
    - Admin: todos los slots con estado
- Migración de base de datos (1.5 hrs)
  - Análisis de necesidad de campos benefits/recommendations
  - Actualización de schema.prisma:
    - Service.benefits (String?)
    - Service.recommendations (String?)
  - Creación de migración add_service_details
  - Aplicación de migración a DB
- Actualización de controllers (1.5 hrs)
  - Actualización de services.controller.ts
  - createServiceSchema con benefits/recommendations
  - updateServiceSchema con nuevos campos
  - Validación Zod para campos opcionales
  - Transform de empty string a undefined
- Testing de nuevos campos (1 hr)
  - Crear servicio con benefits/recommendations
  - Actualizar servicio existente
  - Verificar formato (newline-separated strings)

**Evidencias:**
1. Endpoint /bookings/calendar funcional
2. Vista dual (usuario/admin) implementada
3. Migración add_service_details aplicada
4. Controllers actualizados con nuevos campos
5. Formato de benefits/recommendations: strings separados por \n

---

### Jueves 13 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 127 hrs

**Tema:** Actualización de Admin Panel - Servicios con Nuevos Campos

**Actividades realizadas:**
- Actualización de admin/services.html (2 hrs)
  - Agregar textareas para benefits
  - Agregar textareas para recommendations
  - Placeholders explicativos: "Un beneficio por línea"
  - Ajuste de layout del formulario
  - Estilos para textareas (auto-resize)
- Actualización de admin/js/services.js (2 hrs)
  - Modificar createService() para incluir nuevos campos
  - Modificar editService() para pre-llenar textareas
  - Parsing de benefits/recommendations (split por \n)
  - Validación de campos opcionales
  - Trim de whitespace
- Actualización de service-detail.html (1 hr)
  - Nueva sección de "Beneficios"
  - Nueva sección de "Recomendaciones"
  - Listas con checkmarks (✓)
  - Gradientes y estilos elegantes
- Actualización de service-detail.js (1 hr)
  - Renderizado de benefits como lista HTML
  - Renderizado de recommendations como lista
  - Manejo de casos donde no hay datos
  - Split de strings por \n para crear <li>

**Evidencias:**
1. Formulario admin actualizado con textareas
2. JavaScript guarda y carga nuevos campos
3. service-detail.html muestra benefits/recommendations
4. Listas renderizadas con estilos

---

### Viernes 14 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 133 hrs

**Tema:** Módulo de Autenticación - Middleware JWT

**Actividades realizadas:**
- Creación de middleware authenticate.ts (2 hrs)
  - Extracción de Bearer token del header Authorization
  - Verificación de token con JWT_SECRET
  - Decodificación de payload (userId, email)
  - Agregado de req.userId y req.email
  - Manejo de errores:
    - 401: Token no proporcionado
    - 401: Token inválido
    - 401: Token expirado
- Aplicación de middleware a rutas admin (2 hrs)
  - Categories: POST, PATCH, DELETE (3 rutas)
  - Services: POST, PATCH, DELETE, GET /admin/all (4 rutas)
  - Bookings: POST, PATCH confirm, PATCH cancel, GET all (4 rutas)
  - Total: 16 rutas protegidas
- Actualización de admin JS files (1.5 hrs)
  - Función getAuthHeaders() en todos los archivos:
    - dashboard.js
    - categories.js
    - services.js
    - bookings.js
  - Agregar headers de autenticación a todos los fetch
  - Manejo de respuesta 401 → redirect a login
  - Verificación de token en localStorage
- Testing de autenticación (30 min)
  - Intentar acceder sin token → 401
  - Login → obtener token → acceso exitoso
  - Token expirado → 401 → redirect
  - Logout → remover token → sin acceso

**Evidencias:**
1. Middleware authenticate.ts creado
2. 16 rutas admin protegidas
3. Todos los admin JS envían Bearer token
4. Sistema de autenticación completo y funcional
5. Documentación en SECURITY.md

---

### Lunes 17 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 139 hrs

**Tema:** Admin Panel - Gestión de Reservas

**Actividades realizadas:**
- Creación de admin/bookings.html (1.5 hrs)
  - Layout con sidebar
  - Header con botón "Nueva Reserva"
  - Filtros por estado y fecha
  - Tabla de reservas con columnas:
    - Servicio
    - Fecha y hora
    - Estado (badge coloreado)
    - Acciones
- Estilos de bookings (1 hr)
  - Badges de estado con colores:
    - pending: amarillo
    - confirmed: verde
    - cancelled: rojo
  - Tabla responsive
  - Botones de acción
- JavaScript bookings.js (2.5 hrs)
  - loadBookings() con filtros
  - Función createBooking() - modal con:
    - Select de servicio
    - Date picker
    - Select de hora (slots disponibles)
    - Campo de notas
  - Función confirmBooking(id)
  - Función cancelBooking(id)
  - Renderizado de tabla
  - Filtros en tiempo real
- Testing de gestión (1 hr)
  - Crear reserva desde admin
  - Confirmar reserva
  - Cancelar reserva
  - Filtrar por estado y fecha

**Evidencias:**
1. admin/bookings.html completo
2. admin/js/bookings.js funcional
3. CRUD de reservas desde admin operativo
4. Filtros y badges funcionando
5. Headers de autenticación correctos

---

### Martes 18 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 145 hrs

**Tema:** Página de Reserva Pública e Integración

**Actividades realizadas:**
- Creación de reserva.html (1.5 hrs)
  - Navbar y footer consistentes
  - Select de servicio (carga desde API)
  - Date picker para seleccionar fecha
  - Botón "Ver disponibilidad"
  - Grid de slots disponibles
  - Link a Google Form
- Estilos de página de reserva (1 hr)
  - Cards de slots con gradiente
  - Hover effects
  - Date picker estilizado
  - Responsive grid
- JavaScript reserva.js (2 hrs)
  - loadServices() - fetch de servicios
  - loadAvailableSlots(date, serviceId)
  - Renderizado de slots como cards
  - Click en slot → abre Google Form con params
  - URL: ?serviceId=X&time=HH:MM
- Integración Frontend-Backend completa (1 hr)
  - Pruebas de navegación completa:
    - Home → Categoría → Servicios → Detalle → Reserva
  - Verificación de categoryId en URL params
  - Breadcrumbs funcionales
  - Ajustes de paso de parámetros
- Testing de flujo usuario (30 min)
  - Flujo completo como cliente
  - Selección de servicio y fecha
  - Ver slots disponibles
  - Click en slot → Google Form

**Evidencias:**
1. reserva.html funcional
2. Carga dinámica de servicios y slots
3. Integración con Google Form
4. Navegación completa operativa
5. Flujo usuario testeado

---

### Miércoles 19 de Noviembre, 2025
**Horario:** 4pm – 10pm (6 hrs)  
**Horas acumuladas:** 151 hrs

**Tema:** Ajustes Finales de UI/UX y Migración a SQLite

**Actividades realizadas:**
- Resolución de problema de centrado de títulos (2 hrs)
  - Análisis de conflicto CSS (display: grid vs text-align: center)
  - Identificación de CSS global con grid-template-columns
  - Solución implementada:
    - display: block !important en .service-header
    - grid-template-columns: unset !important
  - Pruebas en múltiples navegadores
  - Hard refresh para limpiar caché
- Ajuste de orden de botones (30 min)
  - Cambio en service-detail.js
  - Orden nuevo: "Volver a servicios" primero, "Reservar ahora" segundo
  - Mejor flujo de navegación
- Migración de PostgreSQL a SQLite (2.5 hrs)
  - Creación de migración para SQLite
  - Actualización de provider en schema.prisma
  - Aplicación de todas las migraciones
  - Verificación de datos migrados
  - Testing de funcionalidad
  - Documentación en MIGRACION_SQLITE.md
- Pruebas responsive (1 hr)
  - Testing en móvil, tablet, desktop
  - Ajustes de media queries
  - Verificación de navegación touch
  - Correcciones menores de padding/margin

**Evidencias:**
1. Título de service-detail centrado correctamente
2. Botones en orden correcto
3. Base de datos migrada a SQLite exitosamente
4. Responsive design verificado en múltiples dispositivos
5. Documentación de migración completada

---

## Resumen Final

**Total de días trabajados:** 24 días  
**Total de horas:** 151 horas  
**Distribución:**
- Octubre: 10 días (59 horas)
- Noviembre: 14 días (92 horas)

**Estado del proyecto:** ✅ COMPLETADO  
**Fecha de finalización:** 19 de Noviembre, 2025

**Distribución por área:**
- Backend (API + BD + Auth): 70 horas (46%)
- Frontend (Público + Admin): 56 horas (37%)
- Seguridad y Middleware: 15 horas (10%)
- Documentación y Testing: 10 horas (7%)

---

**Firma del estudiante:**  
Joel Fernández

**Fecha:** 19 de Noviembre, 2025

**Actividades realizadas:**
- Instalación de Pino para logging (15 min)
- Creación de logger.ts con configuración (45 min)
- Middleware requestLogger.ts (1 hr)
- Middleware errorHandler.ts (1 hr)
- Instalación de Helmet, CORS, rate-limit (30 min)
- Configuración de seguridad en app.ts (1 hr)
- Setup de Nodemailer (email.service.ts) (1 hr)
- Configuración de variables de entorno (.env) (30 min)

**Evidencias:**
1. Headers de seguridad (Helmet) configurados en `src/app.ts`
2. CORS configurado para permitir requests del frontend
3. Rate limiting activo (después de límite de requests, rechaza temporalmente)
4. Logger Pino funcionando: `src/common/utils/logger.ts`
5. Email service configurado: `src/common/services/email.service.ts`
6. Middleware de errores: `src/common/middleware/errorHandler.ts`
7. Request logger: `src/common/middleware/requestLogger.ts`

---
