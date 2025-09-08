// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * @brief Utility function to send standardized API responses
 */
const sendResponse = (res, status, payload) => {
  res.status(status).json(payload);
};

/**
 * @brief Validate required environment variables
 */
const validateEnv = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY in .env file");
    process.exit(1);
  }
};
validateEnv();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * @brief Chat endpoint using OpenAI GPT-4o-mini
 */
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return sendResponse(res, 400, { error: "'message' field is required." });

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: message,
      store: true,
    });

    const reply = response.output_text || "Sorry, no response generated.";
    return sendResponse(res, 200, { reply });
  } catch (err) {
    console.error("🔥 OpenAI error:", err);
    return sendResponse(res, 500, { error: "Server error. Please try again later." });
  }
});

/**
 * @brief Health check endpoint
 */
app.get("/health", (req, res) => {
  sendResponse(res, 200, { status: "ok", uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
