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
import { GoogleGenAI } from "@google/genai"
import twilio from "twilio"

const router = express.Router()

const GEMINI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
});
const model = "gemini-2.5-flash";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const phoneNumber = process.env.MY_PHONE_NUMBER;

router.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;
    const prompt = messages.map((m: any) => {
      return m.role + ": " + m.content;
    }).join("\n") + "\nassistant: ";

    const result = await genAI.models.generateContent({
        model: model,
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

router.post('/api/twilio-webhook', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { EventType, ConversationSid, Author, Body } = req.body;
    
    if (EventType === 'onMessageAdded' && Author.includes('whatsapp:' + phoneNumber)) {
      const prompt = `user: ${Body}\nassistant:`;
      const result = await genAI.models.generateContent({
        model: model,
        contents: prompt
      });
      const responseMessage = result.text;
      
      await twilioClient.conversations.v1
        .conversations(ConversationSid)
        .messages.create({
          author: "whatsapp:" + twilioPhoneNumber,
          body: responseMessage
        });
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

export default router