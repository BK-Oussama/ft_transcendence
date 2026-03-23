import api from './client';

export interface Task {
    id: number;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: string;
    due_date: string | null;
    project_id: number;
    assigned_to: number | null;
    description: string;
}

// const BOARDS_URL = 'https://localhost:8444';

/////////////////////////////////////////////
// changed by the boards service

// export const tasksApi = {
//   getMyTasks: () => api<Task[]>('/tasks/my-tasks'),
//
//     updateStatus: (id: number, status: Task['status']) =>
//     api<Task>(`/tasks/${id}/status`, {
//         method: 'PATCH',
//         body: JSON.stringify({ status }),
//     }),
//
//     // updateStatus: (id: number, status: Task['status']) => {
//     // const formData = new FormData();
//     // formData.append('status', status);
//
//     // return api<Task>(`/api/tasks/${id}`, {
//     //     method: 'PATCH',
//     //     body: formData,
//     // }, BOARDS_URL);
//     // },
//
// //   updateStatus: (id: number, status: Task['status']) =>
// //     api<Task>(`/api/tasks/${id}`, {
// //       method: 'PATCH',
// //       body: JSON.stringify({ status }),
// //     }, BOARDS_URL),
// };

export const tasksApi = {
    getMyTasks: async () => {
        const response = await api.get('/tasks/my-tasks');
        
        const data = response?.data || response;
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        return [];
    },

    updateStatus: async (id: number, status: Task['status']) => {
        const response = await api.patch(`/tasks/${id}/status`, { status });
        return response.data;
    },
};
/////////////////////////////////////////////

// export const projectsApi = {
//     getAll: () => api<Task[]>('/api/tasks/my-tasks', {}, BOARDS_URL),

//     create: (data: CreateProjectData) =>
//         api<Project>('/api/projects', {
//         method: 'POST',
//         body: JSON.stringify(data),
//     }),

//     delete: (id: number) => {
//         // console.log(`Deleting project with ID: ${id}`); // Debug log
//         return api<void>(`/api/projects${id}`, { method: 'DELETE' });
//     },
// };
