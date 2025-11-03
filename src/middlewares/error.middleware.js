// src/middlewares/error.middleware.js
const errorMiddleware = (err, req, res, next) => {
  console.error('[ERRO GLOBAL]', err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Algo correu muito mal no servidor!',
  });
};
module.exports = errorMiddleware;