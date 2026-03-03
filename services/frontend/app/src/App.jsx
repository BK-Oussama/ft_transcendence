// import './index.css'; old

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import BoardPage from './features/boards/BoardPage';
import Home from './features/home/Home';

// Placeholder components
const HomePlaceholder = () => <div className="p-20 text-center"><h1>Welcome to our Project (Home Page)</h1><p>Landing page content here...</p></div>;
const ChatPlaceholder = () => <div className="p-10"><h1>Chat Service Coming Soon</h1></div>;
const AuthPlaceholder = () => <div className="p-10"><h1>Login / Signup Page</h1></div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. THE LANDING ZONE - No Sidebar, just the Home Page */}
        <Route path="/" element={<Home />} />

        {/* 2. THE SECURITY ZONE - Login/Register, No Sidebar */}
        <Route path="/auth" element={<AuthPlaceholder />} />

        {/* 3. THE APP ZONE - Everything inside here HAS the Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/boards" element={<BoardPage />} />
          <Route path="/chat" element={<ChatPlaceholder />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Route>

        {/* 4. 404 falback - THE SAFETY NET - Redirect unknown URLs to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}