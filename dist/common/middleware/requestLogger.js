"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logger_1 = require("../utils/logger");
function requestLogger() {
    return (req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const ms = Date.now() - start;
            logger_1.logger.info({ method: req.method, url: req.originalUrl, status: res.statusCode, ms });
        });
        next();
    };
}
