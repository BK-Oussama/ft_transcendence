export interface Task {
  id?: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: number;
  assigned_to?: number;
  startDate?: string;
  dueDate?: string;
  start_date?: string;
  due_date?: string;
  attachment_url?: string;
  attachmentUrl?: string;
}
