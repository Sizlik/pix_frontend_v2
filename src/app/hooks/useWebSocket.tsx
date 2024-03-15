import { useEffect, useState } from "react";

export default function useWebSocket(url: string, onmessage: (event: MessageEvent) => void) {
  const [socket, setSocket] = useState<WebSocket>()

  useEffect(() => {
    socket?.close()
    if (!socket) {
      const newSocket = new WebSocket(url)
      newSocket.onmessage = onmessage
      setSocket(newSocket)
    }
  }, [url])

  return socket
}