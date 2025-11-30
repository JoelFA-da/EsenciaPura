// ==========================================
// CONFIGURACIÓN
// ==========================================

// API Base URL - Cambiar según entorno
const API_URL = window.location.origin; // Usa el mismo dominio (funciona local y en producción)

// URL del Google Form (ACTUALIZAR CON TU FORM)
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';

// Campos del Google Form para pre-llenar (entry IDs - obtener de la URL del form)
const FORM_FIELDS = {
    service: 'entry.123456',    // ID del campo "Servicio"
    date: 'entry.789012',       // ID del campo "Fecha"
    time: 'entry.345678'        // ID del campo "Horario"
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
let categoriesData = [];
let servicesData = [];
let selectedService = null;
let selectedDate = null;

// ==========================================
// DOM ELEMENTS
// ==========================================
const categoriesGrid = document.getElementById('services-grid'); // Reutilizamos el mismo ID
const serviceSelect = document.getElementById('service-select');
const dateSelect = document.getElementById('date-select');
const slotsContainer = document.getElementById('slots-container');
const availableSlots = document.getElementById('available-slots');
const noSlotsMessage = document.getElementById('no-slots-message');

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Formatear precio en colones
function formatPrice(price) {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0
    }).format(price);
}

// Formatear fecha en español
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Obtener icono por categoría
function getCategoryIcon(categoryName) {
    const name = categoryName.toLowerCase();
    if (name.includes('masaje')) return '💆';
    if (name.includes('facial')) return '✨';
    if (name.includes('corporal')) return '🧖';
    if (name.includes('especial')) return '🌟';
    return '🌿';
}

// ==========================================
// API CALLS
// ==========================================

// Obtener todas las categorías
async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Error al cargar categorías');
        
        const data = await response.json();
        categoriesData = Array.isArray(data) ? data : [];
        return categoriesData;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Obtener todos los servicios
async function fetchServices() {
    try {
        const response = await fetch(`${API_URL}/services`);
        if (!response.ok) throw new Error('Error al cargar servicios');
        
        const data = await response.json();
        servicesData = Array.isArray(data) ? data : [];
        return servicesData;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

// Obtener slots disponibles
async function fetchAvailableSlots(date, serviceId) {
    try {
        const response = await fetch(
            `${API_URL}/bookings/available-slots?date=${date}&serviceId=${serviceId}`
        );
        if (!response.ok) throw new Error('Error al cargar horarios');
        
        const data = await response.json();
        return data.availableSlots || [];
    } catch (error) {
        console.error('Error fetching slots:', error);
        return [];
    }
}

// ==========================================
// RENDER FUNCTIONS
// ==========================================

// Renderizar tarjetas de categorías
function renderCategories(categories) {
    if (!categories || categories.length === 0) {
        categoriesGrid.innerHTML = '<p class="loading">No hay categorías disponibles en este momento.</p>';
        return;
    }

    categoriesGrid.innerHTML = categories.map(category => `
        <div class="service-card">
            <div class="service-image">
                ${category.imageUrl 
                    ? `<img src="${category.imageUrl}" alt="${category.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` 
                    : getCategoryIcon(category.name)
                }
            </div>
            <h3>${category.name}</h3>
            <p>${category.description || 'Descubre nuestros tratamientos'}</p>
            <a href="/services-list.html?categoryId=${category.id}" class="btn btn-link">
                Ver servicios →
            </a>
        </div>
    `).join('');
}

// Renderizar tarjetas de servicios (se usa en services-list.html)
function renderServices(services) {
    if (!services || services.length === 0) {
        categoriesGrid.innerHTML = '<p class="loading">No hay servicios disponibles en esta categoría.</p>';
        return;
    }

    categoriesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-image">
                ${service.imageUrl 
                    ? `<img src="${service.imageUrl}" alt="${service.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` 
                    : getCategoryIcon(service.category?.name || '')
                }
            </div>
            <h3>${service.name}</h3>
            <p>${service.description || 'Tratamiento de relajación y bienestar'}</p>
            <div class="service-price">${formatPrice(service.price)}</div>
            <div class="service-duration">⏱️ ${service.duration} minutos</div>
            <a href="/service-detail.html?id=${service.id}" class="btn btn-link">
                Ver más detalles →
            </a>
        </div>
    `).join('');
}

// Renderizar opciones de servicios en el select
function renderServiceOptions(services) {
    if (!services || services.length === 0) {
        serviceSelect.innerHTML = '<option value="">No hay servicios disponibles</option>';
        return;
    }

    serviceSelect.innerHTML = `
        <option value="">Selecciona un servicio</option>
        ${services.map(service => `
            <option value="${service.id}">
                ${service.name} - ${formatPrice(service.price)} (${service.duration} min)
            </option>
        `).join('')}
    `;
}

// Renderizar slots disponibles
function renderSlots(slots) {
    if (!slots || slots.length === 0) {
        slotsContainer.style.display = 'none';
        noSlotsMessage.style.display = 'block';
        noSlotsMessage.textContent = 'No hay horarios disponibles para esta fecha. Por favor selecciona otra fecha.';
        return;
    }

    slotsContainer.style.display = 'block';
    noSlotsMessage.style.display = 'none';

    availableSlots.innerHTML = slots.map(time => `
        <button class="slot-button" data-time="${time}" onclick="selectSlot('${time}')">
            ${time}
        </button>
    `).join('');
}

// ==========================================
// EVENT HANDLERS
// ==========================================

// Seleccionar servicio
function onServiceChange() {
    selectedService = serviceSelect.value;
    
    if (selectedService && selectedDate) {
        loadAvailableSlots();
    } else {
        slotsContainer.style.display = 'none';
        noSlotsMessage.style.display = 'block';
        noSlotsMessage.textContent = 'Selecciona un servicio y una fecha para ver los horarios disponibles.';
    }
}

// Seleccionar fecha
function onDateChange() {
    selectedDate = dateSelect.value;
    
    if (selectedService && selectedDate) {
        loadAvailableSlots();
    } else {
        slotsContainer.style.display = 'none';
        noSlotsMessage.style.display = 'block';
        noSlotsMessage.textContent = 'Selecciona un servicio y una fecha para ver los horarios disponibles.';
    }
}

// Seleccionar slot y abrir Google Form
function selectSlot(time) {
    if (!selectedService || !selectedDate) {
        alert('Por favor selecciona un servicio y una fecha primero');
        return;
    }

    const service = servicesData.find(s => s.id === selectedService);
    
    // Construir URL de Google Form con parámetros pre-llenados
    const formUrl = new URL(GOOGLE_FORM_URL);
    formUrl.searchParams.set('usp', 'pp_url');
    formUrl.searchParams.set(FORM_FIELDS.service, service.name);
    formUrl.searchParams.set(FORM_FIELDS.date, selectedDate);
    formUrl.searchParams.set(FORM_FIELDS.time, time);

    // Mostrar confirmación
    const confirmMessage = `
        Vas a reservar:
        
        🌿 Servicio: ${service.name}
        📅 Fecha: ${formatDate(selectedDate)}
        🕐 Hora: ${time}
        
        Se abrirá un formulario para completar tus datos.
        ¿Deseas continuar?
    `;

    if (confirm(confirmMessage)) {
        // Abrir Google Form en nueva pestaña
        window.open(formUrl.toString(), '_blank');
        
        // Mostrar mensaje de éxito
        setTimeout(() => {
            alert('✅ Por favor completa el formulario que se abrió en otra pestaña. Recibirás una confirmación por email una vez que tu reserva sea aprobada.');
        }, 500);
    }
}

// ==========================================
// LOAD DATA
// ==========================================

// Cargar slots disponibles
async function loadAvailableSlots() {
    if (!selectedService || !selectedDate) return;

    availableSlots.innerHTML = '<div class="loading">Cargando horarios disponibles...</div>';
    slotsContainer.style.display = 'block';
    noSlotsMessage.style.display = 'none';

    const slots = await fetchAvailableSlots(selectedDate, selectedService);
    renderSlots(slots);
}

// Cargar servicios
async function loadServices() {
    const services = await fetchServices();
    renderServiceOptions(services);
}

// Cargar categorías (index.html)
async function loadCategories() {
    const categories = await fetchCategories();
    renderCategories(categories);
}

// ==========================================
// INITIALIZATION
// ==========================================

// Configurar fecha mínima (hoy)
function setupDatePicker() {
    if (!dateSelect) return; // Solo si existe el date picker
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    dateSelect.setAttribute('min', minDate);
    
    // Establecer máximo a 90 días en el futuro
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 90);
    dateSelect.setAttribute('max', maxDate.toISOString().split('T')[0]);
}

// Event listeners
function setupEventListeners() {
    if (serviceSelect) serviceSelect.addEventListener('change', onServiceChange);
    if (dateSelect) dateSelect.addEventListener('change', onDateChange);
}

// Inicializar aplicación
async function init() {
    console.log('🌿 Esencia Pura - Inicializando...');
    
    setupDatePicker();
    setupEventListeners();
    
    // Detectar si estamos en la página principal (index) o en servicios por categoría
    const currentPath = window.location.pathname;
    const isServicesListPage = currentPath.includes('services-list.html');
    
    if (isServicesListPage) {
        // Página de servicios por categoría - NO cargar nada aquí (services-list.js lo maneja)
        console.log('📄 Página de servicios por categoría');
    } else if (categoriesGrid) {
        // Página principal - mostrar categorías
        console.log('🏠 Página principal - cargando categorías');
        await loadCategories();
        
        // También cargar servicios para el selector de reservas
        if (serviceSelect) {
            console.log('📝 Cargando servicios para selector de reservas');
            await loadServices();
        }
    }
    
    console.log('✅ Aplicación lista');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==========================================
// NOTAS PARA CONFIGURACIÓN
// ==========================================
/*
IMPORTANTE: Antes de deployar, debes:

1. Crear tu Google Form en https://forms.google.com
2. Agregar estos campos:
   - Nombre completo (texto)
   - Email (email)
   - Teléfono (texto)
   - Servicio (texto)
   - Fecha (texto)
   - Horario (texto)
   - Notas adicionales (párrafo, opcional)

3. Obtener los entry IDs:
   - Abre el form
   - Click derecho → Inspeccionar
   - Busca los campos, verás algo como: name="entry.123456"
   - Actualiza FORM_FIELDS con esos IDs

4. Actualizar GOOGLE_FORM_URL con tu URL del form

5. Configurar notificaciones en el form:
   - Settings → Responses → Get email notifications
*/
