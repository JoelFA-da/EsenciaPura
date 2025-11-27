"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const AppError_1 = require("../errors/AppError");
function authenticate(req, res, next) {
    try {
        const authRequest = req;
        const authHeader = authRequest.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError_1.AppError('No se proporcionó token de autenticación', 401);
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.env.JWT_SECRET);
            authRequest.userId = decoded.userId;
            authRequest.userEmail = decoded.email;
            next();
        }
        catch (error) {
            throw new AppError_1.AppError('Token inválido o expirado', 401);
        }
    }
    catch (error) {
        next(error);
    }
}
