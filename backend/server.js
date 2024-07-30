const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the cors middleware
const { connectDB } = require("./config/db");
const { syncModels } = require("./models");
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const applicationRoutes = require("./routes/applications");

dotenv.config();

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Synchronize models with the database
    await syncModels();

    // Create Express app
    const app = express();

    // Use CORS middleware with custom options
    const corsOptions = {
      origin: "http://localhost:3000", // Allow only this origin
      optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    };
    app.use(cors(corsOptions));

    // Middleware to parse JSON
    app.use(express.json());

    // Define routes
    app.use("/api/auth", authRoutes);
    app.use("/api/listings", listingRoutes);
    app.use("/api/applications", applicationRoutes);

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
