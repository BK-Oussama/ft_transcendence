import api from './chatClient';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  senderAvatar: string | null;
  createdAt: string;
}

// ouboukou: "Ensure PENDING is included so the sidebar can track requests"
export interface Relationship {
  id: number;
  userId: number;
  friendId: number;
  status: 'PENDING' | 'FRIEND' | 'BLOCKED';
  targetName: string;    // 👈 Added
  targetAvatar: string | null; // 👈 Added
  createdAt: string;
}


export const chatApi = {
  getHistory: async () => {
    const res = await api.get<Message[]>('/chat/history');
    return res.data;
  },

  getRelationships: async () => {
    const res = await api.get<Relationship[]>('/chat/relationships');
    return res.data;
  },

  setRelationship: async (id: number, status: string) => {
    const res = await api.post(`/chat/friend/${id}`, { status });
    return res.data;
  },

  unblockUser: async (id: number) => {
    const res = await api.post(`/chat/unblock/${id}`);
    return res.data;
  },
};
