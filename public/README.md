# Frontend - Esencia Pura

Landing page para el sistema de reservas del spa Esencia Pura.

## 📁 Estructura

```
public/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos (diseño relajante)
├── js/
│   └── app.js          # Lógica de la aplicación
└── images/             # Imágenes (agregar fotos del spa aquí)
```

## 🎨 Características

- ✅ Diseño relajante con paleta de colores spa (verdes, beige, dorado)
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Tipografía elegante (Cormorant Garamond + Montserrat)
- ✅ Consume API REST del backend
- ✅ Integración con Google Forms para reservas
- ✅ Calendario de slots disponibles
- ✅ Sin dependencias externas (Vanilla JS)

## ⚙️ Configuración

### 1. Actualizar URL del Google Form

Editar `public/js/app.js`:

```javascript
// Línea 7: Reemplazar con tu URL de Google Form
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';

// Líneas 10-14: Actualizar con los entry IDs de tu form
const FORM_FIELDS = {
    service: 'entry.123456',    // Cambiar por tu entry ID
    date: 'entry.789012',
    time: 'entry.345678'
};
```

**¿Cómo obtener los entry IDs?**

1. Abre tu Google Form
2. Click derecho → Inspeccionar elemento
3. Busca cada campo, verás: `name="entry.123456"`
4. Copia esos números

### 2. Agregar Imágenes del Spa

Coloca fotos en `public/images/`:
- `hero.jpg` - Foto principal (recomendado: 1920x1080px)
- `service-1.jpg`, `service-2.jpg`, etc.

Luego actualiza `index.html` y `styles.css` para usarlas.

### 3. Personalizar Contenido

Editar `public/index.html`:
- Sección Hero (líneas 30-40): Cambiar texto de bienvenida
- Sección About (líneas 43-55): Descripción del spa
- Sección Contact (líneas 116-140): Dirección, teléfono, email, horarios

## 🚀 Testing Local

```bash
# Desde la raíz del proyecto
npm run dev

# Abrir navegador en:
http://localhost:3000
```

Deberías ver:
- ✅ Página de inicio con diseño spa
- ✅ Sección de servicios (cargados desde API)
- ✅ Calendario de reservas funcional
- ✅ Información de contacto

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (3 columnas de servicios)
- **Tablet**: 481px - 768px (2 columnas)
- **Mobile**: < 480px (1 columna, navegación oculta)

## 🎨 Paleta de Colores

```css
Verde Salvia:   #7A9D7E  (primario)
Beige Cálido:   #D4C5B0  (secundario)
Dorado Suave:   #B88B58  (acentos)
Verde Oscuro:   #3E4A3D  (texto)
Beige Claro:    #F5F3EF  (fondo)
```

## ✏️ Próximas Mejoras

- [ ] Agregar galería de fotos (carousel)
- [ ] Testimonios de clientes
- [ ] Blog/artículos de bienestar
- [ ] Panel de admin (frontend separado)
- [ ] Integración con redes sociales
- [ ] Chat en vivo (WhatsApp)

## 📝 Notas

- El frontend es **100% estático** (HTML/CSS/JS)
- No requiere build process (se sirve directo)
- Compatible con todos los navegadores modernos
- SEO-friendly (HTML semántico)
