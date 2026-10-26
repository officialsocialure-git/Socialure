function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const statusCode = Number(err.statusCode || err.status) || 500;
  const isServerError = statusCode >= 500;
  if (isServerError) console.error(err);
  res.status(statusCode).json({
    success: false,
    message: isServerError ? "An unexpected server error occurred." : (err.message || "Request failed."),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}
module.exports = errorHandler;
