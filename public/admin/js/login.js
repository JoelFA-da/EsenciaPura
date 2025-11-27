// ==========================================
// LOGIN FUNCTIONALITY
// ==========================================

const API_URL = window.location.origin;

// DOM Elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const errorMessage = document.getElementById('error-message');

// Check if already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp && payload.exp * 1000 > Date.now()) {
                // Token válido, redirigir al dashboard
                window.location.replace('/admin/index.html');
                return true;
            }
        } catch (error) {
            // Token inválido, limpiar
            localStorage.removeItem('token');
        }
    }
    return false;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate
    if (!email || !password) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    // Disable button
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }
        
        // Save token
        localStorage.setItem('token', data.token);
        
        // Redirect to dashboard
        window.location.replace('/admin/index.html');
        
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Credenciales inválidas. Verifica tu email y contraseña.');
        
        // Re-enable button
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar Sesión';
    }
}

// Event listeners
loginForm.addEventListener('submit', handleLogin);

// Check auth on page load
checkAuth();

// Allow Enter key to submit
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin(e);
    }
});

console.log('🔐 Login page ready');
