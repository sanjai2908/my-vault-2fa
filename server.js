require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Auth routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

// User routes
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/user", userRoutes);

// File routes
const fileRoutes = require("./src/routes/fileRoutes");
app.use("/api/files", fileRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
