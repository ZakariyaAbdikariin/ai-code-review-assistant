import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import reviewRoutes from "./routes/review.routes";
import authRoutes from "./routes/auth.routes"; // ✅ ADD THIS

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🟢 health check
app.get("/", (req, res) => {
  res.json({ message: "AI Code Review API is running 🚀" });
});

// 🔐 AUTH ROUTES
app.use("/api/auth", authRoutes);

// 🤖 AI REVIEW ROUTES
app.use("/api", reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
