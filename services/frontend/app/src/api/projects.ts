import api from './client';

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

/////////////////////////////////////////////
// changed by the boards service

// export const projectsApi = {
//     getAll: () => api<Project[]>('/projects'),
//
//     create: (data: CreateProjectData) =>
//         api<Project>('/projects', {
//         method: 'POST',
//         body: JSON.stringify(data),
//     }),
//
//     delete: (id: number) => {
//         // console.log(`Deleting project with ID: ${id}`); // Debug log
//         return api<void>(`/projects${id}/`, { method: 'DELETE' });
//     },
//
//     update: (id: number, data: Partial<CreateProjectData>) =>
//         api<Project>(`/projects${id}/`, {
//         method: 'PUT',
//         body: JSON.stringify(data),
//     }),
// };

export const projectsApi = {
    getAll: async () => {
        try {
            const response = await api.get('/projects');
            if (!response)
                throw new Error("Backend did not respond.");
            const data = response.data || response;
            if (Array.isArray(data))
                return data;
            else if (data && Array.isArray(data.data))
                return data.data;
            return [];
        } catch (error) {
            throw error; 
        }
    },
    create: async (data: CreateProjectData) => {
        const response = await api.post<Project>('/projects', data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete<void>(`/projects${id}/`);
        return response.data;
    },
    update: async (id: number, data: Partial<CreateProjectData>) => {
        const response = await api.put<Project>(`/projects${id}/`, data);
        return response.data;
    },
};
/////////////////////////////////////////////
