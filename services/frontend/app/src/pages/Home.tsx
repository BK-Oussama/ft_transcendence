import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-xl font-black tracking-tighter text-blue-600">ft_transcendence</div>
        <div className="space-x-4">
          <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
          Modern Workspace <br /> 
          <span className="text-blue-600">Simplified.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed">
          Manage your boards, chat with your team, and track your progress in one unified environment. Built for the 42 community.
        </p>
        <Link to="/register" className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl">
          Get Started
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </main>

      {/* Required Legal Footer */}
      <footer className="p-8 border-t border-gray-100 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/privacy" className="text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors uppercase tracking-widest">Privacy Policy</Link>
          <Link to="/terms" className="text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors uppercase tracking-widest">Terms of Service</Link>
        </div>
        <p className="text-[10px] text-gray-300 font-medium">© 2026 ft_transcendence Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;