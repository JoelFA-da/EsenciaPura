// Bookings Management - Esencia Pura Admin

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

// ===== LOGOUT =====
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login.html';
    }
});

// ===== MODAL MANAGEMENT =====
const modal = document.getElementById('booking-modal');
const newBookingBtn = document.getElementById('new-booking-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');

function openModal() {
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('booking-form');
    
    form.reset();
    document.getElementById('form-error').style.display = 'none';
    
    modalTitle.textContent = 'Nueva Reserva';
    document.getElementById('submit-text').textContent = 'Crear Reserva';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-date').setAttribute('min', today);
    
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

newBookingBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ===== LOAD SERVICES =====
let servicesData = [];

async function loadServices() {
    try {
        const res = await fetch(`${API_URL}/services`);
        if (!res.ok) throw new Error('Error al cargar servicios');
        
        servicesData = await res.json();
        const select = document.getElementById('booking-service');
        
        if (servicesData.length === 0) {
            select.innerHTML = '<option value="">No hay servicios disponibles</option>';
            return;
        }
        
        select.innerHTML = '<option value="">Selecciona un servicio</option>' +
            servicesData.map(s => `<option value="${s.id}">${s.name} - ₡${s.price.toLocaleString()} (${s.duration} min)</option>`).join('');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// ===== DATE CHANGE - LOAD AVAILABLE TIMES =====
document.getElementById('booking-date').addEventListener('change', async () => {
    const date = document.getElementById('booking-date').value;
    const serviceId = document.getElementById('booking-service').value;
    const timeSelect = document.getElementById('booking-time');
    
    if (!date || !serviceId) {
        timeSelect.innerHTML = '<option value="">Selecciona fecha y servicio</option>';
        return;
    }
    
    timeSelect.innerHTML = '<option value="">Cargando...</option>';
    
    try {
        const res = await fetch(`${API_URL}/bookings/available-slots?date=${date}&serviceId=${serviceId}`);
        if (!res.ok) throw new Error('Error al cargar horarios');
        
        const data = await res.json();
        const slots = data.availableSlots;
        
        if (slots.length === 0) {
            timeSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
            return;
        }
        
        timeSelect.innerHTML = '<option value="">Selecciona una hora</option>' +
            slots.map(time => `<option value="${time}">${time}</option>`).join('');
            
    } catch (error) {
        console.error('Error:', error);
        timeSelect.innerHTML = '<option value="">Error al cargar horarios</option>';
    }
});

// Also reload times when service changes
document.getElementById('booking-service').addEventListener('change', () => {
    const date = document.getElementById('booking-date').value;
    if (date) {
        document.getElementById('booking-date').dispatchEvent(new Event('change'));
    }
});

// ===== LOAD BOOKINGS =====
async function loadBookings(filters = {}) {
    console.log('📅 Loading bookings with filters:', filters);
    const tbody = document.getElementById('bookings-tbody');
    
    try {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    <div class="loading-spinner"></div>
                    Cargando reservas...
                </td>
            </tr>
        `;

        // Build query params
        const params = new URLSearchParams();
        if (filters.date) params.append('date', filters.date);
        if (filters.status) params.append('status', filters.status);

        const res = await fetch(`${API_URL}/bookings?${params.toString()}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Error al cargar reservas');
        
        const data = await res.json();
        const bookings = data.bookings;
        
        console.log('✅ Bookings loaded:', bookings.length);

        if (bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state">
                        No hay reservas registradas
                    </td>
                </tr>
            `;
            return;
        }

        // Aplicar ordenamiento por fecha
        const sortOrder = filters.sortOrder || 'desc';
        console.log('🔄 Sorting bookings:', sortOrder);
        
        const sortedBookings = [...bookings].sort((a, b) => {
            // Crear objetos Date completos con fecha y hora
            const dateStrA = a.date.split('T')[0]; // Obtener solo YYYY-MM-DD
            const dateStrB = b.date.split('T')[0];
            
            const dateA = new Date(dateStrA + 'T' + a.startTime + ':00');
            const dateB = new Date(dateStrB + 'T' + b.startTime + ':00');
            
            console.log(`Comparing: ${dateA.toISOString()} vs ${dateB.toISOString()}`);
            
            if (sortOrder === 'asc') {
                return dateA.getTime() - dateB.getTime(); // Más antigua primero
            } else {
                return dateB.getTime() - dateA.getTime(); // Más reciente primero
            }
        });
        
        console.log('✅ Sorted bookings count:', sortedBookings.length);

        // Store sorted bookings globally for actions
        window.bookingsData = sortedBookings;

        tbody.innerHTML = sortedBookings.map((booking, index) => {
            const date = new Date(booking.date);
            const dateStr = date.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                weekday: 'short'
            });
            
            const statusBadge = {
                'PENDING': 'badge-warning',
                'CONFIRMED': 'badge-success',
                'CANCELLED': 'badge-secondary',
                'COMPLETED': 'badge-info'
            }[booking.status] || 'badge-secondary';
            
            const statusText = {
                'PENDING': 'Pendiente',
                'CONFIRMED': 'Confirmada',
                'CANCELLED': 'Cancelada',
                'COMPLETED': 'Completada'
            }[booking.status] || booking.status;
            
            return `
                <tr>
                    <td><strong>${dateStr}</strong></td>
                    <td><strong>${booking.startTime}</strong> - ${booking.endTime}</td>
                    <td>${booking.service?.name || 'N/A'}</td>
                    <td>${booking.customerName || '<span style="color: #999;">-</span>'}</td>
                    <td>${booking.customerPhone || '<span style="color: #999;">-</span>'}</td>
                    <td>
                        <span class="badge ${statusBadge}">${statusText}</span>
                    </td>
                    <td>
                        ${booking.formSubmissionId ? 
                            `<code style="font-size: 0.85rem;">${booking.formSubmissionId}</code>` : 
                            '<span style="color: #999;">-</span>'}
                    </td>
                    <td>
                        ${booking.notes ? 
                            `<small style="color: #666;">${booking.notes.substring(0, 50)}${booking.notes.length > 50 ? '...' : ''}</small>` : 
                            '<span style="color: #999;">-</span>'}
                    </td>
                    <td>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${booking.status === 'PENDING' ? `
                                <button class="btn btn-sm btn-success confirm-booking-btn" data-index="${index}">
                                    ✅ Confirmar
                                </button>
                            ` : ''}
                            ${booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' ? `
                                <button class="btn btn-sm btn-secondary cancel-booking-btn" data-index="${index}">
                                    ❌ Cancelar
                                </button>
                            ` : ''}
                            ${booking.status === 'CONFIRMED' ? `
                                <button class="btn btn-sm btn-info complete-booking-btn" data-index="${index}">
                                    ✔️ Completar
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach event listeners to buttons
        document.querySelectorAll('.confirm-booking-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                confirmBooking(window.bookingsData[index].id);
            });
        });

        document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                cancelBooking(window.bookingsData[index].id);
            });
        });

        document.querySelectorAll('.complete-booking-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                completeBooking(window.bookingsData[index].id);
            });
        });

    } catch (error) {
        console.error('💥 Error in loadBookings:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="error">❌ Error cargando reservas: ' + error.message + '</td></tr>';
    }
}

// ===== ACTIONS =====
async function confirmBooking(bookingId) {
    if (!confirm('¿Confirmar esta reserva?\n\nRecuerda contactar al cliente manualmente usando la información del formulario de Google Forms.')) return;

    try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/confirm`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Error al confirmar reserva');

        alert('✅ Reserva confirmada exitosamente\n\nNo olvides contactar al cliente para confirmarle su cita.');
        await loadBookings();
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + error.message);
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('¿Cancelar esta reserva?')) return;

    try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Error al cancelar reserva');

        alert('✅ Reserva cancelada exitosamente');
        await loadBookings();
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + error.message);
    }
}

async function completeBooking(bookingId) {
    if (!confirm('¿Marcar esta reserva como completada?')) return;

    try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/complete`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Error al completar reserva');

        alert('✅ Reserva marcada como completada');
        await loadBookings();
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + error.message);
    }
}

// ===== FORM SUBMIT =====
document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted');

    const formData = {
        serviceId: document.getElementById('booking-service').value,
        customerName: document.getElementById('customer-name').value.trim() || undefined,
        customerEmail: document.getElementById('customer-email').value.trim() || undefined,
        customerPhone: document.getElementById('customer-phone').value.trim() || undefined,
        date: document.getElementById('booking-date').value,
        startTime: document.getElementById('booking-time').value,
        formSubmissionId: document.getElementById('booking-form-id').value.trim() || undefined,
        notes: document.getElementById('booking-notes').value.trim() || undefined,
        skipAvailabilityCheck: document.getElementById('booking-skip-check').checked
    };

    console.log('Form data:', formData);

    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const originalText = submitText.textContent;

    try {
        submitText.textContent = 'Guardando...';
        submitBtn.disabled = true;

        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear la reserva');
        }

        alert('✅ Reserva creada exitosamente en el sistema');
        closeModal();
        await loadBookings();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('form-error').textContent = error.message;
        document.getElementById('form-error').style.display = 'block';
    } finally {
        submitText.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ===== FILTERS =====
let currentSortOrder = 'desc'; // Por defecto: más reciente primero

document.getElementById('apply-filters-btn').addEventListener('click', () => {
    const filters = {
        date: document.getElementById('filter-date').value,
        status: document.getElementById('filter-status').value,
        sortOrder: currentSortOrder
    };
    loadBookings(filters);
});

// Botones de ordenamiento en el encabezado
document.getElementById('sort-date-asc').addEventListener('click', () => {
    console.log('🔼 Ordenar ASCENDENTE (más antigua primero)');
    currentSortOrder = 'asc';
    document.getElementById('sort-date-asc').style.color = '#9BA4D4';
    document.getElementById('sort-date-asc').style.fontWeight = 'bold';
    document.getElementById('sort-date-desc').style.color = '#666';
    document.getElementById('sort-date-desc').style.fontWeight = 'normal';
    const filters = {
        date: document.getElementById('filter-date').value,
        status: document.getElementById('filter-status').value,
        sortOrder: 'asc'
    };
    console.log('Filters:', filters);
    loadBookings(filters);
});

document.getElementById('sort-date-desc').addEventListener('click', () => {
    console.log('🔽 Ordenar DESCENDENTE (más reciente primero)');
    currentSortOrder = 'desc';
    document.getElementById('sort-date-desc').style.color = '#9BA4D4';
    document.getElementById('sort-date-desc').style.fontWeight = 'bold';
    document.getElementById('sort-date-asc').style.color = '#666';
    document.getElementById('sort-date-asc').style.fontWeight = 'normal';
    const filters = {
        date: document.getElementById('filter-date').value,
        status: document.getElementById('filter-status').value,
        sortOrder: 'desc'
    };
    console.log('Filters:', filters);
    loadBookings(filters);
});

document.getElementById('clear-filters-btn').addEventListener('click', () => {
    document.getElementById('filter-date').value = '';
    document.getElementById('filter-status').value = '';
    currentSortOrder = 'desc';
    document.getElementById('sort-date-desc').style.color = '#9BA4D4';
    document.getElementById('sort-date-desc').style.fontWeight = 'bold';
    document.getElementById('sort-date-asc').style.color = '#666';
    document.getElementById('sort-date-asc').style.fontWeight = 'normal';
    loadBookings();
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌿 Initializing Bookings Admin Panel...');
    
    // Resaltar botón de ordenamiento por defecto (descendente)
    document.getElementById('sort-date-desc').style.color = '#9BA4D4';
    document.getElementById('sort-date-desc').style.fontWeight = 'bold';
    
    await loadServices();
    await loadBookings();
    console.log('✅ Bookings Panel ready');
});
