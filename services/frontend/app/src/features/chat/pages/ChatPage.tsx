import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../../hooks/useAuth';

const ChatPage = () => {
  const { user } = useAuth(); // Pull user from your AuthContext
  const token = localStorage.getItem('accessToken');
  const { messages, sendMessage, connected } = useChat(token);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Global Chat</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-500">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-400 mb-1 px-1">{msg.senderName}</span>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                msg.senderId === user?.id ? 'bg-brand text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3">
          <input
            type="text"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            placeholder="Write a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bg-brand text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-all">
            Send
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default ChatPage;