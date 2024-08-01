const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the cors middleware
const rateLimit = require("express-rate-limit"); // Import the express-rate-limit middleware
const { connectDB } = require("./config/db");
const { syncModels } = require("./models");
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const applicationRoutes = require("./routes/applications");
const adminRoutes = require("./routes/admin");
const reportRoutes = require("./routes/report");

dotenv.config();

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Synchronize models with the database
    await syncModels();

    // Create Express app
    const app = express();

    // Use CORS middleware to accept requests from all origins
    app.use(cors());

    // Middleware to parse JSON
    app.use(express.json());

    // Configure rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });

    // Apply rate limiting middleware to all requests
    app.use(limiter);

    // Define routes
    app.use("/auth", authRoutes);
    app.use("/admin", adminRoutes);
    app.use("/listings", listingRoutes);
    app.use("/applications", applicationRoutes);
    app.use("/reports", reportRoutes);

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
