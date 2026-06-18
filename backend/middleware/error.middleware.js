// AppError is a custom error class to handle operational errors cleanly
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Global Error Handling Middleware
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error in development

    let error = { ...err };
    error.message = err.message;

    // Handle MongoDB CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}: ${err.value}.`;
        error = new AppError(message, 400);
    }

    // Handle MongoDB Duplicate Fields
    if (err.code === 11000) {
        const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'Duplicate field';
        const message = `Duplicate field value: ${value}. Please use another value.`;
        error = new AppError(message, 400);
    }

    // Handle MongoDB Validation Error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        error = new AppError(message, 400);
    }

    // Handle JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Invalid token. Please log in again.', 401);
    }
    if (err.name === 'TokenExpiredError') {
        error = new AppError('Your token has expired. Please log in again.', 401);
    }

    // Send Response
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    } else {
        // Programming or other unknown error: don't leak error details
        return res.status(500).json({
            success: false,
            message: 'Internal server error! Something went wrong.'
        });
    }
};
