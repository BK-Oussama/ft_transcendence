import { Outlet } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';

export default function Layout() {

    useEffect(() => {
        const socket = io("https://localhost", {
            path: '/api/socket.io/',
            transports: ["websocket"],
            secure: true,
            upgrade: true, 
            rememberUpgrade: true,
            reconnectionAttempts: 10,
        });



        socket.on("notification", (data: { message: string, priority?: string }) => {
            
            const getPriorityColor = (priority?: string) => {
                if (!priority) return 'bg-blue-500';
                const p = priority.toLowerCase();
                if (p === 'high') return 'bg-red-500';
                if (p === 'medium') return 'bg-amber-500';
                if (p === 'low') return 'bg-emerald-500';
                return 'bg-blue-500';
            };
        
            const accentColor = getPriorityColor(data.priority);
        
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-in fade-in slide-in-from-left-5' : 'animate-out fade-out slide-out-to-left-2'} max-w-sm w-full bg-white rounded-xl pointer-events-auto flex items-stretch overflow-hidden border border-slate-100 shadow-lg`}>
                    <div className={`w-1.5 ${accentColor} shrink-0`} />
                    <div className="flex-1 p-3 pl-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="text-slate-400 shrink-0">
                                <Bell size={16} />
                            </div>
                            <p className="text-[13px] font-bold text-slate-700 truncate leading-none">
                                {data.message}
                            </p>
                        </div>
                    </div>
                </div>
            ), { id: 'global-task-update', position: 'top-left', duration: 3500 });
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="flex h-screen bg-slate-50 relative">
          <Toaster />
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
    );
}
