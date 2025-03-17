import express, { Request, Response } from 'express'

const app = express()

app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'PONG' })
})

app.listen(4000, () => {
  console.log('Express server is running on port 4000')
})
