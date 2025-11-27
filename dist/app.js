"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./common/middleware/errorHandler");
const requestLogger_1 = require("./common/middleware/requestLogger");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const services_routes_1 = __importDefault(require("./modules/services/services.routes"));
const bookings_routes_1 = __importDefault(require("./modules/bookings/bookings.routes"));
const categories_routes_1 = require("./modules/categories/categories.routes");
function createApp() {
    const app = (0, express_1.default)();
    // Helmet con configuración para permitir recursos inline (CSS, fonts, scripts)
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                scriptSrcAttr: ["'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
            },
        },
    }));
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use((0, requestLogger_1.requestLogger)());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 1000, // Aumentado para desarrollo
        standardHeaders: true,
        legacyHeaders: false
    }));
    // Servir archivos estáticos (frontend)
    app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
    // Health check
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // API Routes
    app.use('/auth', auth_routes_1.default);
    app.use('/categories', categories_routes_1.categoriesRoutes);
    app.use('/services', services_routes_1.default);
    app.use('/bookings', bookings_routes_1.default);
    // Servir index.html para todas las rutas no-API (SPA fallback)
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
    });
    app.use((0, errorHandler_1.errorHandler)());
    return app;
}
