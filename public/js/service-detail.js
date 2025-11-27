// Service Detail Page - Esencia Pura

const API_URL = window.location.origin;

// Get service ID from URL
const urlParams = new URLSearchParams(window.location.search);
const serviceId = urlParams.get('id');
const categoryId = urlParams.get('categoryId');

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0
    }).format(price);
}

// Fetch service details
async function fetchService(id) {
    try {
        const response = await fetch(`${API_URL}/services/${id}`);
        if (!response.ok) throw new Error('Servicio no encontrado');
        return await response.json();
    } catch (error) {
        console.error('Error fetching service:', error);
        return null;
    }
}

// Render service details
function renderService(service) {
    const container = document.getElementById('service-content');

    if (!service) {
        container.innerHTML = `
            <div class="error-container">
                <h2 style="color: var(--primary); margin-bottom: 1rem;">Servicio no encontrado</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    El servicio que buscas no está disponible o no existe.
                </p>
                <a href="/" class="btn btn-primary">Volver al inicio</a>
            </div>
        `;
        return;
    }

    // Parse benefits and recommendations (split by newlines)
    const benefits = service.benefits 
        ? service.benefits.split('\n').filter(b => b.trim()) 
        : [];
    
    const recommendations = service.recommendations 
        ? service.recommendations.split('\n').filter(r => r.trim()) 
        : [];

    container.innerHTML = `
        <div class="service-header">
            ${service.category ? `<span class="service-category-badge">${service.category.name}</span>` : ''}
            <h1 style="text-align: center;">${service.name}</h1>
            <div class="service-meta">
                <div class="service-meta-item">
                    <span>💰</span>
                    <strong>${formatPrice(service.price)}</strong>
                </div>
                <div class="service-meta-item">
                    <span>⏱️</span>
                    <strong>${service.duration} minutos</strong>
                </div>
            </div>
        </div>

        <div class="service-description">
            <p>${service.description || 'Tratamiento de relajación y bienestar diseñado especialmente para ti.'}</p>
        </div>

        ${benefits.length > 0 ? `
            <div class="service-details-section">
                <h2>✨ Beneficios</h2>
                <ul>
                    ${benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${recommendations.length > 0 ? `
            <div class="service-details-section">
                <h2>📋 Recomendaciones</h2>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <div class="service-cta">
            <h3>¿Listo para vivir esta experiencia?</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                Reserva tu cita ahora y comienza tu viaje hacia el bienestar
            </p>
            <div class="service-actions">
                ${categoryId 
                    ? `<a href="/services-list.html?categoryId=${categoryId}" class="btn btn-secondary">
                        ← Volver a servicios
                    </a>`
                    : `<a href="/" class="btn btn-secondary">
                        Ver más servicios
                    </a>`
                }
                <a href="/reserva.html?serviceId=${service.id}" class="btn btn-primary">
                    Reservar ahora
                </a>
            </div>
        </div>
    `;
}

// Load page
async function loadPage() {
    if (!serviceId) {
        document.getElementById('service-content').innerHTML = `
            <div class="error-container">
                <h2 style="color: var(--primary); margin-bottom: 1rem;">Servicio no especificado</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    No se proporcionó un ID de servicio.
                </p>
                <a href="/" class="btn btn-primary">Ver todos los servicios</a>
            </div>
        `;
        return;
    }

    try {
        const service = await fetchService(serviceId);
        renderService(service);
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('service-content').innerHTML = `
            <div class="error-container">
                <h2 style="color: var(--primary); margin-bottom: 1rem;">Error al cargar</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    Hubo un problema al cargar los detalles del servicio. Por favor intenta de nuevo.
                </p>
                <a href="/" class="btn btn-primary">Volver al inicio</a>
            </div>
        `;
    }
}

// Initialize
loadPage();
