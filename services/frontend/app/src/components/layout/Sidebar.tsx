import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  MessageCircle,
  CheckSquare,
  FolderKanban,
  LayoutGrid,
  ChevronLeft,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../api/tasks';
import { projectsApi } from '../../api/projects';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Project ID logic from URL
  const urlProjectId = new URLSearchParams(location.search).get('projectId');
  const isInWorkspace = !!urlProjectId;
  const projectId = Number(urlProjectId) || 1;

  //Real-time Updates
  useEffect(() => {
    const socket = io("https://localhost", {
      path: '/api/socket.io/',
      transports: ["websocket"],
      secure: true,
    });

    const refreshSidebarStats = () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    };

    socket.on("task:created", refreshSidebarStats);
    socket.on("task:updated", refreshSidebarStats);
    socket.on("task:deleted", refreshSidebarStats);
    socket.on("board:updated", refreshSidebarStats);

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  // data Fetching
  const { data: tasks = [] } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: tasksApi.getMyTasks,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  // Stats Calculation
  const currentProject = projects.find(p => p.id === projectId);
  const doneTasks = tasks.filter(t => t.status === 'DONE').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const overdueCount = tasks.filter(t => 
    t.status !== 'DONE' && t.due_date && new Date(t.due_date) < new Date()
  ).length;

  // navigation items
  const mainMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Tasks', icon: ListTodo, path: '/tasks' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Chat', icon: MessageCircle, path: '/chat' },
  ];

  const workspaceMenuItems = [
    { name: 'Board', icon: LayoutGrid, path: `/board?projectId=${projectId}` },
    { name: 'Members', icon: Users, path: `/members?projectId=${projectId}` },
    { name: 'My Tasks', icon: ListTodo, path: `/tasks?projectId=${projectId}` },
    { name: 'Calendar', icon: Calendar, path: `/calendar?projectId=${projectId}` },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`
          fixed bottom-6 right-6 z-[50] p-4 
          bg-blue-400 text-white rounded-full 
          md:hidden shadow-2xl shadow-blue-400/40 
          hover:bg-blue-700 active:scale-95 transition-all
          border border-white/10
        `}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[80] md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-[90] w-64 bg-[#1a1d24] flex flex-col text-gray-300 border-r border-gray-800/50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 md:flex
      `}>

        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 gap-2 shrink-0">
          <LayoutDashboard size={24} className="text-blue-500" />
          <span className="text-xl font-semibold text-white tracking-tight">KANBAN</span>
        </div>

        {/* Content Wrapper (Closes sidebar on click for mobile UX) */}
        <div className="flex-1 flex flex-col overflow-hidden" onClick={() => setIsOpen(false)}>
          
          {isInWorkspace ? (
            <>
              <div className="px-4 pb-4">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
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

              <nav className="flex-1 pt-2 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-8 mb-4">
                  Navigation
                </p>
                {workspaceMenuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `
                      group relative flex items-center gap-3 px-4 py-2.5 transition-all duration-200 rounded-xl mx-4 mb-1
                      ${isActive ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-[#252930] hover:text-gray-200'}
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
            </>
          ) : (
            <>
              <nav className="flex-1 pt-4 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-8 mb-4">
                  Workspace
                </p>
                {mainMenuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      group relative flex items-center gap-3 px-4 py-2.5 transition-all duration-200 rounded-xl mx-4 mb-1
                      ${isActive ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-[#252930] hover:text-gray-200'}
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
            </>
          )}

          <div className="p-4 mx-2 mb-4 rounded-2xl bg-[#252930] border border-gray-800/50 shrink-0">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
              {isInWorkspace ? 'Project Stats' : 'Quick Stats'}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare size={13} className="text-blue-400" />
                  <span className="text-xs text-gray-400 font-medium">Tasks done</span>
                </div>
                <span className="text-xs font-bold text-gray-300">{doneTasks}/{totalTasks}</span>
              </div>

              <div className="space-y-1.5">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-600 font-bold uppercase">{progress}% complete</p>
                </div>
              </div>

              {!isInWorkspace && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                  <div className="flex items-center gap-2">
                    <FolderKanban size={13} className="text-indigo-400" />
                    <span className="text-xs text-gray-400 font-medium">Projects</span>
                  </div>
                  <span className="text-xs font-bold text-gray-300">{projects.length}</span>
                </div>
              )}

              {overdueCount > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-gray-400 font-medium">Overdue</span>
                  </div>
                  <span className="text-xs font-bold text-red-400">{overdueCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;