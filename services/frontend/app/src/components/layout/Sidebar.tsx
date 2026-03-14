import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, Calendar, MessageSquare, ListTodo, ChevronDown } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-72 h-screen bg-[#12131a] text-slate-400 flex flex-col border-r border-gray-900/50">
      <div className="p-6">
        <div className="h-8 w-32 bg-gray-800/50 rounded mb-6 opacity-50"></div>
        <div className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Workspace Switcher</div>
        <button className="flex items-center justify-between w-full bg-[#1f212d] text-white p-3 rounded-xl hover:bg-[#2a2d3d] transition-colors border border-gray-800/50">
          <span className="font-medium text-sm">Product Launch</span>
          <ChevronDown size={18} className="text-slate-400" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {/* Navigation Links */}
        <SidebarLink to="/boards" icon={<LayoutDashboard size={20} />} label="Board" />
        <SidebarLink to="/chat" icon={<MessageSquare size={20} />} label="Chat" />
        <SidebarLink to="/tasks" icon={<ListTodo size={20} />} label="My Tasks" />
        <SidebarLink to="/calendar" icon={<Calendar size={20} />} label="Calendar" />
        <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
    </div>
  );
};

// A helper component to handle the "Active" styling automatically
function SidebarLink({ to, icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default Sidebar;