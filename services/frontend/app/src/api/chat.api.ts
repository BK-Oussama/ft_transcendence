
import api from './client';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  createdAt: string;
}

export const chatApi = {
  getHistory: () => api.get<Message[]>('/chat/history').then(res => res.data),
  
  setRelationship: (id: number, status: 'FRIEND' | 'BLOCKED') => 
    api.post(`/chat/friend/${id}`, { status }).then(res => res.data),

  unblockUser: (id: number) => 
    api.post(`/chat/unblock/${id}`).then(res => res.data),

  getBlockedUsers: () => 
    api.get<{friendId: number, createdAt: string}[]>('/chat/blocks').then(res => res.data),
};