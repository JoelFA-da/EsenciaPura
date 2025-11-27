"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const zod_1 = require("zod");
const AppError_1 = require("../../common/errors/AppError");
const auth_service_1 = require("./auth.service");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(1)
});
async function register(req, res) {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success)
            throw new AppError_1.AppError('Datos inválidos', 422, parsed.error.flatten());
        const user = await auth_service_1.authService.register(parsed.data);
        return res.status(201).json({ user });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error al registrar usuario' });
    }
}
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
async function login(req, res) {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success)
            throw new AppError_1.AppError('Credenciales inválidas', 422, parsed.error.flatten());
        const session = await auth_service_1.authService.login(parsed.data);
        return res.status(200).json(session);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}
