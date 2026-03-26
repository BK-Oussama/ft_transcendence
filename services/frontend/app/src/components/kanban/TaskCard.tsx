// import { Trash2 } from 'lucide-react';
// import { Draggable } from '@hello-pangea/dnd';
// import { getUserById } from '../../data/users';

// // import { USERS } from '../data/users';

// interface TaskCardProps {
//   id: number;
//   index: number;
//   title: string;
//   priority?: string;
//   assignedTo?: number;
//   onDelete: (id: number) => void;
//   onClick: () => void;
//   isReadOnly: boolean;
// }

// const getPriorityColor = (priority: string) => {
//   switch (priority?.toLowerCase()) {
//     case 'high': return 'bg-red-500';
//     case 'medium': return 'bg-amber-500';
//     case 'low': return 'bg-emerald-500';
//     default: return 'bg-slate-400';
//   }
// };

// export default function TaskCard({ 
//   id, index, title, priority = 'Medium', assignedTo, onDelete, onClick, isReadOnly }: TaskCardProps) {
//   const user = assignedTo ? getUserById(assignedTo) : null;
//   return (
//     <Draggable draggableId={id.toString()} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           onClick={onClick}
//           className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab hover:shadow-md hover:border-blue-100 transition-all duration-300 group relative"
//         >
//           <div className="flex justify-between items-start mb-3">
//             <h3 className="text-sm font-bold text-gray-800 leading-tight pr-6">
//               {title}
//             </h3>
           
//             {isReadOnly &&(
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete(id);
//               }}
//               className="p-1.5 rounded-md text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-red-600 transition-all duration-200 absolute top-3 right-3"
//             >
//               <Trash2 size={16} />
//             </button>
//             )}
//           </div>

//           <div className="mb-3">
//             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</div>
//             <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white rounded ${getPriorityColor(priority)}`}>
//               {priority}
//             </span>
//           </div>

//           <div>
//             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</div>
//             <div className="flex items-center justify-between">
//             {user ? (
//                 <>
//                   <span className="text-xs font-semibold text-gray-700">{user.name}</span>
//                   <div className={`w-6 h-6 rounded-full border border-white flex items-center justify-center text-[8px] text-white ${user.color}`}>
//                     {user.initials}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <span className="text-xs font-medium text-slate-400 italic">Unassigned</span>
//                   <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] text-slate-400">
//                     ?
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// }




// import { Trash2 } from 'lucide-react';
// import { Draggable } from '@hello-pangea/dnd';
// import { getUserById } from '../../data/users';

// interface TaskCardProps {
//   id: number;
//   index: number;
//   title: string;
//   priority?: string;
//   assignedTo?: number;
//   projectId?: number;
//   onDelete: (id: number) => void;
//   onClick: () => void;
//   isReadOnly: boolean;
// }

// const PRIORITY_STYLES: Record<string, string> = {
//   high:   'bg-red-50 text-red-600',
//   medium: 'bg-amber-50 text-amber-600',
//   low:    'bg-green-50 text-green-700',
// };

// export default function TaskCard({
//   id, index, title, priority = 'Medium', assignedTo, onDelete, onClick, isReadOnly
// }: TaskCardProps) {
//   const user = assignedTo ? getUserById(assignedTo) : null;
//   const priorityStyle = PRIORITY_STYLES[priority?.toLowerCase()] ?? 'bg-slate-50 text-slate-500';

//   return (
//     <Draggable draggableId={id.toString()} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           onClick={onClick}
//           className="group bg-white border border-gray-100 rounded-xl p-4 cursor-grab transition-all duration-200 hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 relative"
//         >
//           {/* Delete button */}
//           {isReadOnly && (
//             <button
//               onClick={(e) => { e.stopPropagation(); onDelete(id); }}
//               className="absolute top-3 right-3 p-1.5 rounded-md text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-red-600 transition-all duration-200"
//             >
//               <Trash2 size={15} />
//             </button>
//           )}

//           {/* Title */}
//           <h3 className="text-sm font-semibold text-gray-800 leading-snug pr-6 mb-3">
//             {title}
//           </h3>

//           {/* Priority badge */}
//           <div className="mb-3">
//             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityStyle}`}>
//               {priority}
//             </span>
//           </div>

//           {/* Assignee */}
//           <div className="flex items-center justify-between pt-3 border-t border-gray-50">
//             {user ? (
//               <>
//                 <span className="text-xs font-medium text-slate-500">{user.name}</span>
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${user.color}`}>
//                   {user.initials}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <span className="text-xs text-slate-400 italic">Unassigned</span>
//                 <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
//                   ?
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// }



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
