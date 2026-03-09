import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[#12131a]">
      {/* 1. The Fixed Sidebar - This stays visible on every app page */}
      <Sidebar currentView="board" onViewChange={() => {}} /> 
      
      {/* 2. The Dynamic Area - This is where the content "swaps" */}
      <div className="flex-1 overflow-hidden bg-white rounded-l-[32px] my-2 mr-2 shadow-2xl">
        {/* The Outlet is a placeholder. 
            When you go to /boards, BoardPage renders here.
            When you go to /chat, ChatPage renders here. */}
        <Outlet /> 
      </div>
    </div>
  );
}