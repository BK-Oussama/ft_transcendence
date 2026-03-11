import { Trash2 } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { getUserById } from '../data/users';

// import { USERS } from '../data/users';

interface TaskCardProps {
  id: number;
  index: number;
  title: string;
  priority?: string;
  assignedTo?: number;
  onDelete: (id: number) => void;
  onClick: () => void;
  isReadOnly: boolean;
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-amber-500';
    case 'low': return 'bg-emerald-500';
    default: return 'bg-slate-400';
  }
};

export default function TaskCard({ 
  id, index, title, priority = 'Medium', assignedTo, onDelete, onClick, isReadOnly }: TaskCardProps) {
  const user = assignedTo ? getUserById(assignedTo) : null;
  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab hover:shadow-md hover:border-blue-100 transition-all duration-300 group relative"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-bold text-gray-800 leading-tight pr-6">
              {title}
            </h3>
           
            {isReadOnly &&(
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1.5 rounded-md text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-red-600 transition-all duration-200 absolute top-3 right-3"
            >
              <Trash2 size={16} />
            </button>
            )}
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</div>
            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white rounded ${getPriorityColor(priority)}`}>
              {priority}
            </span>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</div>
            <div className="flex items-center justify-between">
            {user ? (
                <>
                  <span className="text-xs font-semibold text-gray-700">{user.name}</span>
                  <div className={`w-6 h-6 rounded-full border border-white flex items-center justify-center text-[8px] text-white ${user.color}`}>
                    {user.initials}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs font-medium text-slate-400 italic">Unassigned</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] text-slate-400">
                    ?
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
