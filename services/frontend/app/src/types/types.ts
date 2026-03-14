export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo: number;
  startDate?: string;
  dueDate?: string;
}
