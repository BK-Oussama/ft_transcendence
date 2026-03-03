import { Link } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, ShieldCheck, Activity } from 'lucide-react';

const Home = () => {
  const tools = [
    { name: 'Kanban Board', path: '/boards', icon: LayoutDashboard, desc: 'Organize tasks and track progress.' },
    { name: 'Team Chat', path: '/chat', icon: MessageSquare, desc: 'Discuss projects in real-time.' },
    { name: 'Dashboard', path: '/dashboard', icon: Activity, desc: 'Overview of your productivity.' },
    { name: 'Account', path: '/auth', icon: ShieldCheck, desc: 'Manage your profile and security.' },
  ];

  return (
    <div className="min-h-screen bg-[#0f1016] text-slate-200 flex flex-col items-center justify-center p-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Workspace</h1>
        <p className="text-slate-500">Manage your tasks and collaborate with your team.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full">
        {tools.map((tool) => (
          <Link 
            key={tool.name} 
            to={tool.path}
            className="p-5 bg-[#12131a] border border-slate-800 rounded-lg hover:border-slate-600 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <tool.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <div>
                <h2 className="text-lg font-medium text-white">{tool.name}</h2>
                <p className="text-slate-500 text-sm">{tool.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;