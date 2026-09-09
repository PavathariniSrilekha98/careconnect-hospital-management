import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null);
  const subscriptionsRef = useRef(new Map());

  useEffect(() => {
    // Setup STOMP client using SockJS fallback
    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws-hospital'),
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.log('[STOMP Debug]:', str);
      },
      onConnect: () => {
        console.log('✅ WebSocket STOMP Connected');
        setConnected(true);

        // Global public display topic
        client.subscribe('/topic/public-display', (msg) => {
          try {
            const body = JSON.parse(msg.body);
            setLastEvent(body);
          } catch (e) {
            console.error('Error parsing public-display ws message:', e);
          }
        });

        // User personal notification topic if logged in
        if (user?.id) {
          client.subscribe(`/topic/notifications/${user.id}`, (msg) => {
            try {
              const body = JSON.parse(msg.body);
              setLastEvent(body);
              if (body.payload) {
                setNotifications((prev) => [body.payload, ...prev]);
              }
            } catch (e) {
              console.error('Error parsing user notification ws message:', e);
            }
          });
        }
      },
      onDisconnect: () => {
        console.log('❌ WebSocket STOMP Disconnected');
        setConnected(false);
      },
      onStompError: (frame) => {
        console.warn('STOMP Broker error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user?.id]);

  const subscribe = useCallback((topic, callback) => {
    if (!clientRef.current || !clientRef.current.connected) {
      // Retry once connected
      const timer = setTimeout(() => {
        if (clientRef.current && clientRef.current.connected) {
          const sub = clientRef.current.subscribe(topic, (msg) => {
            try {
              const body = JSON.parse(msg.body);
              callback(body);
            } catch (e) {
              callback(msg.body);
            }
          });
          subscriptionsRef.current.set(topic, sub);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }

    const sub = clientRef.current.subscribe(topic, (msg) => {
      try {
        const body = JSON.parse(msg.body);
        callback(body);
      } catch (e) {
        callback(msg.body);
      }
    });

    subscriptionsRef.current.set(topic, sub);

    return () => {
      if (sub) {
        sub.unsubscribe();
        subscriptionsRef.current.delete(topic);
      }
    };
  }, [connected]);

  const value = {
    connected,
    lastEvent,
    notifications,
    subscribe,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
