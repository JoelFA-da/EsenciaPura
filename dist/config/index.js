"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function requireEnv(name, defaultValue) {
    const value = process.env[name] || defaultValue;
    if (!value)
        throw new Error(`Falta variable de entorno: ${name}`);
    return value;
}
exports.env = {
    PORT: Number(requireEnv('PORT', '3000')),
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_SECRET: requireEnv('JWT_SECRET', 'esenciapura-secret-key-2025'),
    BUSINESS_EMAIL: requireEnv('BUSINESS_EMAIL', 'Esenciapuraluz.09@gmail.com')
};
