import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { chatApi, type Message } from '../api/chat.api';

export const useChat = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const newSocket = io('https://localhost', {
      path: '/api/chat/socket.io',
      auth: { token },
      transports: ['websocket'],
      rejectUnauthorized: false,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket Connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('receive_msg', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket Error:', err.message);
    });

    setSocket(newSocket);

    // Fetch history and align order (Oldest to Newest)
    chatApi.getHistory().then((data) => setMessages(data.reverse()));

    return () => { newSocket.close(); };
  }, [token]);

  const sendMessage = useCallback((content: string) => {
    if (socket && socket.connected) {
      socket.emit('send_msg', { content });
    }
  }, [socket]);

  // ouboukou: "Export the socket so ChatPage can handle social events"
  return { messages, sendMessage, connected, socket }; 
};