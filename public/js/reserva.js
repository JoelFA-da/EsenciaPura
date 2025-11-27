// ===== CONFIGURATION =====
const API_URL = window.location.origin; // Funciona local y en producción

// ===== STATE =====
const bookingState = {
    currentStep: 1,
    selectedCategory: null,
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    customerData: null
};

// ===== DOM ELEMENTS =====
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const progressSteps = document.querySelectorAll('.progress-step');
const stepContents = document.querySelectorAll('.step-content');

// Categories
const categoriesGrid = document.getElementById('categories-grid');

// Services
const servicesGrid = document.getElementById('services-grid');

// Calendar
const calendarGrid = document.getElementById('calendar-grid');
const currentMonthEl = document.getElementById('current-month');
const btnPrevMonth = document.getElementById('prev-month');
const btnNextMonth = document.getElementById('next-month');
let currentMonth = new Date();

// Time slots
const timeSlotsGrid = document.getElementById('time-slots-grid');

// Summary & Form
const summaryPreview = document.getElementById('summary-preview');
const bookingForm = document.getElementById('booking-form');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Booking page initialized');
    loadCategories();
    setupEventListeners();
});

function setupEventListeners() {
    btnBack.addEventListener('click', () => {
        if (bookingState.currentStep > 1) {
            goToStep(bookingState.currentStep - 1);
        }
    });

    btnNext.addEventListener('click', () => {
        if (bookingState.currentStep < 5) {
            goToStep(bookingState.currentStep + 1);
        } else {
            // Submit booking
            submitBooking();
        }
    });

    btnPrevMonth.addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        generateCalendar();
    });

    btnNextMonth.addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        generateCalendar();
    });
}

// ===== NAVIGATION =====
function goToStep(step) {
    bookingState.currentStep = step;
    
    // Update progress indicators
    progressSteps.forEach((el, idx) => {
        if (idx < step - 1) {
            el.classList.add('completed');
            el.classList.remove('active');
        } else if (idx === step - 1) {
            el.classList.add('active');
            el.classList.remove('completed');
        } else {
            el.classList.remove('active', 'completed');
        }
    });
    
    // Update content sections
    stepContents.forEach((section, idx) => {
        section.classList.toggle('active', idx === step - 1);
    });
    
    // Update buttons
    btnBack.style.display = step > 1 ? 'block' : 'none';
    
    if (step === 5) {
        btnNext.textContent = '✓ Confirmar Reserva';
        updateSummaryPreview();
    } else {
        btnNext.textContent = 'Siguiente →';
    }
    
    // Load data for step
    if (step === 2 && bookingState.selectedCategory) {
        loadServicesByCategory(bookingState.selectedCategory.id);
    } else if (step === 3) {
        generateCalendar();
    } else if (step === 4 && bookingState.selectedDate) {
        loadTimeSlots();
    }
    
    updateNextButton();
}

function updateNextButton() {
    const step = bookingState.currentStep;
    let isValid = false;
    
    switch (step) {
        case 1:
            isValid = bookingState.selectedCategory !== null;
            break;
        case 2:
            isValid = bookingState.selectedService !== null;
            break;
        case 3:
            isValid = bookingState.selectedDate !== null;
            break;
        case 4:
            isValid = bookingState.selectedTime !== null;
            break;
        case 5:
            // Check form validity
            const form = document.getElementById('booking-form');
            isValid = form.checkValidity();
            break;
    }
    
    btnNext.disabled = !isValid;
}

// ===== STEP 1: LOAD CATEGORIES =====
async function loadCategories() {
    try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error('Error al cargar categorías');
        
        const categories = await res.json();
        
        if (categories.length === 0) {
            categoriesGrid.innerHTML = '<div class="empty-state">No hay categorías disponibles</div>';
            return;
        }
        
        categoriesGrid.innerHTML = categories.map(category => `
            <div class="category-card" data-category-id="${category.id}">
                <div class="category-icon">${category.icon || '🌿'}</div>
                <h3>${category.name}</h3>
                <p>${category.description || ''}</p>
            </div>
        `).join('');
        
        // Attach click handlers
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.categoryId;
                selectCategory(categoryId, categories);
            });
        });
        
    } catch (error) {
        console.error('Error:', error);
        categoriesGrid.innerHTML = '<div class="empty-state">❌ Error al cargar categorías</div>';
    }
}

function selectCategory(categoryId, categories) {
    // Remove previous selection
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
    
    // Add selection
    const card = document.querySelector(`[data-category-id="${categoryId}"]`);
    card.classList.add('selected');
    
    // Save to state
    bookingState.selectedCategory = categories.find(c => c.id === categoryId);
    
    updateNextButton();
}

// ===== STEP 2: LOAD SERVICES BY CATEGORY =====
async function loadServicesByCategory(categoryId) {
    servicesGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div>Cargando servicios...</div>';
    
    try {
        const res = await fetch(`${API_URL}/services`);
        if (!res.ok) throw new Error('Error al cargar servicios');
        
        const allServices = await res.json();
        const services = allServices.filter(s => s.categoryId === categoryId);
        
        if (services.length === 0) {
            servicesGrid.innerHTML = '<div class="empty-state">No hay servicios disponibles en esta categoría</div>';
            return;
        }
        
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card" data-service-id="${service.id}">
                <div class="service-icon">💆</div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-details">
                    <div class="service-price">₡${service.price.toLocaleString()}</div>
                    <div class="service-duration">⏱️ ${service.duration} min</div>
                </div>
            </div>
        `).join('');
        
        // Attach click handlers
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.dataset.serviceId;
                selectService(serviceId, services);
            });
        });
        
    } catch (error) {
        console.error('Error:', error);
        servicesGrid.innerHTML = '<div class="empty-state">❌ Error al cargar servicios</div>';
    }
}

function selectService(serviceId, services) {
    // Remove previous selection
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    
    // Add selection
    const card = document.querySelector(`[data-service-id="${serviceId}"]`);
    card.classList.add('selected');
    
    // Save to state
    bookingState.selectedService = services.find(s => s.id === serviceId);
    
    updateNextButton();
}

// ===== STEP 3: CALENDAR =====
function generateCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Update month display
    currentMonthEl.textContent = new Date(year, month).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Build calendar grid
    let html = '';
    
    // Day headers
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Calendar days (next 14 days only, exclude Sundays)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 14);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();
        
        // Disable past dates, Sundays (0), and dates beyond 14 days
        const isPast = date < today;
        const isSunday = dayOfWeek === 0;
        const isBeyondLimit = date > maxDate;
        const disabled = isPast || isSunday || isBeyondLimit;
        
        html += `<div class="calendar-day ${disabled ? 'disabled' : ''}" data-date="${dateStr}">${day}</div>`;
    }
    
    calendarGrid.innerHTML = html;
    
    // Attach click handlers
    document.querySelectorAll('.calendar-day:not(.disabled):not(.empty)').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            const dateStr = dayEl.dataset.date;
            selectDate(new Date(dateStr + 'T12:00:00'));
        });
    });
}

function selectDate(date) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    
    // Add selection
    const dateStr = date.toISOString().split('T')[0];
    const dayElement = document.querySelector(`[data-date="${dateStr}"]`);
    if (dayElement) {
        dayElement.classList.add('selected');
    }
    
    // Save to state
    bookingState.selectedDate = date;
    
    // Reset time selection
    bookingState.selectedTime = null;
    
    updateNextButton();
}

// ===== STEP 4: LOAD TIME SLOTS =====
async function loadTimeSlots() {
    if (!bookingState.selectedDate || !bookingState.selectedService) {
        timeSlotsGrid.innerHTML = '<div class="loading">Selecciona un servicio y fecha primero</div>';
        return;
    }
    
    timeSlotsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div>Cargando horarios...</div>';
    
    try {
        const dateStr = bookingState.selectedDate.toISOString().split('T')[0];
        const res = await fetch(`${API_URL}/bookings/available-slots?date=${dateStr}&serviceId=${bookingState.selectedService.id}`);
        
        if (!res.ok) throw new Error('Error al cargar horarios');
        
        const data = await res.json();
        const slots = data.availableSlots;
        
        if (slots.length === 0) {
            timeSlotsGrid.innerHTML = '<div class="empty-state">No hay horarios disponibles para esta fecha 😔<br>Por favor selecciona otro día</div>';
            return;
        }
        
        timeSlotsGrid.innerHTML = slots.map(time => `
            <div class="time-slot" data-time="${time}">
                ${time}
            </div>
        `).join('');
        
        // Attach click handlers
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                selectTime(slot.dataset.time);
            });
        });
        
    } catch (error) {
        console.error('Error:', error);
        timeSlotsGrid.innerHTML = '<div class="empty-state">❌ Error al cargar horarios</div>';
    }
}

function selectTime(time) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    
    // Add selection
    const slot = document.querySelector(`[data-time="${time}"]`);
    slot.classList.add('selected');
    
    // Save to state
    bookingState.selectedTime = time;
    
    updateNextButton();
}

// ===== STEP 5: SUMMARY & FORM =====
function updateSummaryPreview() {
    if (!bookingState.selectedService || !bookingState.selectedDate || !bookingState.selectedTime) {
        summaryPreview.innerHTML = '<div class="loading">Completa todos los pasos</div>';
        return;
    }
    
    const dateFormatted = bookingState.selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    summaryPreview.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Categoría:</span>
            <span class="summary-value">${bookingState.selectedCategory.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Servicio:</span>
            <span class="summary-value">${bookingState.selectedService.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Fecha:</span>
            <span class="summary-value">${dateFormatted}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Hora:</span>
            <span class="summary-value">${bookingState.selectedTime}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Duración:</span>
            <span class="summary-value">${bookingState.selectedService.duration} minutos</span>
        </div>
        <div class="summary-item">
            <span class="summary-label summary-total">Total:</span>
            <span class="summary-value summary-total">₡${bookingState.selectedService.price.toLocaleString()}</span>
        </div>
    `;
}

// Add form validation listener
if (bookingForm) {
    bookingForm.addEventListener('input', () => {
        updateNextButton();
    });
}

// ===== SUBMIT BOOKING =====
async function submitBooking() {
    if (!bookingForm.checkValidity()) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    const formData = new FormData(bookingForm);
    const customerName = formData.get('customerName');
    const customerEmail = formData.get('customerEmail');
    const customerPhone = formData.get('customerPhone');
    const notes = formData.get('notes');
    
    const bookingData = {
        serviceId: bookingState.selectedService.id,
        date: bookingState.selectedDate.toISOString().split('T')[0],
        startTime: bookingState.selectedTime,
        customerName,
        customerEmail, // Enviar email como campo separado
        customerPhone,
        notes // Notas opcionales del cliente
    };
    
    btnNext.disabled = true;
    btnNext.textContent = '⏳ Procesando...';
    
    try {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear la reserva');
        }
        
        const result = await res.json();
        
        // Show success message
        document.querySelector('.booking-card').innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">✅</div>
                <h2 style="color: var(--primary); font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 1rem;">
                    ¡Solicitud de Reserva Recibida!
                </h2>
                <p style="color: var(--gray); font-size: 1.1rem; margin-bottom: 2rem;">
                    Tu reserva está pendiente de confirmación.
                </p>

                <!-- Payment Instructions -->
                <div style="background: linear-gradient(135deg, #FFF9E6 0%, #FFE8B3 100%); border-left: 4px solid var(--secondary); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; text-align: left;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="font-size: 2.5rem;">💳</div>
                        <h3 style="color: var(--secondary); margin: 0; font-size: 1.3rem;">Paso Siguiente: Confirmar con SINPE Móvil</h3>
                    </div>
                    <p style="color: #5D4E37; line-height: 1.6; margin-bottom: 1rem;">
                        Para <strong>confirmar tu cita</strong>, debes realizar una transferencia de:
                    </p>
                    <div style="text-align: center; background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--secondary);">₡5,000</div>
                        <div style="color: #5D4E37; font-size: 0.9rem;">Anticipo por SINPE Móvil</div>
                    </div>
                    <p style="color: #5D4E37; line-height: 1.6; margin-bottom: 0.5rem;">
                        📱 <strong>Te enviaremos a tu teléfono (${customerPhone})</strong> y correo (${customerEmail}) las instrucciones detalladas con:
                    </p>
                    <ul style="color: #5D4E37; margin-left: 1.5rem; line-height: 1.8;">
                        <li>Número de teléfono para SINPE Móvil</li>
                        <li>Código de referencia de tu reserva</li>
                        <li>Fecha límite para realizar el pago</li>
                    </ul>
                </div>

                <div style="background: var(--primary-light); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; text-align: left;">
                    <h3 style="color: var(--primary); margin-bottom: 1rem;">📋 Detalles de tu cita:</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>Servicio:</strong> ${bookingState.selectedService.name}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Fecha:</strong> ${bookingState.selectedDate.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Hora:</strong> ${bookingState.selectedTime}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Duración:</strong> ${bookingState.selectedService.duration} minutos</p>
                    <p style="margin-bottom: 0;"><strong>Precio Total:</strong> ₡${bookingState.selectedService.price.toLocaleString()}</p>
                    <p style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--primary); font-size: 0.9rem; color: var(--gray);">
                        <strong>Anticipo:</strong> ₡5,000 | <strong>Restante:</strong> ₡${(bookingState.selectedService.price - 5000).toLocaleString()} (a pagar en el spa)
                    </p>
                </div>

                <div style="background: #F0F7FF; border-left: 4px solid #4A90E2; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; text-align: left;">
                    <p style="color: #2C5282; line-height: 1.6; margin: 0; font-size: 0.95rem;">
                        💡 <strong>Importante:</strong> Tu reserva quedará <strong>confirmada</strong> una vez que procesemos tu pago SINPE. 
                        Recibirás una confirmación final por correo y WhatsApp.
                    </p>
                </div>

                <a href="/" class="btn btn-primary" style="text-decoration: none;">✨ Volver al Inicio</a>
            </div>
        `;
        
        // Hide navigation buttons
        btnNext.style.display = 'none';
        btnBack.style.display = 'none';
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al crear la reserva: ' + error.message);
        btnNext.disabled = false;
        btnNext.textContent = '✓ Confirmar Reserva';
    }
}
