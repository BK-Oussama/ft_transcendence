import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { chatApi } from '../api/chat.api';
import type { Relationship } from '../api/chat.api';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const { messages, sendMessage, socket } = useChat(token);
  const [input, setInput] = useState('');
  
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [activePopover, setActivePopover] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    fetchRelationships();
    if (socket) {
      socket.on('social_update', fetchRelationships);
      return () => { socket.off('social_update'); };
    }
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, relationships]);

  const fetchRelationships = async () => {
    try {
      const data = await chatApi.getRelationships();
      setRelationships(data);
    } catch (err) {
      console.error("Social sync failed");
    }
  };

  const handleAction = async (targetId: number, action: string) => {
    try {
      if (action === 'UNBLOCK' || action === 'IGNORE') {
        await chatApi.unblockUser(targetId);
        toast.success(action === 'IGNORE' ? 'Request Dismissed' : 'User Unblocked');
      } else {
        await chatApi.setRelationship(targetId, action);
        toast.success(`User ${action.toLowerCase()}`);
      }
      fetchRelationships();
      setActivePopover(null);
      socket?.emit('refresh_social', { targetId }); 
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const visibleMessages = messages.filter(msg => {
    if (msg.senderId === currentUser?.id) return true;
    return !relationships.some(r => r.status === 'BLOCKED' && (r.friendId === msg.senderId || r.userId === msg.senderId));
  });

  const friends = relationships.filter(r => r.status === 'FRIEND');
  const blocked = relationships.filter(r => r.status === 'BLOCKED');
  const incomingRequests = relationships.filter(r => r.status === 'PENDING' && r.friendId === currentUser?.id);

  return (
    <div className="flex h-full bg-[#f4f7f6] gap-4 p-4 font-sans overflow-hidden">
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md z-10">
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Global Channel</h1>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fdfdfd]">
          {visibleMessages.map((msg) => {
            const isOwn = msg.senderId === currentUser?.id;
            const isFriend = friends.some(f => f.userId === msg.senderId || f.friendId === msg.senderId);
            const displayName = isOwn ? `${currentUser?.firstName} ${currentUser?.lastName}` : msg.senderName;
            
            // Cache busting for avatars
            const avatarUrl = isOwn 
              ? (currentUser?.avatarUrl ? `${currentUser.avatarUrl}?t=${new Date().getTime()}` : null)
              : (msg.senderAvatar ? `${msg.senderAvatar}?t=${new Date(msg.createdAt).getTime()}` : null);

            return (
              <div key={msg.id} className={`group flex gap-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="relative flex-shrink-0">
                  <img
                    src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`}
                    className="w-11 h-11 rounded-2xl border border-gray-100 bg-white object-cover shadow-sm cursor-pointer hover:rotate-3 transition-all"
                    onClick={() => !isOwn && setActivePopover(activePopover === msg.id ? null : msg.id)}
                    alt="avatar"
                  />
                  {activePopover === msg.id && (
                    <div className={`absolute z-50 bottom-full mb-3 w-40 bg-white rounded-2xl shadow-2xl border p-1.5 flex flex-col gap-1 ${isOwn ? 'right-0' : 'left-0'}`}>
                      <button 
                        onClick={() => navigate(`/profile/${msg.senderId}`)} 
                        className="text-[11px] font-bold text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors"
                      >
                        View Profile
                      </button>
                      {!isFriend && (
                        <button onClick={() => handleAction(msg.senderId, 'PENDING')} className="text-[11px] font-bold text-left px-4 py-2.5 hover:bg-blue-50 text-blue-600 rounded-xl">
                          Add Friend
                        </button>
                      )}
                      <button onClick={() => handleAction(msg.senderId, 'BLOCKED')} className="text-[11px] font-bold text-left px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-xl">
                        Block User
                      </button>
                    </div>
                  )}
                </div>
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[65%]`}>
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-wide">{displayName}</span>
                    {isFriend && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </div>
                  <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isOwn ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-50 flex gap-4 items-center">
          <input
            type="text"
            className="flex-1 bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:border-blue-100 outline-none transition-all"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" disabled={!input.trim()} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">Send</button>
        </form>
      </div>

      <div className="w-80 flex flex-col gap-4">
        {incomingRequests.length > 0 && (
          <div className="bg-blue-600 rounded-3xl shadow-lg p-5">
            <h2 className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-4">New Requests</h2>
            <div className="space-y-3">
              {incomingRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between bg-white/10 p-2 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <img src={req.targetAvatar ? `${req.targetAvatar}?t=${new Date(req.createdAt).getTime()}` : `https://api.dicebear.com/7.x/initials/svg?seed=${req.targetName}`} className="w-6 h-6 rounded-full object-cover bg-white/20" alt="" />
                    <span className="text-xs font-bold text-white truncate max-w-[80px]">{req.targetName}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleAction(req.userId, 'FRIEND')} className="bg-white text-blue-600 text-[9px] px-2 py-1 rounded-lg font-black">Accept</button>
                    <button onClick={() => handleAction(req.userId, 'IGNORE')} className="bg-transparent text-white/60 text-[9px] px-2 py-1 rounded-lg">Ignore</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex-1 overflow-hidden flex flex-col">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Friends</h2>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {friends.map(f => (
              <div key={f.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50">
                <img src={f.targetAvatar ? `${f.targetAvatar}?t=${new Date(f.createdAt).getTime()}` : `https://api.dicebear.com/7.x/initials/svg?seed=${f.targetName}`} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate capitalize">{f.targetName}</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Friend</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 h-48">
          <h2 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-4">Restricted</h2>
          <div className="space-y-3 overflow-y-auto pr-2">
            {blocked.map(b => (
              <div key={b.id} className="flex items-center justify-between group">
                <span className="text-xs font-medium text-gray-500 truncate">{b.targetName}</span>
                <button onClick={() => handleAction(b.userId === currentUser?.id ? b.friendId : b.userId, 'UNBLOCK')} className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-500 font-bold">Unblock</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;