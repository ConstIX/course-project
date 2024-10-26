class WebSocketService {
  private socket: WebSocket | null = null

  connect(url: string) {
    this.socket = new WebSocket(url)
    this.socket.onopen = () => console.log('WebSocket connected')
    this.socket.onclose = () => console.log('WebSocket disconnected')
  }

  subscribe(callback: any) {
    if (this.socket) {
      this.socket.onmessage = (event) => callback(JSON.parse(event.data))
    }
  }

  disconnect() {
    this.socket?.close()
  }
}

export const websocketService = new WebSocketService()
