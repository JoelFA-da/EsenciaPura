"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
const logger_1 = require("../utils/logger");
function errorHandler() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (err, _req, res, _next) => {
        if (err instanceof AppError_1.AppError) {
            logger_1.logger.warn({ err }, 'AppError');
            return res.status(err.statusCode).json({ error: err.message, details: err.details });
        }
        logger_1.logger.error({ err }, 'Unhandled error');
        return res.status(500).json({ error: 'Internal Server Error' });
    };
}
