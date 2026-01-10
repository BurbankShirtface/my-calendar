const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import middleware
const limiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

const app = express();

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://montgomery-construction-calendar-front.onrender.com",
      "https://montgomery-construction-calendar.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Apply rate limiter
app.use("/api/", limiter);

// Request logging
app.use(requestLogger);

app.use(express.json());

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set!");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. MongoDB is running (if using local MongoDB)');
    console.error('   2. MONGODB_URI is correct in your .env file');
    console.error('   3. Your network/firewall allows the connection\n');
    process.exit(1); // Exit if we can't connect
  }
};

// Middleware to check MongoDB connection before handling requests
const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection unavailable",
      error: "MongoDB is not connected. Please check your database connection.",
    });
  }
  next();
};

// Connect to database
connectDB();

// Routes - add connection check middleware
app.use("/api/projects", checkMongoConnection, require("./routes/projects"));

// Error handling should be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
