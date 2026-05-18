import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.ts";
import apiRoutes from "./src/routes/api.ts";
import paymentRoutes from "./src/routes/payment.ts";

// Load env vars
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined. Database features will not work.");
} else {
  const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ":****@");
  console.log(`Connecting to MongoDB...`);
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout for better feedback
    socketTimeoutMS: 45000,
  })
    .then(() => {
      console.log("------------------------------------------");
      console.log("SUCCESS: MongoDB connected successfully");
      console.log("------------------------------------------");
    })
    .catch(err => {
      console.error("------------------------------------------");
      console.error("CRITICAL ERROR: MongoDB connection failed");
      console.error(`Error name: ${err.name}`);
      console.error(`Error message: ${err.message}`);
      
      if (err.name === 'MongooseServerSelectionError' || err.message.includes("Could not connect to any servers")) {
        console.error("\nSTUCK? This is almost certainly an IP Whitelist issue.");
        console.error("1. Go to MongoDB Atlas: https://cloud.mongodb.com/");
        console.error("2. Go to 'Network Access' on the left sidebar.");
        console.error("3. Click 'Add IP Address'.");
        console.error("4. Select 'Allow Access From Anywhere' (Adds 0.0.0.0/0).");
        console.error("5. Click 'Confirm' and wait 1 min for it to deploy.");
        console.error("\nAfter doing this, the app will automatically connect.");
      }
      console.error("------------------------------------------");
    });
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/payment", paymentRoutes);

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
