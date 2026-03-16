import { apiClient } from './client';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  createdAt: string;
}

export const chatApi = {
  getHistory: () => apiClient<Message[]>('/chat/history'),
  
  setRelationship: (id: number, status: 'FRIEND' | 'BLOCKED') => 
    apiClient(`/chat/friend/${id}`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  unblockUser: (id: number) => 
    apiClient(`/chat/unblock/${id}`, { method: 'POST' }),

  getBlockedUsers: () => 
    apiClient<{friendId: number, createdAt: string}[]>('/chat/blocks'),
};