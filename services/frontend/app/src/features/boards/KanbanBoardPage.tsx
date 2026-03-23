import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Search, Bell, Filter, Home, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

// 1. IMPORT YOUR SHARED ASSETS
import api from '../../api/client'; 
import KanbanColumn from './components/KanbanColumn';
import NewTaskModal from './components/NewTaskModal';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo: number;
  startDate?: string;
  dueDate?: string;
  attachmentUrl?: string;
  position: number; // Added to match the sorting logic in their code
}

export default function BoardPage() {
  // --- CORE LOGIC (INTACT FROM BOARDS DEV) ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('TODO');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const USER_ROLE = 'ADMIN';
  const canEdit = USER_ROLE === 'ADMIN' || USER_ROLE === 'PM';

  useEffect(() => {
    fetchTasks();

    // Note: We use the direct URL for now until the Gateway handles WebSockets
    // const socket = io('http://localhost:3003');

    // We are Talking to the Gateway NOW
    const socket = io('https://localhost', {
  path: '/api/boards/socket.io' // We will set this path in Nginx later
});

    socket.on('task:created', (newTask: Task) => {
      setTasks((prevTasks) => {
        if (prevTasks.some(t => t.id === newTask.id)) return prevTasks;
        return [...prevTasks, newTask];
      }); 
    });

    socket.on('task:updated', (updatedTask: Task) => {
      setTasks((prevTasks) => prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    });

    socket.on('task:deleted', ({ id }: { id: number }) => {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    });

    socket.on('notification', (data: { message: string }) => {
      toast(data.message, { icon: '🔔' });
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchTasks = () => {
    // UPDATED: Using our shared 'api' client
    api.get(`/boards/tasks?timestamp=${Date.now()}`)
      .then(res => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const openNewTaskModal = (status: string) => {
    setActiveStatus(status);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>, file?: File) => {
    try {
      let dataToSend: any;
      let config = {};

      if (file) {
        const formData = new FormData();
        formData.append('title', taskData.title || '');
        formData.append('status', taskData.status || 'TODO');
        formData.append('file', file);
        dataToSend = formData;
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      } else {
        dataToSend = taskData;
        config = { headers: { 'Content-Type': 'application/json' } };
      }

      if (taskData.id) {
        await api.patch(`/boards/tasks/${taskData.id}`, dataToSend, config);
        toast.success("Task updated!");
      } else {
        await api.post('/boards/tasks', dataToSend, config);
        toast.success("Task created!");
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error("Save failed.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/boards/tasks/${id}`);
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    
    const movedTaskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    try {
      await api.patch(`/boards/tasks/${movedTaskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Move failed");
    }
  };

  const getTasksByStatus = (status: string) => {
    if (!Array.isArray(tasks)) { // ouboukou added this line when i got the page loaded and then dispaly white imdetly.
    return [];
  }
    return tasks
      .filter(task => task.status === status)
      .filter(task => {
        if (!searchQuery) return true;
        return task.title.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .filter(task => !filterPriority || task.priority === filterPriority);
  };

  // --- RENDER SECTION (UI) ---
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <Toaster position="bottom-right" />
      
      {/* Search Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-400">
           <Home size={16} />
           <span>/</span>
           <span className="text-gray-900 font-medium">Product Launch</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64" 
          />
        </div>
      </header>

      {/* Board Content */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Launch</h1>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
          >
            <Filter size={16} /> Filter
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto">
            {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => (
              <KanbanColumn 
                key={status}
                id={status}
                title={status.replace('_', ' ')}
                count={getTasksByStatus(status).length} 
                tasks={getTasksByStatus(status)} 
                onAdd={() => openNewTaskModal(status)}
                onDelete={handleDeleteTask}
                onEdit={openEditTaskModal}
                loading={loading}
                isReadOnly={canEdit}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        defaultStatus={activeStatus}
        isReadOnly={canEdit}
      />
    </div>
  );
}
