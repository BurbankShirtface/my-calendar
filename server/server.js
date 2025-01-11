const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require("dns");

const app = express();

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

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/projects", require("./routes/projects"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

dns.lookup("montgomery-construction-calendar.onrender.com", (err, address) => {
  if (err) {
    console.log("DNS lookup error:", err);
    return;
  }
  console.log("Render IP address:", address);
});
