import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { chatApi, type Message } from '../../../api/chat.api';


export const useChat = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    // const newSocket = io('https://localhost', {
    //   path: '/api/chat/socket.io',
    //   auth: { token },
    //   rejectUnauthorized: false,
    // });
    const newSocket = io('https://localhost', {
      path: '/api/chat/socket.io', // 👈 This MUST match your Nginx config
      auth: { token },
      transports: ['websocket'], // Force WebSocket to avoid polling issues
      rejectUnauthorized: false,
    });

    // newSocket.on('connect', () => setConnected(true));
    // newSocket.on('receive_msg', (msg) => setMessages((prev) => [...prev, msg]));

    newSocket.on('connect', () => {
      console.log('✅ Socket Connected with ID:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('receive_msg', (msg) => {
      console.log('📥 NEW MESSAGE RECEIVED:', msg); // 👈 DEBUG LOG
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ SOCKET CONNECTION ERROR:', err.message);
    });

    setSocket(newSocket);

    // Fetch history on load
    chatApi.getHistory().then((data) => setMessages(data.reverse()));

    return () => { newSocket.close(); };
  }, [token]);


  const sendMessage = useCallback((content: string) => {
    if (socket && socket.connected) {
      console.log('📤 Sending message:', content);
      socket.emit('send_msg', { content });
    } else {
      console.error('❌ Socket not connected. Cannot send message.');
    }
  }, [socket]);


  return { messages, sendMessage, connected };
};