import { Router } from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/review
 * Generate AI review + save to DB
 */
router.post("/review", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    // 1. Call Ollama
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2:1b",
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

    // 2. Save to DB
    const saved = await prisma.review.create({
      data: {
        code,
        result: aiResult,
      },
    });

    // 3. Return response
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

/**
 * GET /api/reviews
 * Fetch all reviews
 */
router.get("/reviews", async (req, res) => {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(reviews);
});

export default router;
