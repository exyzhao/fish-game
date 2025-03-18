import { useEffect, useRef, useState } from 'react'

import { ClientEventMap } from '../../../common/messages/clientMessages'

export type SendMessageFunction = <E extends keyof ClientEventMap>(
  event: E,
  data: ClientEventMap[E],
) => void

const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server')
      setIsConnected(true)
    }

    ws.current.onmessage = (event) => {
      console.log('Message received:', event.data)
      setMessages((prev) => [...prev, event.data])
    }

    ws.current.onclose = () => {
      console.log('WebSocket connection closed')
      setIsConnected(false)
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      ws.current?.close()
    }
  }, [url])

  const sendMessage: SendMessageFunction = (event, data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        event,
        data,
      }
      ws.current.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not open.')
    }
  }

  return { isConnected, messages, sendMessage }
}

export default useWebSocket
