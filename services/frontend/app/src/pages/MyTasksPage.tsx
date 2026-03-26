// import { useState } from 'react';
// import { CheckSquare, Search, Filter } from 'lucide-react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { tasksApi, type Task } from '../api/tasks';

// type TaskStatus = 'todo' | 'in_progress' | 'done';
// type Priority = 'High' | 'Medium' | 'Low';

// interface Task {
//     id: number;
//     title: string;
//     status: TaskStatus;
//     priority: Priority;
//     dueDate: string;
//     projectId: number;
// }

// interface Project {
//     id: number;
//     name: string;
//     color: string;
// }

// const MOCK_PROJECTS: Record<number, Project> = {
//     1: { id: 1, name: 'Frontend Redesign', color: '#3b82f6' },
//     2: { id: 2, name: 'API Gateway v2', color: '#10b981' },
//     3: { id: 3, name: 'Data Migration', color: '#f43f5e' },
// };

// const MOCK_TASKS: Task[] = [
//     { id: 1, title: 'Design the onboarding flow wireframes', status: 'in_progress', priority: 'High', dueDate: '2026-03-12', projectId: 1 },
//     { id: 2, title: 'Set up CI/CD pipeline for staging', status: 'todo', priority: 'Medium', dueDate: '2026-03-18', projectId: 1 },
//     { id: 3, title: 'Write unit tests for auth service', status: 'done', priority: 'Low', dueDate: '2026-03-10', projectId: 1 },
//     { id: 4, title: 'Review pull request for payment module', status: 'todo', priority: 'High', dueDate: '2026-03-13', projectId: 2 },
//     { id: 5, title: 'Update API documentation', status: 'in_progress', priority: 'Medium', dueDate: '2026-03-20', projectId: 2 },
//     { id: 6, title: 'Fix mobile layout bug on dashboard', status: 'todo', priority: 'High', dueDate: '2026-03-11', projectId: 2 },
//     { id: 7, title: 'Migrate legacy database tables', status: 'todo', priority: 'Medium', dueDate: '2026-03-25', projectId: 3 },
//     { id: 8, title: 'Conduct user interviews for Q2 planning', status: 'done', priority: 'Low', dueDate: '2026-03-08', projectId: 3 },
//     { id: 9, title: 'Prepare sprint retrospective slides', status: 'in_progress', priority: 'Low', dueDate: '2026-03-14', projectId: 3 },
// ];

// type Filter = 'all' | 'todo' | 'in_progress' | 'done' | 'overdue';

// const FILTERS: { label: string; value: Filter }[] = [
//     { label: 'All', value: 'all' },
//     { label: 'To do', value: 'todo' },
//     { label: 'In progress', value: 'in_progress' },
//     { label: 'Done', value: 'done' },
//     { label: 'Overdue', value: 'overdue' },
// ];

// const PRIORITY_STYLES: Record<Priority, string> = {
//     High: 'bg-red-50 text-red-600',
//     Medium: 'bg-amber-50 text-amber-600',
//     Low: 'bg-green-50 text-green-700',
// };

// const STATUS_STYLES: Record<TaskStatus, string> = {
//     todo: 'bg-slate-100 text-slate-500',
//     in_progress: 'bg-blue-50 text-blue-600',
//     done: 'bg-green-50 text-green-700',
// };

// const STATUS_LABELS: Record<TaskStatus, string> = {
//     todo: 'To do',
//     in_progress: 'In progress',
//     done: 'Done',
// };

// function daysFromNow(dateStr: string) {
//     const today = new Date(); today.setHours(0, 0, 0, 0);
//     return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);
// }

// function formatDueDate(dateStr: string) {
//     const days = daysFromNow(dateStr);
//     if (days < 0) return `${Math.abs(days)}d overdue`;
//     if (days === 0) return 'Due today';
//     if (days === 1) return 'Due tomorrow';
//     return 'Due ' + new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// }

// export default function MyTasksPage() {
//   const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
//   const [filter, setFilter] = useState<Filter>('all');
//   const [search, setSearch] = useState('');
//   const [projectFilter, setProjectFilter] = useState<number | 'all'>('all');

//   const isOverdue = (t: Task) => t.status !== 'done' && daysFromNow(t.dueDate) < 0;

//   const filtered = tasks.filter(t => {
//     if (filter === 'overdue') return isOverdue(t);
//     if (filter !== 'all' && t.status !== filter) return false;
//     if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;
//     if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });

//   const grouped = filtered.reduce((acc, t) => {
//     if (!acc[t.projectId]) acc[t.projectId] = [];
//     acc[t.projectId].push(t);
//     return acc;
//   }, {} as Record<number, Task[]>);

//   const toggleDone = (id: number) => {
//     setTasks(prev => prev.map(t =>
//       t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
//     ));
//   };

//   const changeStatus = (id: number, status: TaskStatus) => {
//     setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
//   };

//   const stats = [
//     { label: 'Total', value: tasks.length, color: 'text-gray-900' },
//     { label: 'In progress', value: tasks.filter(t => t.status === 'in_progress').length, color: 'text-blue-600' },
//     { label: 'Overdue', value: tasks.filter(t => isOverdue(t)).length, color: 'text-red-500' },
//     { label: 'Done', value: tasks.filter(t => t.status === 'done').length, color: 'text-green-600' },
//   ];

//   return (
//     <div className="p-8">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <CheckSquare className="text-blue-600" size={32} />
//             Your assigned Tasks
//           </h1>
//           <p className="text-gray-500 mt-2">All tasks assigned to you across every project</p>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {stats.map(s => (
//           <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5">
//             <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
//             <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Search + Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
//         {/* Search */}
//         <div className="flex-1 relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search tasks..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-400"
//           />
//         </div>

//         {/* Project filter */}
//         <div className="relative">
//           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
//           <select
//             value={projectFilter}
//             onChange={e => setProjectFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
//             className="pl-11 pr-8 py-3 bg-slate-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none appearance-none cursor-pointer text-slate-700 font-medium min-w-[160px] transition-all"
//           >
//             <option value="all">All Projects</option>
//             {Object.values(MOCK_PROJECTS).map(p => (
//               <option key={p.id} value={p.id}>{p.name}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Status filter pills */}
//       <div className="flex gap-2 flex-wrap mb-8">
//         {FILTERS.map(f => (
//           <button
//             key={f.value}
//             onClick={() => setFilter(f.value)}
//             className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
//               filter === f.value
//                 ? 'bg-gray-900 text-white border-gray-900'
//                 : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
//             }`}
//           >
//             {f.label}
//           </button>
//         ))}
//       </div>

//       {/* Task list grouped by project */}
//       {Object.keys(grouped).length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100">
//           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
//             <CheckSquare size={32} className="text-slate-300" />
//           </div>
//           <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">No tasks found</h3>
//           <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search.</p>
//         </div>
//       ) : (
//         <div className="space-y-10">
//           {Object.entries(grouped).map(([pid, projectTasks]) => {
//             const project = MOCK_PROJECTS[Number(pid)];
//             return (
//               <section key={pid}>
//                 {/* Project header */}
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: project.color }} />
//                   <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">{project.name}</h2>
//                   <div className="h-px flex-1 bg-gray-100" />
//                   <span className="text-xs text-gray-400 font-medium">{projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}</span>
//                 </div>

//                 {/* Tasks list */}
//                 <div className="space-y-2">
//                   {projectTasks.map(task => {
//                     const overdue = isOverdue(task);
//                     const done = task.status === 'done';
//                     return (
//                       <div
//                         key={task.id}
//                         className={`group flex items-center gap-4 p-4 bg-white border rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
//                           overdue && !done ? 'border-red-100' : 'border-gray-100'
//                         } ${done ? 'opacity-60' : ''}`}
//                       >
//                         {/* Checkbox */}
//                         <button
//                           onClick={() => toggleDone(task.id)}
//                           className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
//                             done
//                               ? 'bg-gray-900 border-gray-900'
//                               : 'border-gray-300 hover:border-blue-500'
//                           }`}
//                         >
//                           {done && (
//                             <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
//                               <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>
//                           )}
//                         </button>

//                         {/* Title */}
//                         <div className="flex-1 min-w-0">
//                           <p className={`text-sm font-semibold text-gray-800 truncate ${done ? 'line-through text-gray-400' : ''}`}>
//                             {task.title}
//                           </p>
//                           <div className="flex items-center gap-2 mt-1.5 flex-wrap">
//                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_STYLES[task.status]}`}>
//                               {STATUS_LABELS[task.status]}
//                             </span>
//                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${PRIORITY_STYLES[task.priority]}`}>
//                               {task.priority}
//                             </span>
//                             {overdue && !done && (
//                               <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-500">
//                                 Overdue
//                               </span>
//                             )}
//                             <span className={`text-xs ${overdue && !done ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
//                               {formatDueDate(task.dueDate)}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Status dropdown */}
//                         <select
//                           value={task.status}
//                           onChange={e => changeStatus(task.id, e.target.value as TaskStatus)}
//                           className="text-xs border border-slate-100 rounded-lg px-2 py-1.5 bg-slate-50 text-slate-500 cursor-pointer outline-none opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <option value="todo">To do</option>
//                           <option value="in_progress">In progress</option>
//                           <option value="done">Done</option>
//                         </select>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </section>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }



import { useState } from 'react';
import { CheckSquare, Search, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, type Task } from '../api/tasks';
import { projectsApi } from '../api/projects';

// --- Constants ---


type Filter = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'OVERDUE';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All',         value: 'ALL'         },
  { label: 'To do',       value: 'TODO'        },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Review',      value: 'REVIEW'      },
  { label: 'Done',        value: 'DONE'        },
  { label: 'Overdue',     value: 'OVERDUE'     },
];


// type Filter = 'all' | 'todo' | 'in_progress' | 'done' | 'overdue';
//
// const FILTERS: { label: string; value: Filter }[] = [
//   { label: 'All',         value: 'all'         },
//   { label: 'To do',       value: 'todo'        },
//   { label: 'In progress', value: 'in_progress' },
//   { label: 'Done',        value: 'done'        },
//   { label: 'Overdue',     value: 'overdue'     },
// ];

const STATUS_STYLES: Record<Task['status'], string> = {
  todo:        'bg-slate-100 text-slate-500',
  in_progress: 'bg-blue-50 text-blue-600',
  done:        'bg-green-50 text-green-700',
};


const STATUS_LABELS: Record<string, string> = {
  TODO:        'To do',
  IN_PROGRESS: 'In progress',
  REVIEW:      'Review',
  DONE:        'Done',
};


// const STATUS_LABELS: Record<Task['status'], string> = {
//   todo:        'To do',
//   in_progress: 'In progress',
//   done:        'Done',
// };

const PRIORITY_STYLES: Record<string, string> = {
  High:   'bg-red-50 text-red-600',
  Medium: 'bg-amber-50 text-amber-600',
  Low:    'bg-green-50 text-green-700',
};

const PROJECT_COLORS = [
  '#3b82f6', '#10b981', '#f43f5e',
  '#f59e0b', '#8b5cf6', '#06b6d4',
  '#ec4899', '#84cc16',
];

// --- Helpers ---

function daysFromNow(dateStr: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}

function formatDueDate(dateStr: string | null) {
  if (!dateStr) return null;
  const days = daysFromNow(dateStr);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return 'Due ' + new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// --- Component ---

export default function MyTasksPage() {
  const [filter, setFilter]               = useState<Filter>('ALL');
  const [search, setSearch]               = useState('');
  const [projectFilter, setProjectFilter] = useState<number | 'all'>('all');
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: tasksApi.getMyTasks,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const updateStatusMutation = useMutation({

    mutationFn: ({ id, status }: { id: number; status: Task['status'] }) =>
      tasksApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-tasks'] }),
  });

  const isOverdue = (t: Task) =>
    t.status !== 'DONE' && t.due_date !== null && new Date(t.due_date) < new Date();

  const getProjectName = (pid: number) =>
    projects.find(p => p.id === pid)?.title ?? `Project #${pid}`;

  const getProjectColor = (pid: number) =>
    PROJECT_COLORS[pid % PROJECT_COLORS.length];

  const filtered = tasks.filter(t => {
    if (filter === 'OVERDUE' && !isOverdue(t)) return false;
    if (filter !== 'ALL' && filter !== 'OVERDUE' && t.status !== filter) return false;
    if (projectFilter !== 'all' && t.project_id !== projectFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, t) => {
    if (!acc[t.project_id]) acc[t.project_id] = [];
    acc[t.project_id].push(t);
    return acc;
  }, {} as Record<number, Task[]>);

  const toggleDone = (task: Task) => {
    updateStatusMutation.mutate({
      id: task.id,
      status: task.status === 'DONE' ? 'TODO' : 'DONE',
    });
  };

  const changeStatus = (id: number, status: Task['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  const stats = [
    { label: 'Total',       value: tasks.length,                                          color: 'text-gray-900' },
    { label: 'In progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length,  color: 'text-blue-600' },
    { label: 'Overdue',     value: tasks.filter(t => isOverdue(t)).length,                color: 'text-red-500'  },
    { label: 'Done',        value: tasks.filter(t => t.status === 'DONE').length,          color: 'text-green-600'},
  ];

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
          <p className="text-red-600 font-semibold">Failed to load tasks</p>
          <p className="text-red-400 text-sm mt-1">Make sure the boards service is running</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Project filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="pl-11 pr-8 py-3 bg-slate-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none appearance-none cursor-pointer text-slate-700 font-medium min-w-[160px] transition-all"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
              filter === f.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <CheckSquare size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">No tasks found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {filter === 'ALL' && !search
              ? "You don't have any tasks assigned yet."
              : 'Try adjusting your filters or search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([pid, projectTasks]) => (
            <section key={pid}>

              {/* Project header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: getProjectColor(Number(pid)) }}
                />
                <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">
                  {getProjectName(Number(pid))}
                </h2>
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">
                  {projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {projectTasks.map(task => {
                  const overdue    = isOverdue(task);
                  const done       = task.status === 'DONE';
                  const dueDateStr = formatDueDate(task.due_date);

                  return (
                    <div
                      key={task.id}
                      className={`group flex items-center gap-4 p-4 bg-white border rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                        overdue && !done ? 'border-red-100' : 'border-gray-100'
                      } ${done ? 'opacity-60' : ''}`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleDone(task)}
                        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          done ? 'bg-gray-900 border-gray-900' : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {done && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold text-gray-800 truncate ${done ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_STYLES[task.status]}`}>
                            {STATUS_LABELS[task.status]}
                          </span>
                          {task.priority && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${PRIORITY_STYLES[task.priority] ?? 'bg-slate-50 text-slate-500'}`}>
                              {task.priority}
                            </span>
                          )}
                          {overdue && !done && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-500">
                              Overdue
                            </span>
                          )}
                          {dueDateStr && (
                            <span className={`text-xs ${overdue && !done ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                              {dueDateStr}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status dropdown — appears on hover */}
                      <select
                        value={task.status}
                        onChange={e => changeStatus(task.id, e.target.value as Task['status'])}
                        className="text-xs border border-slate-100 rounded-lg px-2 py-1.5 bg-slate-50 text-slate-500 cursor-pointer outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <option value="TODO">To do</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
