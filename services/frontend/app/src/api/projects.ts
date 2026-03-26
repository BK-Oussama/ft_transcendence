import { apiClient } from './client';

export interface Project {
    id: number;
    title: string;
    description?: string;
    // owner: { id: number; name: string };
    status?: string;
    dueDate?: string;
    members: { userId: number; role: string }[];
    owner: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    } | null;
}

export interface CreateProjectData {
    title: string;
    description?: string;
    status?: string;
    dueDate?: string;
}

export const projectsApi = {
    getAll: () => apiClient<Project[]>('/projects/'),

    create: (data: CreateProjectData) =>
        apiClient<Project>('/projects/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    delete: (id: number) => {
        // console.log(`Deleting project with ID: ${id}`); // Debug log
        return apiClient<void>(`/projects/${id}/`, { method: 'DELETE' });
    },

    update: (id: number, data: Partial<CreateProjectData>) =>
        apiClient<Project>(`/projects/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
};