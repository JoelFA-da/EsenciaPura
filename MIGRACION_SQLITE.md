# 🔄 Migración de PostgreSQL a SQLite

## ✅ Migración Completada el 16 de Noviembre, 2025

### 🎯 Objetivo
Eliminar el costo recurrente de la base de datos PostgreSQL ($0/mes → $0/mes permanente)

### 📊 Cambios Realizados

#### 1. Schema de Prisma (`prisma/schema.prisma`)
```diff
datasource db {
-  provider = "postgresql"
+  provider = "sqlite"
   url      = env("DATABASE_URL")
}
```

#### 2. Variables de Entorno (`.env`)
```diff
- DATABASE_URL="postgresql://user:pass@host:5432/db"
+ DATABASE_URL="file:./prisma/data/esenciapura.db"
```

#### 3. Estructura de Archivos
```
prisma/
├── schema.prisma           ✅ Actualizado (sqlite)
├── migrations/
│   └── 20251116193406_init_sqlite/
│       └── migration.sql   ✅ Nueva migración
└── data/
    ├── .gitkeep            ✅ Creado
    └── esenciapura.db      ✅ Base de datos SQLite (ignorado en Git)
```

#### 4. Deployment (`render.yaml`)
```yaml
services:
  - type: web
    disk:
      name: esenciapura-sqlite
      mountPath: /data
      sizeGB: 1                # GRATIS
    envVars:
      - key: DATABASE_URL
        value: file:/data/esenciapura.db
```

**Eliminado**: Sección `databases` completa (ya no necesita PostgreSQL separado)

---

## 💰 Ahorro de Costos

| Recurso | Antes (PostgreSQL) | Ahora (SQLite) | Ahorro |
|---------|-------------------|----------------|--------|
| **Base de Datos** | Gratis (90 días) → $7/mes | $0/mes permanente | $7/mes |
| **Servidor Node.js** | $0/mes (free tier) | $0/mes (free tier) | - |
| **Almacenamiento** | - | Incluido gratis (1GB) | - |
| **TOTAL** | $7/mes después de 90 días | **$0/mes siempre** | **$7/mes** |

### 💵 Ahorro Anual: **$84/año**

---

## ✅ Ventajas de SQLite

1. **✅ $0 de costo permanente** (no hay límite de 90 días)
2. **✅ Sin servidor externo** (todo en un archivo local)
3. **✅ Más simple de hacer backup** (copiar archivo .db)
4. **✅ Más rápido** (sin latencia de red)
5. **✅ Mismo código Prisma** (cambio mínimo)
6. **✅ Portabilidad total** (llevar proyecto a cualquier lugar)

---

## ⚠️ Limitaciones de SQLite (No Aplican para este Proyecto)

| Limitación | Impacto en Esencia Pura | ¿Es Problema? |
|------------|-------------------------|---------------|
| **Concurrencia limitada** | Spa pequeño (~10-50 usuarios/día) | ❌ No |
| **Tamaño máximo: 281TB** | Solo necesitamos ~10MB | ❌ No |
| **Sin múltiples servidores** | Solo un servidor en Render | ❌ No |
| **Escrituras secuenciales** | Reservas no son simultáneas | ❌ No |

**Conclusión**: SQLite es **perfecto** para este proyecto de spa pequeño/mediano.

---

## 🧪 Verificación Post-Migración

### 1. Base de Datos Creada
```bash
$ ls -lh prisma/data/
-rw-r--r-- 1 user user  72K Nov 16 13:34 esenciapura.db
```

### 2. Seed Ejecutado Correctamente
```
✅ 1 usuario admin (admin@esenciapura.com / admin123)
✅ 5 servicios (Masaje Relajante, Deportivo, Aromaterapia, etc.)
✅ 7 horarios de trabajo (Lunes-Sábado)
✅ 2 reservas de ejemplo
✅ 2 elementos multimedia
```

### 3. API Funcional
```bash
$ curl http://localhost:3000/health
{"status":"ok","timestamp":"2025-11-16T..."}

$ curl http://localhost:3000/services
[
  {
    "id": "service-1",
    "name": "Masaje Relajante",
    "price": 50,
    "duration": 60,
    ...
  },
  ...
]
```

### 4. Admin Panel Funcional
- ✅ Login: `http://localhost:3000/admin/login.html`
- ✅ Dashboard: `http://localhost:3000/admin/`
- ✅ Servicios: `http://localhost:3000/admin/services.html`
- ✅ CRUD completo funcionando

### 5. Frontend Público Funcional
- ✅ Landing: `http://localhost:3000/`
- ✅ Sobre Nosotros: `http://localhost:3000/about.html`
- ✅ Detalle Servicio: `http://localhost:3000/service-detail.html?id=xxx`
- ✅ Carga dinámica de servicios desde SQLite

---

## 🚀 Deployment a Render (Nuevo Proceso)

### Antes (PostgreSQL):
1. Crear Web Service
2. ✅ Crear PostgreSQL Database ($0 por 90 días → $7/mes)
3. Conectar DATABASE_URL
4. Deploy

### Ahora (SQLite):
1. Crear Web Service
2. ~~Crear PostgreSQL Database~~ ❌ **YA NO NECESARIO**
3. Agregar Persistent Disk (1GB gratis)
4. Deploy

### Pasos Detallados:

```bash
# 1. Push a GitHub
git add .
git commit -m "Migrar de PostgreSQL a SQLite"
git push origin main

# 2. En Render.com:
Dashboard → New + → Web Service
  - Repo: EsenciaPura
  - Name: esenciapura-api
  - Build: npm ci && npx prisma generate && npm run build
  - Start: npx prisma migrate deploy && node dist/server.js
  - Plan: Free

# 3. Agregar Persistent Disk:
Settings → Disks → Add Disk
  - Name: esenciapura-sqlite
  - Mount Path: /data
  - Size: 1 GB (gratis)

# 4. Environment Variables:
NODE_ENV=production
PORT=3000
DATABASE_URL=file:/data/esenciapura.db
JWT_SECRET=<auto-generado>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
BUSINESS_EMAIL=admin@esenciapura.com

# 5. Deploy automático
✅ Render detecta push y despliega
✅ Crea archivo SQLite en /data/esenciapura.db
✅ Ejecuta migraciones automáticamente
✅ API disponible en https://esenciapura-api.onrender.com
```

---

## 🔐 Backup de Base de Datos

### Con PostgreSQL (antes):
- Necesitabas pg_dump
- Comando complejo
- Requiere conexión a DB

### Con SQLite (ahora):
```bash
# Backup LOCAL:
cp prisma/data/esenciapura.db backups/backup-$(date +%Y%m%d).db

# Backup PRODUCCIÓN (Render):
# Usar Render Dashboard → Disks → Download
# O vía SFTP/rsync
```

**Mucho más simple!** 🎉

---

## 📝 Notas Importantes

### 1. El archivo `.db` NO se sube a Git
```gitignore
# .gitignore
prisma/data/*.db
prisma/data/*.db-journal
prisma/data/*.db-shm
prisma/data/*.db-wal
```

### 2. En producción, el archivo vive en el volumen persistente
```
/data/esenciapura.db  → Persiste entre deploys
```

### 3. Si borras el disco en Render, pierdes los datos
**Solución**: Hacer backups periódicos (descargar `.db` desde Render)

### 4. Migraciones siguen funcionando igual
```bash
# Desarrollo
npx prisma migrate dev --name add_new_field

# Producción (automático en deploy)
npx prisma migrate deploy
```

---

## 🎉 Resultado Final

### ✅ **Sistema 100% Gratis y Permanente**

- ✅ API Backend: Gratis en Render
- ✅ Base de Datos: SQLite (archivo local, gratis)
- ✅ Almacenamiento: 1GB incluido gratis
- ✅ SSL/HTTPS: Gratis
- ✅ Deploy automático: Gratis
- ✅ **Total: $0/mes para siempre**

### 🚀 **Sin Sacrificar Funcionalidad**

- ✅ Mismo código (Prisma)
- ✅ Mismas features
- ✅ Misma performance (o mejor)
- ✅ Más simple de mantener

---

## 📚 Comandos Útiles

```bash
# Ver tamaño de la base de datos
ls -lh prisma/data/esenciapura.db

# Abrir SQLite en modo interactivo
sqlite3 prisma/data/esenciapura.db

# Ver todas las tablas
sqlite3 prisma/data/esenciapura.db ".tables"

# Hacer query SQL directo
sqlite3 prisma/data/esenciapura.db "SELECT * FROM services;"

# Backup
cp prisma/data/esenciapura.db backup.db

# Restaurar backup
cp backup.db prisma/data/esenciapura.db

# Ver Prisma Studio (GUI para ver datos)
npx prisma studio
```

---

## 📞 Soporte

Si hay algún problema con la migración:

1. Verificar que `DATABASE_URL` apunte a `file:./prisma/data/esenciapura.db`
2. Verificar que existe el archivo: `ls prisma/data/esenciapura.db`
3. Regenerar cliente Prisma: `npx prisma generate`
4. Ejecutar migraciones: `npx prisma migrate dev`
5. Ejecutar seed: `npx prisma db seed`

---

**Fecha**: 16 de Noviembre, 2025  
**Estado**: ✅ Migración Completada y Verificada  
**Ahorro**: $84/año ($7/mes × 12 meses)
