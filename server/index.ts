import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { prisma } from './utils/prisma'
import authRoutes from './routes/auth'
import matchRoutes from './routes/match'

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/match', matchRoutes)

// WebRTC Signaling
io.on('connection', (socket) => {
  socket.on('offer', data => socket.broadcast.emit('offer', data))
  socket.on('answer', data => socket.broadcast.emit('answer', data))
  socket.on('candidate', data => socket.broadcast.emit('candidate', data))
})

server.listen(5000, () => console.log('Server running on port 5000'))