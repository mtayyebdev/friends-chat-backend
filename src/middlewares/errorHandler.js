// All errors handler logic...
const errorHandler = async (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something Went Wrong!";

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Optionally include stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export {errorHandler};