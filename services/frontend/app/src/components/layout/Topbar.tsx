// import { LogOut, Settings, ChevronDown, CheckSquare, Users, LayoutDashboard, Calendar } from 'lucide-react';
// import { useState, useRef, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const PAGE_META: Record<string, { label: string; icon: React.ElementType }> = {
//   '/dashboard': { label: 'Dashboard', icon: LayoutDashboard },
//   '/members':   { label: 'Members',   icon: Users },
//   '/tasks':     { label: 'My Tasks',  icon: CheckSquare },
//   '/calendar':  { label: 'Calendar',  icon: Calendar },
//   '/board': { label: 'Kanban Board', icon: LayoutDashboard },
// };

// // ⚠️ TODO: replace with useQuery(['me'], authApi.me) when ready
// const MOCK_USER = {
//   firstName: 'Alex',
//   lastName: 'Rivera',
//   email: 'alex.rivera@example.com',
//   avatar: null,
// };

// const Topbar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const location = useLocation();

//   const user = MOCK_USER;
//   const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
//   const fullName = `${user.firstName} ${user.lastName}`;

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const currentPage = PAGE_META[location.pathname];
//   const PageIcon = currentPage?.icon;

//   return (
//     <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 border-b border-slate-100">

//       {/* Left — current page title */}
//       <div className="flex items-center gap-3">
//         <div>
//           <h2 className="text-lg font-bold text-slate-800 leading-none">
//             {currentPage?.label ?? 'Welcome'}
//           </h2>
//           <p className="text-xs text-slate-400 mt-0.5">
//             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//           </p>
//         </div>
//       </div>

//       {/* Right — user menu */}
//       <div className="relative" ref={dropdownRef}>
//         <button
//           onClick={() => setDropdownOpen(prev => !prev)}
//           className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
//         >
//           {/* Avatar */}
//           <div className="relative">
//             <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
//               {user.avatar
//                 ? <img src={user.avatar} className="h-full w-full object-cover rounded-full" />
//                 : initials
//               }
//             </div>
//             <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
//           </div>

//           {/* Name + role */}
//           <div className="hidden sm:block text-left">
//             <p className="text-sm font-semibold text-slate-700 leading-none">{fullName}</p>
//             <p className="text-xs text-slate-400 mt-0.5">Member</p>
//           </div>

//           <ChevronDown
//             size={15}
//             className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
//           />
//         </button>

//         {/* Dropdown */}
//         {dropdownOpen && (
//           <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden z-50">

//             {/* User info header */}
//             <div className="px-4 py-3 border-b border-slate-50">
//               <p className="text-sm font-bold text-slate-800">{fullName}</p>
//               <p className="text-xs text-slate-400 truncate">{user.email}</p>
//             </div>

//             {/* Menu items */}
//             <div className="p-1.5">
//               <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
//                 <Settings size={16} className="text-slate-400" />
//                 Settings
//               </button>
//               <button
//                 onClick={() => {
//                   localStorage.removeItem('access_token');
//                   window.location.href = '/login';
//                 }}
//                 className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
//               >
//                 <LogOut size={16} />
//                 Sign out
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Topbar;



import { LogOut, Settings, ChevronDown, CheckSquare, Users, LayoutDashboard, Calendar, LayoutGrid } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PAGE_META: Record<string, { label: string; icon: React.ElementType }> = {
  '/dashboard':   { label: 'Dashboard',           icon: LayoutDashboard },
  '/members':     { label: 'Members',             icon: Users },
  '/tasks':       { label: 'My Tasks',            icon: CheckSquare },
  '/calendar':    { label: 'Calendar',            icon: Calendar },
  '/board':       {  label: 'Kanban Board',       icon: LayoutGrid },
};

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '??';
  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : '...';
  
    const rawAvatar = user?.avatar || user?.avatarUrl;
    const avatarUrl = rawAvatar ? `https://localhost${rawAvatar}` : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const currentPage = PAGE_META[location.pathname];

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 border-b border-slate-100">

      {/* Left — current page title */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-none">
            {currentPage?.label ?? 'Welcome'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right — user menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
        >
          {/* Avatar */}
          <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                {avatarUrl
                  ? <img src={avatarUrl} className="h-full w-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                  : initials
                }
              </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
          </div>

          {/* Name + role */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-700 leading-none">{fullName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.jobTitle || 'Member'}</p>
          </div>

          <ChevronDown
            size={15}
            className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden z-50">

            {/* User info header */}
            <div className="px-4 py-3 border-b border-slate-50">
              <p className="text-sm font-bold text-slate-800">{fullName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>

            {/* Menu items */}
            <div className="p-1.5">
              <button 
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                onClick={() => { navigate('/settings'); setDropdownOpen(false); }}  
              >
                <Settings size={16} className="text-slate-400" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
