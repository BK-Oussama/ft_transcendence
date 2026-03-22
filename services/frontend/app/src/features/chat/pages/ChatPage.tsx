import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../../hooks/useAuth';
import { chatApi } from '../../../api/chat.api';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { user: currentUser } = useAuth();
  const token = localStorage.getItem('access_token');
  const { messages, sendMessage, connected } = useChat(token);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Global Chat</h1>
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Public Channel</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{connected ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fbfcfe]">
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUser?.id;

          // ouboukou: "Replaced 'You' logic. If it's your own message, we use the LIVE name from your AuthContext."
          const displayName = isOwn 
            ? (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'You')
            : msg.senderName;

          // ouboukou: "Live Avatar Update: For your own messages, use the avatarUrl from AuthContext instead of the stored one."
          const avatarUrl = (isOwn && currentUser?.avatarUrl)
            ? `${currentUser.avatarUrl}?t=${new Date().getTime()}`
            : msg.senderAvatar
              ? `${msg.senderAvatar}?t=${new Date(msg.createdAt).getTime()}`
              : `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;

          const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;

          return (
            <div key={msg.id} className={`group flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              <img
                src={avatarUrl}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white object-cover shadow-sm transition-transform group-hover:scale-105"
                alt="avatar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== fallbackAvatar) {
                    target.src = fallbackAvatar;
                  }
                }}
              />
              <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  {/* ouboukou: "Display the actual name variable instead of the hardcoded 'You' string." */}
                  <span className="text-[11px] font-bold text-gray-600 uppercase">
                    {displayName}
                  </span>
                  <span className="text-[9px] text-gray-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isOwn ? 'bg-[#3b82f6] text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
        <input
          type="text"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" disabled={!input.trim() || !connected} className="bg-[#3b82f6] text-white p-3 rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale flex-shrink-0 shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
        </button>
      </form>
    </div>
  );
};

export default ChatPage;