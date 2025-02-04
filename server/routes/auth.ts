import { Router } from 'express'
import { prisma } from '../utils/prisma'

const router = Router()

router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.create({ data: { email, password } })
  res.json(user)
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (user?.password === password) res.json(user)
  else res.status(401).json({ error: 'Invalid credentials' })
})

export default router