const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Meta API specific errors
  if (err.code === 'ENOTFOUND' && err.hostname && err.hostname.includes('graph.facebook.com')) {
    return res.status(503).json({
      error: 'Meta API service unavailable',
      message: 'Unable to connect to Meta Graph API'
    });
  }

  // Validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests to Meta API'
    });
  }

  // Meta API errors
  if (err.response && err.response.data && err.response.data.error) {
    const metaError = err.response.data.error;
    return res.status(err.response.status || 400).json({
      error: 'Meta API error',
      type: metaError.type,
      message: metaError.message,
      code: metaError.code
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler; 