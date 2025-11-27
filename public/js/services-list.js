// Services List Page - Esencia Pura

const API_URL = window.location.origin;

// Get category ID from URL
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('categoryId');

// Get DOM elements
const categoryTitle = document.getElementById('category-title');
const categoryDescription = document.getElementById('category-description');
const servicesGrid = document.getElementById('services-grid');

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0
    }).format(price);
}

// Get category icon
function getCategoryIcon(categoryName) {
    const name = categoryName.toLowerCase();
    if (name.includes('masaje')) return '💆';
    if (name.includes('facial')) return '✨';
    if (name.includes('corporal')) return '🧖';
    if (name.includes('especial')) return '🌟';
    return '🌿';
}

// Fetch category details
async function fetchCategory(id) {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`);
        if (!response.ok) throw new Error('Categoría no encontrada');
        return await response.json();
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

// Fetch services by category
async function fetchServicesByCategory(categoryId) {
    try {
        const response = await fetch(`${API_URL}/services`);
        if (!response.ok) throw new Error('Error al cargar servicios');
        
        const allServices = await response.json();
        
        // Filter by category
        return allServices.filter(service => service.categoryId === categoryId);
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

// Render services
function renderServices(services, categoryName) {
    if (!services || services.length === 0) {
        servicesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: var(--text-secondary);">
                    No hay servicios disponibles en esta categoría en este momento.
                </p>
                <a href="/" class="btn btn-primary" style="margin-top: 1rem;">Ver todas las categorías</a>
            </div>
        `;
        return;
    }

    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-image">
                ${service.imageUrl 
                    ? `<img src="${service.imageUrl}" alt="${service.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">` 
                    : `<div style="font-size: 4rem; padding: 2rem;">${getCategoryIcon(categoryName)}</div>`
                }
            </div>
            <h3>${service.name}</h3>
            <p>${service.description || 'Tratamiento de relajación y bienestar'}</p>
            <div class="service-details">
                <div class="service-price">${formatPrice(service.price)}</div>
                <div class="service-duration">⏱️ ${service.duration} minutos</div>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <a href="/service-detail.html?id=${service.id}&categoryId=${categoryId}" class="btn btn-secondary" style="flex: 1;">
                    Más información
                </a>
                <a href="/reserva.html?serviceId=${service.id}" class="btn btn-primary" style="flex: 1;">
                    Reservar
                </a>
            </div>
        </div>
    `).join('');
}

// Load page data
async function loadPage() {
    if (!categoryId) {
        servicesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: var(--text-secondary);">
                    No se especificó una categoría.
                </p>
                <a href="/" class="btn btn-primary" style="margin-top: 1rem;">Ver todas las categorías</a>
            </div>
        `;
        return;
    }

    try {
        // Fetch category details
        const category = await fetchCategory(categoryId);
        
        if (category) {
            categoryTitle.textContent = category.name;
            categoryDescription.textContent = category.description || 'Descubre nuestros tratamientos';
        }

        // Fetch and render services
        const services = await fetchServicesByCategory(categoryId);
        renderServices(services, category?.name || '');

    } catch (error) {
        console.error('Error loading page:', error);
        servicesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: var(--text-secondary);">
                    Error al cargar los servicios. Por favor intenta de nuevo.
                </p>
                <a href="/" class="btn btn-primary" style="margin-top: 1rem;">Volver al inicio</a>
            </div>
        `;
    }
}

// Initialize
loadPage();
