import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocket = (onMessage: (msg: IMessage) => void) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket connected");
        client.subscribe("/topic/chart-updates", onMessage);
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    // ✅ Synchronous cleanup with async inside
    return () => {
      if (clientRef.current) {
        // async inside synchronous wrapper
        clientRef.current.deactivate().catch(console.error);
      }
    };
  }, [onMessage]);

  return {
    sendMessage: (destination: string, payload: any) => {
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.publish({
          destination,
          body: JSON.stringify(payload),
        });
      }
    },
  };
};

export default useWebSocket;
