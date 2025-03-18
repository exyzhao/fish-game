import http from 'http'
import express, { Request, Response } from 'express'
import { initWebSockets } from '../sockets'

const app = express()

app.get('/api/ping', (req: Request, res: Response) => {
  res.send('pong')
})

const server = http.createServer(app)
initWebSockets(server)

server.listen(4000, () => {
  console.log('Express server is running on port 4000')
})
