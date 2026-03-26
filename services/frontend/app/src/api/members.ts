import { apiClient } from './client';

export interface Member {
    userId: number;
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
    joinedAt: string;
    user: { id: number; name: string; email: string, avatar?: string};
}

export const membersApi = {
    getAll: (projectId: number) =>
        apiClient<Member[]>(`/projects/${projectId}/members/`),

    add: (projectId: number, userId: number, role: string) =>
        apiClient(`/projects/${projectId}/members/`, {
        method: 'POST',
        body: JSON.stringify({ userId, role }),
    }),

    updateRole: (projectId: number, userId: number, role: string) =>
        apiClient(`/projects/${projectId}/members/${userId}/`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
    }),

    remove: (projectId: number, userId: number) =>
        apiClient(`/projects/${projectId}/members/${userId}/`, {
        method: 'DELETE',
    }),
};
