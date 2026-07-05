import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reviewRoutes from "./routes/review.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "AI Code Review API is running 🚀" });
});

app.use("/api", reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
