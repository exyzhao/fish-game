import http from 'http'
import express, { Application, Request, Response } from 'express'
import { initWebSockets } from '../sockets'

const app: Application = express()

app.get('/api/ping', (req: Request, res: Response) => {
  res.send('pong')
})

const server = http.createServer(app)
initWebSockets(server)

const PORT = 4000
server.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`)
})
