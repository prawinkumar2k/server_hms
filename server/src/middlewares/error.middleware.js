const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const sendErrorDev = (err, req, res) => {
    // Log the error for server-side debugging
    logger.error(`[DEV ERROR] ${req.method} ${req.originalUrl}`, {
        message: err.message,
        stack: err.stack,
        error: err
    });

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Programming or other unknown error: don't leak error details
        // 1) Log error
        logger.error('ERROR 💥', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        sendErrorProd(error, res);
    } else {
        // Fallback for other environments or if NODE_ENV is not set
        sendErrorDev(err, req, res);
    }
};
