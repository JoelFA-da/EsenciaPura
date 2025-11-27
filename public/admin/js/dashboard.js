// Dashboard Admin - Esencia Pura

const API_URL = window.location.origin; // Funciona local y en producción

// Get auth headers
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

// ===== AUTH CHECK =====
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        if (!window.location.pathname.includes('/admin/login.html')) {
            window.location.replace('/admin/login.html');
        }
        return null;
    }

    // Decodificar JWT para obtener info del usuario
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Verificar expiración
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            if (!window.location.pathname.includes('/admin/login.html')) {
                window.location.replace('/admin/login.html');
            }
            return null;
        }

        return payload;
    } catch (error) {
        console.error('Error decodificando token:', error);
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/admin/login.html')) {
            window.location.replace('/admin/login.html');
        }
        return null;
    }
}

// ===== LOGOUT =====
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login.html';
    }
});

// ===== LOAD STATS =====
async function loadStats() {
    try {
        // Categorías activas
        const categoriesRes = await fetch(`${API_URL}/categories/admin/all`, {
            headers: getAuthHeaders()
        });
        const categories = await categoriesRes.json();
        const activeCategories = categories.filter(c => c.isActive);
        document.getElementById('stat-categories').textContent = activeCategories.length;

        // Servicios activos
        const servicesRes = await fetch(`${API_URL}/services/admin/all`, {
            headers: getAuthHeaders()
        });
        const services = await servicesRes.json();
        const activeServices = services.filter(s => s.isActive);
        document.getElementById('stat-services').textContent = activeServices.length;

        // Reservas
        const bookingsRes = await fetch(`${API_URL}/bookings`, {
            headers: getAuthHeaders()
        });
        const bookingsData = await bookingsRes.json();
        const bookings = bookingsData.bookings || bookingsData;
        
        const pending = bookings.filter(b => b.status === 'PENDING').length;
        const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;

        document.getElementById('stat-pending').textContent = pending;
        document.getElementById('stat-confirmed').textContent = confirmed;

    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// ===== LOAD RECENT BOOKINGS =====
async function loadRecentBookings() {
    const tbody = document.getElementById('bookings-tbody');

    try {
        const res = await fetch(`${API_URL}/bookings`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Error cargando reservas');

        const data = await res.json();
        const bookings = data.bookings || data;
        
        if (!bookings || bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">No hay reservas</td></tr>';
            return;
        }

        // Mostrar solo las 5 más recientes
        const recent = bookings
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        tbody.innerHTML = recent.map(booking => `
            <tr>
                <td>${formatDate(booking.date)}</td>
                <td>${booking.startTime}</td>
                <td>${booking.service?.name || 'N/A'}</td>
                <td><span class="badge badge-${getStatusColor(booking.status)}">${getStatusText(booking.status)}</span></td>
                <td>
                    ${booking.status === 'PENDING' ? 
                        `<button class="btn btn-sm btn-success" onclick="confirmBooking('${booking.id}')">Confirmar</button>` :
                        `<button class="btn btn-sm" onclick="viewBooking('${booking.id}')">Ver</button>`
                    }
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="error">Error cargando reservas</td></tr>';
    }
}

// ===== LOAD SERVICES =====
async function loadServices() {
    const tbody = document.getElementById('services-tbody');

    try {
        const res = await fetch(`${API_URL}/services/admin/all`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Error cargando servicios');

        const services = await res.json();
        
        if (services.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty">No hay servicios</td></tr>';
            return;
        }

        tbody.innerHTML = services.map(service => `
            <tr>
                <td><strong>${service.name}</strong></td>
                <td>${service.duration} min</td>
                <td>₡${service.price.toLocaleString()}</td>
                <td><span class="badge badge-${service.isActive ? 'success' : 'secondary'}">${service.isActive ? 'Activo' : 'Inactivo'}</span></td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="error">Error cargando servicios</td></tr>';
    }
}

// ===== CONFIRM BOOKING =====
async function confirmBooking(bookingId) {
    if (!confirm('¿Confirmar esta reserva?')) return;

    try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/confirm`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Error confirmando reserva');

        alert('✅ Reserva confirmada');
        loadRecentBookings();
        loadStats();

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error confirmando reserva');
    }
}

// ===== VIEW BOOKING =====
function viewBooking(bookingId) {
    window.location.href = `/admin/bookings.html?id=${bookingId}`;
}

// ===== HELPERS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getStatusColor(status) {
    const colors = {
        PENDING: 'warning',
        CONFIRMED: 'success',
        CANCELLED: 'secondary'
    };
    return colors[status] || 'secondary';
}

function getStatusText(status) {
    const texts = {
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmada',
        CANCELLED: 'Cancelada'
    };
    return texts[status] || status;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    // Actualizar info de usuario en sidebar
    if (user.email) {
        document.getElementById('user-email').textContent = user.email;
        const initial = user.email.charAt(0).toUpperCase();
        document.getElementById('user-avatar').textContent = initial;
    }

    // Cargar datos
    loadStats();
    loadRecentBookings();
    loadServices();
});
