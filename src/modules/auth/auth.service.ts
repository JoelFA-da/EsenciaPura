interface RegisterInput { email: string; password: string; name: string }
interface LoginInput { email: string; password: string }

// Servicio temporal (stub). Sustituir por lógica real con hashing y DB.
class AuthService {
  async register(data: RegisterInput) {
    return { id: 'u_' + Date.now(), email: data.email, name: data.name };
  }
  async login(data: LoginInput) {
    // Siempre retorna token falso; reemplazar con JWT real.
    return { token: 'fake-jwt-token', email: data.email };
  }
}

export const authService = new AuthService();
