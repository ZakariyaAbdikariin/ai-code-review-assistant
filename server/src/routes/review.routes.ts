import { Router } from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = "supersecretkey"; // later move to .env

// -------------------------
// 🔐 AUTH MIDDLEWARE
// -------------------------
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// -------------------------
// 🤖 CREATE AI REVIEW (USER-BOUND)
// -------------------------
router.post("/review", authMiddleware, async (req: any, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    // 1. Call Ollama
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "codellama",
      prompt: `
You are a senior software engineer.

Review this code:
${code}

Return:
- bugs
- improvements
- explanation
      `,
      stream: false,
    });

    const aiResult = response.data.response;

    // 2. Save per user
    const saved = await prisma.review.create({
      data: {
        code,
        result: aiResult,
        userId: req.userId,
      },
    });

    res.json({
      id: saved.id,
      review: aiResult,
    });
  } catch (error: any) {
    console.error("AI ERROR:", error.message);

    res.status(500).json({
      error: "AI review failed",
    });
  }
});

// -------------------------
// 📜 GET USER HISTORY
// -------------------------
router.get("/reviews", authMiddleware, async (req: any, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;
