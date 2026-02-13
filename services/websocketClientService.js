import { io as ioClient } from "socket.io-client";

class WebSocketClientService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  initialize() {
    try {
      const selfinotifyUrl =
        process.env.SELFINOTIFY_URL || "http://localhost:3003";

      this.socket = ioClient(selfinotifyUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        connectTimeout: 45000,
        transports: ["polling", "websocket"],
      });

      this.socket.on("connect", () => {
        this.connected = true;
        console.info("✅ WebSocket client connected to Selfi-Notify");
      });

      this.socket.on("disconnect", () => {
        this.connected = false;
        console.warn("⚠️ WebSocket client disconnected from Selfi-Notify");
      });

      this.socket.on("error", (error) => {
        console.error("❌ WebSocket client error:", error);
      });
    } catch (error) {
      console.error("Failed to initialize WebSocket client:", error);
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }

  notifyDashboard(event, data) {
    if (!this.isConnected()) {
      console.warn(
        "⚠️ WebSocket not connected. Skipping notification for event:",
        event,
      );
      return;
    }

    try {
      this.socket.emit(event, data);
      console.info(`📡 Dashboard notification sent: ${event}`);
    } catch (error) {
      console.error(
        `Failed to send dashboard notification for ${event}:`,
        error,
      );
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new WebSocketClientService();
