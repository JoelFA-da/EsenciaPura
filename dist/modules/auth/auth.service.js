"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
class AuthService {
    async register(data) {
        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existing) {
            throw new Error('El email ya está registrado');
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: 'admin'
            }
        });
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async login(data) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        // Verify password
        const validPassword = await bcryptjs_1.default.compare(data.password, user.password);
        if (!validPassword) {
            throw new Error('Credenciales inválidas');
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return decoded;
        }
        catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
}
exports.authService = new AuthService();
