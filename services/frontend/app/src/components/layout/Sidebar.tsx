// import { NavLink } from 'react-router-dom';
// import { 
//     LayoutDashboard, 
//     ListTodo, 
//     Calendar, 
//     Settings, 
//     LogOut, 
//     ChevronUp, 
//     MessageCircle
// } from 'lucide-react';

// const Sidebar = () => {
//     const menuItems = [
//         { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
//         { name: 'My Tasks', icon: ListTodo, path: '/tasks' },
//         { name: 'Calendar', icon: Calendar, path: '/calendar' },
//         { name: 'Chat', icon: MessageCircle, path: '/chat' },
//     ];

//     return (
//         <div className="w-64 bg-[#1a1d24] h-screen flex flex-col text-gray-300 border-r border-gray-800/50">
//             {/* Logo/Brand Area */}
//             <div className="h-16 flex items-center px-6 gap-2">
//                 <LayoutDashboard size={24} className="text-blue-500" />
//                 <span className="text-xl font-semibold text-white tracking-tight">
//                     KANBAN
//                 </span>
//             </div>

//             {/* Navigation Menu */}
//             <nav className="flex-1 pt-4 overflow-y-auto">
//                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-8 mb-4">
//                     Workspace
//                 </p>
                
//                 {menuItems.map((item) => (
//                     <NavLink
//                         key={item.path}
//                         to={item.path}
//                         className={({ isActive }) => `
//                             group relative flex items-center gap-3 px-4 py-2.5 transition-all duration-200 rounded-xl mx-4 mb-1
//                             ${isActive 
//                                 ? 'bg-blue-600/10 text-blue-400' 
//                                 : 'text-gray-400 hover:bg-[#252930] hover:text-gray-200'
//                             }
//                         `}>
//                         {({ isActive }) => (
//                             <>
//                                 {/* Active Indicator Bar */}
//                                 {isActive && (
//                                     <div className="absolute left-[-16px] w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
//                                 )}
                                
//                                 <item.icon 
//                                     size={18} 
//                                     className={`shrink-0 ${isActive ? 'text-blue-500' : 'group-hover:text-gray-200'}`} 
//                                 />
//                                 <span className="text-sm font-semibold">{item.name}</span>
//                             </>
//                         )}
//                     </NavLink>
//                 ))}
//             </nav>

//             {/* Bottom Section */}
//             <div className="p-4 space-y-2 mt-auto">
//                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-8 mb-2">
//                     Account
//                 </p>
                
//                 {/* Secondary Links */}
//                 <NavLink
//                     to="/settings"
//                     className={({ isActive }) => `
//                         flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2 transition-colors
//                         ${isActive ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'}
//                     `}
//                 >
//                     <Settings size={18} />
//                     <span className="text-sm font-medium">Settings</span>
//                 </NavLink>

                
//             </div>
//         </div>
//     );
// };

// export default Sidebar;


// import { NavLink } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   ListTodo,
//   Calendar,
//   MessageCircle,
//   CheckSquare,
//   FolderKanban,
// } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { tasksApi } from '../../api/tasks';
// import { projectsApi } from '../../api/projects';

// const Sidebar = () => {
//   const menuItems = [
//     { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
//     { name: 'My Tasks',  icon: ListTodo,         path: '/tasks' },
//     { name: 'Calendar',  icon: Calendar,          path: '/calendar' },
//     { name: 'Chat',      icon: MessageCircle,     path: '/chat' },
//   ];

//   const { data: tasks = [] } = useQuery({
//     queryKey: ['my-tasks'],
//     queryFn: tasksApi.getMyTasks,
//   });

//   const { data: projects = [] } = useQuery({
//     queryKey: ['projects'],
//     queryFn: projectsApi.getAll,
//   });

//   const doneTasks  = tasks.filter(t => t.status === 'done').length;
//   const totalTasks = tasks.length;
//   const progress   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

//   return (
//     <div className="w-64 bg-[#1a1d24] h-screen flex flex-col text-gray-300 border-r border-gray-800/50">

//       {/* Logo */}
//       <div className="h-16 flex items-center px-6 gap-2">
//         <LayoutDashboard size={24} className="text-blue-500" />
//         <span className="text-xl font-semibold text-white tracking-tight">KANBAN</span>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 pt-4 overflow-y-auto">
//         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-8 mb-4">
//           Workspace
//         </p>
//         {menuItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             className={({ isActive }) => `
//               group relative flex items-center gap-3 px-4 py-2.5 transition-all duration-200 rounded-xl mx-4 mb-1
//               ${isActive
//                 ? 'bg-blue-600/10 text-blue-400'
//                 : 'text-gray-400 hover:bg-[#252930] hover:text-gray-200'}
//             `}
//           >
//             {({ isActive }) => (
//               <>
//                 {isActive && (
//                   <div className="absolute left-[-16px] w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
//                 )}
//                 <item.icon
//                   size={18}
//                   className={`shrink-0 ${isActive ? 'text-blue-500' : 'group-hover:text-gray-200'}`}
//                 />
//                 <span className="text-sm font-semibold">{item.name}</span>
//               </>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Bottom — Quick Stats */}
//       <div className="p-4 mx-2 mb-4 rounded-2xl bg-[#252930] border border-gray-800/50">
//         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
//           Quick Stats
//         </p>

//         {/* Tasks progress */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between mb-1.5">
//             <div className="flex items-center gap-2">
//               <CheckSquare size={13} className="text-blue-400" />
//               <span className="text-xs text-gray-400 font-medium">Tasks done</span>
//             </div>
//             <span className="text-xs font-bold text-gray-300">{doneTasks}/{totalTasks}</span>
//           </div>
//           {/* Progress bar */}
//           <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-blue-500 rounded-full transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//           <p className="text-[10px] text-gray-600 mt-1">{progress}% complete</p>
//         </div>

//         {/* Projects count */}
//         <div className="flex items-center justify-between py-2.5 border-t border-gray-800/60">
//           <div className="flex items-center gap-2">
//             <FolderKanban size={13} className="text-indigo-400" />
//             <span className="text-xs text-gray-400 font-medium">Projects</span>
//           </div>
//           <span className="text-xs font-bold text-gray-300">{projects.length}</span>
//         </div>

//         {/* Overdue count */}
//         {tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date()).length > 0 && (
//           <div className="flex items-center justify-between py-2.5 border-t border-gray-800/60">
//             <div className="flex items-center gap-2">
//               <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
//               <span className="text-xs text-gray-400 font-medium">Overdue</span>
//             </div>
//             <span className="text-xs font-bold text-red-400">
//               {tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date()).length}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  MessageCircle,
  CheckSquare,
  FolderKanban,
  LayoutGrid,
  MessageSquare,
  Settings,
  ChevronLeft,
  Users,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../../api/tasks';
import { projectsApi } from '../../api/projects';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInWorkspace = ['/board', '/members', '/settings'].includes(location.pathname);
//   const projectId = Number(searchParams.get('projectId')) || 1;

const projectId = Number(new URLSearchParams(location.search).get('projectId')) || 1;

  const mainMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'My Tasks',  icon: ListTodo,         path: '/tasks' },
    { name: 'Calendar',  icon: Calendar,          path: '/calendar' },
    { name: 'Chat',      icon: MessageCircle,     path: '/chat' },
  ];

  const workspaceMenuItems = [
    { name: 'Board',     icon: LayoutGrid,     path: `/board?projectId=${projectId}` },
    { name: 'Members',   icon: Users,          path: `/members?projectId=${projectId}` },
    { name: 'Chat',      icon: MessageSquare,  path: '/chat' },
    { name: 'My Tasks',  icon: ListTodo,       path: '/tasks' },
    { name: 'Calendar',  icon: Calendar,       path: '/calendar' },
  ];

  const { data: tasks = [] } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: tasksApi.getMyTasks,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const currentProject = projects.find(p => p.id === projectId);
  const doneTasks  = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progress   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="w-64 bg-[#1a1d24] h-screen flex flex-col text-gray-300 border-r border-gray-800/50">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 gap-2">
        <LayoutDashboard size={24} className="text-blue-500" />
        <span className="text-xl font-semibold text-white tracking-tight">KANBAN</span>
      </div>

      {isInWorkspace ? (
        <>
          {/* Workspace header */}
          <div className="px-4 pb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-3"
            >
              <ChevronLeft size={14} />
              Back to Dashboard
            </button>
            <div className="bg-[#252930] border border-gray-800/50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">
                Workspace
              </p>
              <p className="text-sm font-semibold text-white truncate">
                {currentProject?.title ?? `Project #${projectId}`}
              </p>
            </div>
          </div>

          {/* Workspace navigation */}
          <nav className="flex-1 pt-2 overflow-y-auto">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-8 mb-4">
              Navigation
            </p>
            {workspaceMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 px-4 py-2.5 transition-all duration-200 rounded-xl mx-4 mb-1
                  ${isActive
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'text-gray-400 hover:bg-[#252930] hover:text-gray-200'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-[-16px] w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                    )}
                    <item.icon
                      size={18}
                      className={`shrink-0 ${isActive ? 'text-blue-500' : 'group-hover:text-gray-200'}`}
                    />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Workspace stats */}
          <div className="p-4 mx-2 mb-4 rounded-2xl bg-[#252930] border border-gray-800/50">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">
              Project Stats
            </p>
            <div className="flex items-center justify-between py-2 border-b border-gray-800/60">
              <span className="text-xs text-gray-400 font-medium">Total tasks</span>
              <span className="text-xs font-bold text-gray-300">{totalTasks}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800/60">
              <span className="text-xs text-gray-400 font-medium">Done</span>
              <span className="text-xs font-bold text-green-400">{doneTasks}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-400 font-medium">Progress</span>
              <span className="text-xs font-bold text-blue-400">{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Regular navigation */}
          <nav className="flex-1 pt-4 overflow-y-auto">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-8 mb-4">
              Workspace
            </p>
            {mainMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 px-4 py-2.5 transition-all duration-200 rounded-xl mx-4 mb-1
                  ${isActive
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'text-gray-400 hover:bg-[#252930] hover:text-gray-200'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-[-16px] w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                    )}
                    <item.icon
                      size={18}
                      className={`shrink-0 ${isActive ? 'text-blue-500' : 'group-hover:text-gray-200'}`}
                    />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 mx-2 mb-4 rounded-2xl bg-[#252930] border border-gray-800/50">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
              Quick Stats
            </p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <CheckSquare size={13} className="text-blue-400" />
                  <span className="text-xs text-gray-400 font-medium">Tasks done</span>
                </div>
                <span className="text-xs font-bold text-gray-300">{doneTasks}/{totalTasks}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{progress}% complete</p>
            </div>
            <div className="flex items-center justify-between py-2.5 border-t border-gray-800/60">
              <div className="flex items-center gap-2">
                <FolderKanban size={13} className="text-indigo-400" />
                <span className="text-xs text-gray-400 font-medium">Projects</span>
              </div>
              <span className="text-xs font-bold text-gray-300">{projects.length}</span>
            </div>
            {tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date()).length > 0 && (
              <div className="flex items-center justify-between py-2.5 border-t border-gray-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-400 font-medium">Overdue</span>
                </div>
                <span className="text-xs font-bold text-red-400">
                  {tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date()).length}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
