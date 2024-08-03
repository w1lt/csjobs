const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { syncModels } = require("./models");
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const applicationRoutes = require("./routes/applications");
const adminRoutes = require("./routes/admin");
const reportRoutes = require("./routes/report");
const fileRoutes = require("./routes/file");

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

    // Define routes
    app.use("/auth", authRoutes);
    app.use("/admin", adminRoutes);
    app.use("/listings", listingRoutes);
    app.use("/applications", applicationRoutes);
    app.use("/reports", reportRoutes);
    app.use("/file", fileRoutes);

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
