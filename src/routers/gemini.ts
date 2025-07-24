import express from 'express'
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || '',
});
const router = express.Router()

router.post('/gemini/generateContent', async (req, res) => {
    // const response = await ai.models.generateContent({
    //     model: "gemini-2.5-flash",
    //     contents: "Explain how AI works in a few words",
    // });
    try {
        const response = await ai.models.generateContent(req.body)
        res.status(200).send(response)
    } catch (e: any) {
        res.status(500).send(JSON.parse(e.message))
    }
})

export default router
