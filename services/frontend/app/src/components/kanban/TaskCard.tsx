import { Trash2 } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { useQuery } from '@tanstack/react-query';
import { membersApi } from '../../api/members';
import { useAuth } from '../../hooks/useAuth';

interface TaskCardProps {
  id: number;
  index: number;
  title: string;
  priority?: string;
  status: string;
  assignedTo?: number;
  projectId: number;
  onDelete: (id: number) => void;
  onClick: () => void;
  isReadOnly: boolean;
  userRole: string;
  currentUserId?: number;
}

const PRIORITY_STYLES: Record<string, string> = {
  high:   'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low:    'bg-green-50 text-green-700',
};

const COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
];

export default function TaskCard({
  id, index, title, priority = 'Medium', status, assignedTo, projectId, onDelete, onClick, isReadOnly, userRole, currentUserId
}: TaskCardProps) {
  const priorityStyle = PRIORITY_STYLES[priority?.toLowerCase()] ?? 'bg-slate-50 text-slate-500';

  const isAdminOrOwner = userRole === 'ADMIN' || userRole === 'OWNER';
  const isAssignedMember = userRole === 'MEMBER' && assignedTo === currentUserId;
  const canDrag = isAdminOrOwner || isAssignedMember;

  const { user, logout } = useAuth();

  const avatarUrl = user?.avatarUrl && !user.avatarUrl.includes('default')
    ? `https://localhost${user.avatarUrl}`
    : null;

  const { data: members = [] } = useQuery({
    queryKey: ['members', projectId],
    queryFn: () => membersApi.getAll(projectId),
    enabled: !!projectId,
  });

  const assignedMember = assignedTo
    ? members.find(m => m.userId === assignedTo)
    : null;

  const userName = assignedMember?.user?.name ?? null;
  const initials = userName
    ? userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const color = assignedTo ? COLORS[assignedTo % COLORS.length] : '';
  const rawAvatar = assignedMember?.user?.avatar || assignedMember?.user?.avatarUrl;
  const assignedAvatarUrl = rawAvatar ? `https://localhost${rawAvatar}` : null;

  return (
    <Draggable draggableId={id.toString()} index={index} isDragDisabled={!canDrag}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className="group bg-white border border-gray-100 rounded-xl p-4 cursor-grab transition-all duration-200 hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 relative"
        >
          {isReadOnly && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              className={`absolute top-3 right-3 p-1.5 rounded-md text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-red-600 transition-all duration-200 ${canDrag ? 'cursor-grab' : 'cursor-default'}`}
            >
              <Trash2 size={15} />
            </button>
          )}

          <h3 className="text-sm font-semibold text-gray-800 leading-snug pr-6 mb-3">
            {title}
          </h3>

          <div className="mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityStyle}`}>
              {priority}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            {userName ? (
              <>
                <span className="text-xs font-medium text-slate-500">{userName}</span>
                <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                {assignedAvatarUrl ? (
                  <img 
                    src={assignedAvatarUrl} 
                    alt={userName} 
                    className="h-full w-full object-cover" 
                    onError={(e) => e.currentTarget.style.display = 'none'} 
                  />
                ) : (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${color}`}>
                    {initials}
                  </div>
                )}
                </div>

              </>
            ) : (
              <>
                <span className="text-xs text-slate-400 italic">Unassigned</span>
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                  ?
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
