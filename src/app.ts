import express from 'express'
import geminiRouter from './routers/gemini'

const app = express()

app.use(express.json())
app.use(geminiRouter)

export default app