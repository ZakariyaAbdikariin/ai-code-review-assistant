import { Router } from "express";
import axios from "axios";

const router = Router();

router.post("/review", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "codellama",
      prompt: `
You are a senior software engineer.

Review this code:
${code}

Give:
- bugs
- improvements
- explanation
      `,
      stream: false,
    });

    res.json({
      review: response.data.response,
    });
  } catch (error: any) {
    console.error("OLLAMA ERROR:", error.message);

    res.status(500).json({
      error: "AI review failed",
    });
  }
});

export default router;
