import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, chatApi } from '../../../api/chat.api';

export const useChat = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const newSocket = io('https://localhost', {
      path: '/api/chat/socket.io',
      auth: { token },
      rejectUnauthorized: false,
    });

    newSocket.on('connect', () => setConnected(true));
    newSocket.on('receive_msg', (msg) => setMessages((prev) => [...prev, msg]));
    
    setSocket(newSocket);

    // Fetch history on load
    chatApi.getHistory().then((data) => setMessages(data.reverse()));

    return () => { newSocket.close(); };
  }, [token]);

  const sendMessage = useCallback((content: string) => {
    if (socket) socket.emit('send_msg', { content });
  }, [socket]);

  return { messages, sendMessage, connected };
};