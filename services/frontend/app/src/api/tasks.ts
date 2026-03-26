import { apiClient } from './client';

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

export const tasksApi = {
  getMyTasks: () => apiClient<Task[]>('/tasks/my-tasks'),

    updateStatus: (id: number, status: Task['status']) =>
    apiClient<Task>(`/tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),

    // updateStatus: (id: number, status: Task['status']) => {
    // const formData = new FormData();
    // formData.append('status', status);
    
    // return apiClient<Task>(`/api/tasks/${id}`, {
    //     method: 'PATCH',
    //     body: formData,
    // }, BOARDS_URL);
    // },

//   updateStatus: (id: number, status: Task['status']) =>
//     apiClient<Task>(`/api/tasks/${id}`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status }),
//     }, BOARDS_URL),
};

// export const projectsApi = {
//     getAll: () => apiClient<Task[]>('/api/tasks/my-tasks', {}, BOARDS_URL),

//     create: (data: CreateProjectData) =>
//         apiClient<Project>('/api/projects', {
//         method: 'POST',
//         body: JSON.stringify(data),
//     }),

//     delete: (id: number) => {
//         // console.log(`Deleting project with ID: ${id}`); // Debug log
//         return apiClient<void>(`/api/projects/${id}`, { method: 'DELETE' });
//     },
// };