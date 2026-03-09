import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';
import { Droppable } from '@hello-pangea/dnd';

interface Task {
  id: number;
  title: string;
  status: string;
  priority?: string;
  assignedTo?: number;
  assigned_to?: number;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  count: number;
  onAdd: () => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  isLoading?: boolean;
  isReadOnly: boolean;
}

export default function KanbanColumn({ 
  id, title, tasks, count, onAdd, onDelete, onEdit, isLoading, isReadOnly }: KanbanColumnProps) {
  return (
    <div className="flex-1 rounded-xl p-4 min-w-[280px] shrink-0 bg-slate-50/80 border border-gray-100 flex flex-col max-h-[calc(100vh-12rem)]">
       <div className="flex items-center justify-between mb-4 px-1 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-700 text-sm">{title}</h2>
          <span className="text-slate-400 text-sm font-medium">({count})</span>
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-1 overflow-y-auto min-h-0 p-3 flex flex-col gap-3"
          >
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-5 w-12 bg-gray-200 rounded"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              tasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  id={task.id} 
                  index={index} 
                  title={task.title}
                  priority={task.priority}
                  assignedTo={task.assignedTo || task.assigned_to}
                  onDelete={onDelete}
                  onClick={() => onEdit(task)}
                  isReadOnly={isReadOnly}
                />
              ))
            )}
            {provided.placeholder}
           
            {isReadOnly && (
            <button 
              onClick={onAdd} 
              className="w-full py-2 border border-slate-200 rounded-lg text-slate-500 text-sm font-medium hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 bg-white group mt-3"
            >
              <Plus size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              New Task
            </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
