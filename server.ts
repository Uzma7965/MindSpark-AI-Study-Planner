import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazy/safe
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. Generate Custom AI Study Roadmap
  app.post("/api/ai/generate-roadmap", async (req, res) => {
    try {
      const { topic, days = 30, examDate = "2026-08-30" } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const ai = getGeminiClient();

      const prompt = `Create a realistic, highly effective step-by-step study roadmap for the subject: "${topic}". Total preparation timeframe is ${days} days leading to target exam date ${examDate}. Divide into 3 sequential modules, each with 3 specific subtopics, estimated study hours, and title.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert AI Study Planner. Create structured, highly practical learning roadmaps for students and software engineers.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              targetExam: { type: Type.STRING },
              modules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    topics: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          estimatedHours: { type: Type.NUMBER },
                        },
                        required: ["name", "estimatedHours"],
                      },
                    },
                  },
                  required: ["title", "duration", "topics"],
                },
              },
            },
            required: ["title", "targetExam", "modules"],
          },
        },
      });

      const parsedData = JSON.parse(response.text || "{}");
      return res.json({ success: true, roadmap: parsedData });
    } catch (err: any) {
      console.error("Roadmap generation error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI roadmap",
      });
    }
  });

  // 2. AI Mentor Assistant Chat
  app.post("/api/ai/mentor-chat", async (req, res) => {
    try {
      const { message, activeSubject = "Data Structures & Algorithms", history = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGeminiClient();

      const formattedHistory = history.map((h: any) => `${h.sender === 'user' ? 'Student' : 'AI Mentor'}: ${h.text}`).join('\n');
      
      const prompt = `Current Subject Context: ${activeSubject}\n\nRecent Conversation:\n${formattedHistory}\n\nStudent: ${message}\n\nProvide a friendly, highly encouraging, clear answer. If code or algorithmic concepts are involved, provide formatted code snippets or structured bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are 'MindSpark AI Mentor', an elite academic tutor and coding coach. Your answers are clear, encouraging, structured, and visually clean with markdown and code blocks when appropriate.",
        },
      });

      return res.json({
        success: true,
        reply: response.text || "I am here to help with your study session!",
      });
    } catch (err: any) {
      console.error("AI Mentor error:", err);
      return res.status(500).json({
        error: err.message || "Failed to get AI response",
      });
    }
  });

  // 3. Smart Notes AI Summarizer & Flashcard Generator
  app.post("/api/ai/smart-notes", async (req, res) => {
    try {
      const { noteContent, action = "summarize" } = req.body;
      if (!noteContent) {
        return res.status(400).json({ error: "Note content is required" });
      }

      const ai = getGeminiClient();

      if (action === "quiz") {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Generate 3 high-yield practice flashcards based on this study note content:\n\n${noteContent}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ["question", "answer"],
              },
            },
          },
        });
        const flashcards = JSON.parse(response.text || "[]");
        return res.json({ success: true, flashcards });
      } else {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Provide a 2-3 sentence executive study summary and 3 key takeaway bullet points for these study notes:\n\n${noteContent}`,
          config: {
            systemInstruction: "You summarize technical and academic study material concisely.",
          },
        });
        return res.json({ success: true, summary: response.text });
      }
    } catch (err: any) {
      console.error("Smart notes error:", err);
      return res.status(500).json({
        error: err.message || "Failed to process smart notes",
      });
    }
  });

  // Vite middleware for development / Production static serving
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
    console.log(`MindSpark server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
