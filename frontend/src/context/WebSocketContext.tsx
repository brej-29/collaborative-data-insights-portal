import React, { createContext, useContext, useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChartUpdateMessage } from "../types";

type WebSocketContextType = {
  sendMessage: (msg: ChartUpdateMessage) => void;
  registerChartHandler: (
    chartId: string,
    handler: (msg: ChartUpdateMessage) => void
  ) => void;
  unregisterChartHandler: (chartId: string) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null);
  const handlersRef = useRef<Record<string, (msg: ChartUpdateMessage) => void>>({});

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {}, // Disable logs
      onConnect: () => {
        client.subscribe("/topic/chart-updates", (message) => {
          const msg: ChartUpdateMessage = JSON.parse(message.body);
          const handler = handlersRef.current[msg.chartId];
          if (handler) handler(msg);
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate().catch(console.error);
      }
    };
  }, []);

  const sendMessage = (msg: ChartUpdateMessage) => {
    if (clientRef.current?.connected) {
      clientRef.current?.publish({
  destination: "/app/chart-update",
  body: JSON.stringify(msg),
});

    }
  };

  const registerChartHandler = (chartId: string, handler: (msg: ChartUpdateMessage) => void) => {
    handlersRef.current[chartId] = handler;
  };

  const unregisterChartHandler = (chartId: string) => {
    delete handlersRef.current[chartId];
  };

  return (
    <WebSocketContext.Provider
      value={{ sendMessage, registerChartHandler, unregisterChartHandler }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocketContext must be used within WebSocketProvider");
  return ctx;
};

// ✅ Required for TypeScript isolatedModules setting
export {};
