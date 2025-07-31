// import express from 'express'
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY || '',
// });
// const router = express.Router()

// router.post('/gemini/generateContent', async (req, res) => {
//     // const response = await ai.models.generateContent({
//     //     model: "gemini-2.5-flash",
//     //     contents: "Explain how AI works in a few words",
//     // });
//     try {
//         const response = await ai.models.generateContent(req.body)
//         res.status(200).send(response)
//     } catch (e: any) {
//         res.status(500).send(JSON.parse(e.message))
//     }
// })

// export default router



import express from 'express'
import { GoogleGenAI } from "@google/genai";

const router = express.Router()

const GEMINI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
});

router.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;
    const prompt = messages
      .filter((m: any) => m.role === "user")
      .map((m: any) => m.content)
      .join("\n");

    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    const geminiText = result.text;

    res.json({
        message: {
            role: "assistant",
            content: geminiText
        },
        done: true,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from Gemini API" });
  }
});

export default router