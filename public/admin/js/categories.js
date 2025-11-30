// Categories Management - Esencia Pura Admin

const API_URL = window.location.origin; // Funciona local y en producción

// Get auth token
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
const modal = document.getElementById('category-modal');
const newCategoryBtn = document.getElementById('new-category-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');

function openModal(category = null) {
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('category-form');
    
    form.reset();
    document.getElementById('form-error').style.display = 'none';
    
    if (category) {
        // Edit mode
        modalTitle.textContent = 'Editar Categoría';
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-description').value = category.description;
        document.getElementById('category-image').value = category.imageUrl || '';
        document.getElementById('category-order').value = category.order;
        document.getElementById('category-active').checked = category.isActive;
        document.getElementById('submit-text').textContent = 'Actualizar';
    } else {
        // Create mode
        modalTitle.textContent = 'Nueva Categoría';
        document.getElementById('category-id').value = '';
        document.getElementById('submit-text').textContent = 'Guardar';
        // Sugerir siguiente orden
        const maxOrder = window.categoriesData && window.categoriesData.length > 0 
            ? Math.max(...window.categoriesData.map(c => c.order)) 
            : 0;
        document.getElementById('category-order').value = maxOrder + 1;
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

newCategoryBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ===== IMAGE UPLOAD =====
const uploadImageBtn = document.getElementById('upload-image-btn');
const imageFileInput = document.getElementById('image-file-input');
const uploadStatus = document.getElementById('upload-status');
const categoryImageInput = document.getElementById('category-image');

uploadImageBtn.addEventListener('click', () => {
    imageFileInput.click();
});

imageFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        uploadStatus.innerHTML = '<span style="color: #dc3545;">⚠️ Por favor selecciona una imagen</span>';
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        uploadStatus.innerHTML = '<span style="color: #dc3545;">⚠️ La imagen es muy grande (máx 5MB)</span>';
        return;
    }

    uploadStatus.innerHTML = '<span style="color: #666;">⏳ Subiendo imagen...</span>';
    uploadImageBtn.disabled = true;

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
                categoryImageInput.value = data.url;
                uploadStatus.innerHTML = '<span style="color: #28a745;">✅ Imagen subida correctamente</span>';
                
                console.log('✅ Image uploaded:', data.url);
            } catch (error) {
                console.error('❌ Upload error:', error);
                uploadStatus.innerHTML = `<span style="color: #dc3545;">❌ ${error.message}</span>`;
            } finally {
                uploadImageBtn.disabled = false;
                // Clear file input
                imageFileInput.value = '';
            }
        };

        reader.onerror = () => {
            uploadStatus.innerHTML = '<span style="color: #dc3545;">❌ Error al leer el archivo</span>';
            uploadImageBtn.disabled = false;
        };
    } catch (error) {
        console.error('❌ Error:', error);
        uploadStatus.innerHTML = `<span style="color: #dc3545;">❌ ${error.message}</span>`;
        uploadImageBtn.disabled = false;
    }
});

// ===== LOAD CATEGORIES =====
async function loadCategories() {
    console.log('📁 Loading categories...');
    const tbody = document.getElementById('categories-tbody');
    
    try {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    <div class="loading-spinner"></div>
                    Cargando categorías...
                </td>
            </tr>
        `;

        const res = await fetch(`${API_URL}/categories/admin/stats`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Error al cargar categorías');
        
        const categories = await res.json();
        console.log('✅ Categories loaded:', categories.length);

        if (categories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">
                        No hay categorías registradas
                    </td>
                </tr>
            `;
            return;
        }

        // Store categories globally for edit function
        window.categoriesData = categories;

        tbody.innerHTML = categories.map((category, index) => `
            <tr style="${!category.isActive ? 'opacity: 0.5;' : ''}">
                <td><strong>${category.order}</strong></td>
                <td>
                    <strong>${escapeHtml(category.name)}</strong>
                </td>
                <td>
                    <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">
                        ${escapeHtml(category.description)}
                    </div>
                </td>
                <td>
                    <span class="badge badge-info">
                        ${category._count.services} servicio${category._count.services !== 1 ? 's' : ''}
                    </span>
                </td>
                <td>
                    <span class="badge badge-${category.isActive ? 'success' : 'secondary'}">
                        ${category.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn btn-sm btn-primary edit-category-btn" data-index="${index}">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-sm ${category.isActive ? 'btn-secondary' : 'btn-success'} toggle-category-btn" 
                                data-id="${category.id}" data-status="${!category.isActive}">
                            ${category.isActive ? '🚫 Desactivar' : '✅ Activar'}
                        </button>
                        ${category._count.services === 0 ? `
                            <button class="btn btn-sm btn-danger delete-category-btn" data-id="${category.id}">
                                🗑️ Eliminar
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');

        // Attach event listeners to buttons
        document.querySelectorAll('.edit-category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                editCategory(index);
            });
        });

        document.querySelectorAll('.toggle-category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const status = btn.dataset.status === 'true';
                toggleCategoryStatus(id, status);
            });
        });

        document.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                deleteCategory(id);
            });
        });

    } catch (error) {
        console.error('💥 Error in loadCategories:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="error">❌ Error cargando categorías: ' + error.message + '</td></tr>';
    }
}

// Helper to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== EDIT CATEGORY =====
function editCategory(categoryIndex) {
    console.log('✏️ Editing category at index:', categoryIndex);
    const category = window.categoriesData[categoryIndex];
    if (!category) {
        console.error('❌ Category not found at index:', categoryIndex);
        return;
    }
    openModal(category);
}

// ===== TOGGLE CATEGORY STATUS =====
async function toggleCategoryStatus(categoryId, newStatus) {
    console.log('🔄 Toggle called with:', { categoryId, newStatus });
    
    const action = newStatus ? 'activar' : 'desactivar';
    if (!confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} esta categoría?`)) return;

    try {
        const res = await fetch(`${API_URL}/categories/${categoryId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ isActive: newStatus })
        });

        if (!res.ok) throw new Error('Error al actualizar categoría');

        alert(`✅ Categoría ${action}da exitosamente`);
        await loadCategories();
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + error.message);
    }
}

// ===== DELETE CATEGORY =====
async function deleteCategory(categoryId) {
    console.log('🗑️ Delete called for:', categoryId);
    
    if (!confirm('⚠️ ¿Estás SEGURO de que deseas ELIMINAR PERMANENTEMENTE esta categoría?\n\nEsta acción NO SE PUEDE DESHACER.')) return;

    try {
        const res = await fetch(`${API_URL}/categories/${categoryId}?permanent=true`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al eliminar categoría');
        }

        alert('✅ Categoría eliminada exitosamente');
        await loadCategories();
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + error.message);
    }
}

// ===== FORM SUBMIT =====
document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted');

    const categoryId = document.getElementById('category-id').value;
    const formData = {
        name: document.getElementById('category-name').value.trim(),
        description: document.getElementById('category-description').value.trim(),
        imageUrl: document.getElementById('category-image').value.trim() || undefined,
        order: parseInt(document.getElementById('category-order').value),
        isActive: document.getElementById('category-active').checked
    };

    console.log('Form data:', formData);

    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const originalText = submitText.textContent;

    try {
        submitText.textContent = 'Guardando...';
        submitBtn.disabled = true;

        const url = categoryId 
            ? `${API_URL}/categories/${categoryId}` 
            : `${API_URL}/categories`;
        
        const method = categoryId ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Error al guardar categoría');
        }

        alert(`✅ Categoría ${categoryId ? 'actualizada' : 'creada'} exitosamente`);
        closeModal();
        await loadCategories();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('form-error').textContent = error.message;
        document.getElementById('form-error').style.display = 'block';
    } finally {
        submitText.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌿 Initializing Categories Panel...');
    await loadCategories();
    console.log('✅ Categories Panel ready');
});
