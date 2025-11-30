// Services Management - Esencia Pura Admin

const API_URL = window.location.origin; // Funciona local y en producción

// ===== AUTH CHECK =====
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        if (!window.location.pathname.includes('/admin/login.html')) {
            window.location.replace('/admin/login.html');
        }
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
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
const modal = document.getElementById('service-modal');
const newServiceBtn = document.getElementById('new-service-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');

function openModal(service = null) {
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('service-form');
    
    form.reset();
    document.getElementById('form-error').style.display = 'none';
    
    if (service) {
        // Edit mode
        modalTitle.textContent = 'Editar Servicio';
        document.getElementById('service-id').value = service.id;
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-category').value = service.categoryId;
        document.getElementById('service-description').value = service.description;
        document.getElementById('service-price').value = service.price;
        document.getElementById('service-duration').value = service.duration;
        document.getElementById('service-image').value = service.imageUrl || '';
        document.getElementById('service-benefits').value = service.benefits || '';
        document.getElementById('service-recommendations').value = service.recommendations || '';
        document.getElementById('service-active').checked = service.isActive;
        document.getElementById('submit-text').textContent = 'Actualizar';
    } else {
        // Create mode
        modalTitle.textContent = 'Nuevo Servicio';
        document.getElementById('service-id').value = '';
        document.getElementById('submit-text').textContent = 'Crear';
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

newServiceBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ===== IMAGE UPLOAD FOR SERVICES =====
const uploadServiceImageBtn = document.getElementById('upload-service-image-btn');
const serviceImageFileInput = document.getElementById('service-image-file-input');
const uploadServiceStatus = document.getElementById('upload-service-status');
const serviceImageInput = document.getElementById('service-image');

if (uploadServiceImageBtn) {
    uploadServiceImageBtn.addEventListener('click', () => {
        serviceImageFileInput.click();
    });

    serviceImageFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            uploadServiceStatus.innerHTML = '<span style="color: #dc3545;">⚠️ Por favor selecciona una imagen</span>';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            uploadServiceStatus.innerHTML = '<span style="color: #dc3545;">⚠️ La imagen es muy grande (máx 5MB)</span>';
            return;
        }

        uploadServiceStatus.innerHTML = '<span style="color: #666;">⏳ Subiendo imagen...</span>';
        uploadServiceImageBtn.disabled = true;

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = async () => {
                try {
                    const base64Image = reader.result;

                    // Upload to ImgBB via our API
                    const res = await fetch(`${API_URL}/upload/image`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ image: base64Image })
                    });

                    if (!res.ok) {
                        const error = await res.json();
                        throw new Error(error.details || error.error || 'Error al subir imagen');
                    }

                    const data = await res.json();
                    
                    // Update input with URL
                    serviceImageInput.value = data.url;
                    uploadServiceStatus.innerHTML = '<span style="color: #28a745;">✅ Imagen subida correctamente</span>';
                    
                    console.log('✅ Image uploaded:', data.url);
                } catch (error) {
                    console.error('❌ Upload error:', error);
                    uploadServiceStatus.innerHTML = `<span style="color: #dc3545;">❌ ${error.message}</span>`;
                } finally {
                    uploadServiceImageBtn.disabled = false;
                    // Clear file input
                    serviceImageFileInput.value = '';
                }
            };

            reader.onerror = () => {
                uploadServiceStatus.innerHTML = '<span style="color: #dc3545;">❌ Error al leer el archivo</span>';
                uploadServiceImageBtn.disabled = false;
            };
        } catch (error) {
            console.error('❌ Error:', error);
            uploadServiceStatus.innerHTML = `<span style="color: #dc3545;">❌ ${error.message}</span>`;
            uploadServiceImageBtn.disabled = false;
        }
    });
}

// ===== LOAD CATEGORIES =====
let categoriesData = [];

async function loadCategories() {
    try {
        const res = await fetch(`${API_URL}/categories/admin/all`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Error al cargar categorías');
        
        categoriesData = await res.json();
        const select = document.getElementById('service-category');
        
        if (categoriesData.length === 0) {
            select.innerHTML = '<option value="">⚠️ No hay categorías. Crea una primero.</option>';
            return;
        }
        
        select.innerHTML = `
            <option value="">Selecciona una categoría</option>
            ${categoriesData.map(cat => `
                <option value="${cat.id}">${cat.name}</option>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error loading categories:', error);
        const select = document.getElementById('service-category');
        select.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
}

// ===== LOAD SERVICES =====
async function loadServices() {
    const tbody = document.getElementById('services-tbody');

    console.log('🔍 Loading services...');

    try {
        // Admin debe ver TODOS los servicios (activos + inactivos)
        const res = await fetch(`${API_URL}/services/admin/all`, {
            headers: getAuthHeaders()
        });

        console.log('📡 Response status:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText);
            throw new Error('Error cargando servicios: ' + res.status);
        }

        const services = await res.json();
        console.log('✅ Services loaded:', services.length, services);
        
        if (services.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        No hay servicios creados. 
                        <button class="btn btn-sm btn-primary" onclick="document.getElementById('new-service-btn').click()">
                            Crear el primero
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        // Store services globally for edit function
        window.servicesData = services;

        tbody.innerHTML = services.map((service, index) => `
            <tr style="${!service.isActive ? 'opacity: 0.5;' : ''}">
                <td>
                    <strong>${escapeHtml(service.name)}</strong>
                    ${service.imageUrl ? `<br><small style="color: #64748b;">📷 Con imagen</small>` : ''}
                </td>
                <td>
                    <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">
                        ${escapeHtml(service.description)}
                    </div>
                </td>
                <td><strong>₡${service.price.toLocaleString()}</strong></td>
                <td>${service.duration} min</td>
                <td>
                    <span class="badge badge-${service.isActive ? 'success' : 'secondary'}">
                        ${service.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn btn-sm btn-primary edit-service-btn" data-index="${index}">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-sm ${service.isActive ? 'btn-secondary' : 'btn-success'} toggle-service-btn" 
                                data-id="${service.id}" data-status="${!service.isActive}">
                            ${service.isActive ? '🚫 Desactivar' : '✅ Activar'}
                        </button>
                        ${!service.isActive ? `
                            <button class="btn btn-sm btn-danger delete-service-btn" data-id="${service.id}">
                                🗑️ Eliminar
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');

        // Attach event listeners to buttons
        document.querySelectorAll('.edit-service-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                editService(index);
            });
        });

        document.querySelectorAll('.toggle-service-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const status = btn.dataset.status === 'true';
                toggleServiceStatus(id, status);
            });
        });

        document.querySelectorAll('.delete-service-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                deleteService(id);
            });
        });

    } catch (error) {
        console.error('💥 Error in loadServices:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="error">❌ Error cargando servicios: ' + error.message + '</td></tr>';
    }
}

// Helper to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== EDIT SERVICE =====
function editService(serviceIndex) {
    console.log('✏️ Editing service at index:', serviceIndex);
    const service = window.servicesData[serviceIndex];
    if (!service) {
        console.error('❌ Service not found at index:', serviceIndex);
        return;
    }
    openModal(service);
}

// ===== TOGGLE SERVICE STATUS =====
async function toggleServiceStatus(serviceId, newStatus) {
    console.log('🔄 Toggle called with:', { serviceId, newStatus });
    
    const action = newStatus ? 'activar' : 'desactivar';
    if (!confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} este servicio?`)) return;

    try {
        console.log('🔄 Toggling service:', serviceId, 'to', newStatus);
        
        const res = await fetch(`${API_URL}/services/${serviceId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ isActive: newStatus })
        });

        console.log('📡 Response status:', res.status);

        if (!res.ok) {
            const error = await res.json();
            console.error('❌ Error response:', error);
            throw new Error(error.error || error.message || 'Error actualizando servicio');
        }

        const updated = await res.json();
        console.log('✅ Service updated:', updated);

        await loadServices();
        alert(`✅ Servicio ${action}do exitosamente`);

    } catch (error) {
        console.error('💥 Error in toggleServiceStatus:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

// ===== DELETE SERVICE =====
async function deleteService(serviceId) {
    console.log('🗑️ Delete called for service:', serviceId);
    
    if (!confirm('⚠️ ¿ELIMINAR PERMANENTEMENTE este servicio?\n\nEsta acción NO se puede deshacer.\n\nSi tiene reservas asociadas, NO podrá eliminarse.')) {
        return;
    }

    try {
        console.log('🗑️ Deleting service:', serviceId);
        
        const res = await fetch(`${API_URL}/services/${serviceId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        console.log('📡 Response status:', res.status);

        if (!res.ok) {
            const error = await res.json();
            console.error('❌ Error response:', error);
            throw new Error(error.error || 'Error eliminando servicio');
        }

        console.log('✅ Service deleted successfully');

        await loadServices();
        alert('✅ Servicio eliminado permanentemente');

    } catch (error) {
        console.error('💥 Error in deleteService:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

// ===== CREATE/UPDATE SERVICE =====
document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const errorDiv = document.getElementById('form-error');
    const serviceId = document.getElementById('service-id').value;
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading-spinner"></div> Guardando...';
    errorDiv.style.display = 'none';
    
    const data = {
        name: document.getElementById('service-name').value.trim(),
        categoryId: document.getElementById('service-category').value,
        description: document.getElementById('service-description').value.trim(),
        price: parseFloat(document.getElementById('service-price').value),
        duration: parseInt(document.getElementById('service-duration').value),
        imageUrl: document.getElementById('service-image').value.trim() || undefined,
        benefits: document.getElementById('service-benefits').value.trim() || undefined,
        recommendations: document.getElementById('service-recommendations').value.trim() || undefined,
        isActive: document.getElementById('service-active').checked
    };

    console.log('📤 Submitting service:', serviceId ? 'UPDATE' : 'CREATE', data);

    try {
        const url = serviceId 
            ? `${API_URL}/services/${serviceId}` 
            : `${API_URL}/services`;
        
        const method = serviceId ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        console.log('📡 Response status:', res.status);

        if (!res.ok) {
            const error = await res.json();
            console.error('❌ Error response:', error);
            
            // Mostrar detalles de validación si existen
            if (error.details && Array.isArray(error.details)) {
                const errorMessages = error.details.map(d => `${d.field}: ${d.message}`).join('\n');
                throw new Error(errorMessages);
            }
            
            throw new Error(error.error || error.message || 'Error guardando servicio');
        }

        const result = await res.json();
        console.log('✅ Service saved:', result);

        await loadServices();
        closeModal();
        alert(`✅ Servicio ${serviceId ? 'actualizado' : 'creado'} exitosamente`);

    } catch (error) {
        console.error('💥 Error in form submit:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span id="submit-text">${serviceId ? 'Actualizar' : 'Crear'}</span>`;
    }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    const user = checkAuth();
    if (!user) return;

    // Update user info in sidebar
    if (user.email) {
        document.getElementById('user-email').textContent = user.email;
        const initial = user.email.charAt(0).toUpperCase();
        document.getElementById('user-avatar').textContent = initial;
    }

    // Load categories first, then services
    await loadCategories();
    loadServices();
});
