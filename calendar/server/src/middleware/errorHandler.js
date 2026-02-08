// Global error handler middleware
// Catches all errors and sends proper responses

const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Default error response
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // MySQL specific errors
  if (error.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'This record already exists';
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Invalid reference';
  }

  // Validation errors
  if (error.details) {
    statusCode = 400;
    message = error.details[0].message;
  }

  // Send error response
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: error.stack })
  });
};

module.exports = { errorHandler };
