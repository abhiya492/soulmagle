import { Router } from 'express'
import { OpenAI } from 'openai'
import { prisma } from '../utils/prisma'

const router = Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

router.post('/process-audio', async (req, res) => {
  try {
    const { audio, userId } = req.body
    const text = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
    })
    
    const embedding = await openai.embeddings.create({
      input: text as string,
      model: 'text-embedding-ada-002',
    })

    await prisma.$executeRaw`
      UPDATE "User"
      SET embedding = ${JSON.stringify(embedding.data[0].embedding)}::vector
      WHERE id = ${userId}
    `

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Audio processing failed' })
  }
})

router.get('/find-match', async (req, res) => {
  const { userId } = req.query
  const matches = await prisma.$queryRaw`
    SELECT *, embedding <-> (SELECT embedding FROM "User" WHERE id = ${userId}) AS distance
    FROM "User"
    WHERE id != ${userId}
    ORDER BY distance
    LIMIT 1
  `
  res.json(matches[0])
})

export default router