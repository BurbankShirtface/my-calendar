const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      details: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  // Handle MongoDB connection errors
  if (err.name === "MongooseError" || err.name === "MongoServerError" || err.name === "MongoNetworkError") {
    return res.status(503).json({
      message: "Database connection error",
      error: "Unable to connect to database. Please check your MongoDB connection.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
  });
};

module.exports = errorHandler;
