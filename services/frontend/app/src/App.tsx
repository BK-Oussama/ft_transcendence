// import './index.css'; old

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import BoardPage from './features/boards/BoardPage';
import Home from './features/home/Home';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import OAuthSuccess from './features/auth/OAuthSuccess';

import { AuthProvider } from './context/AuthContext';

// Placeholder components
const ChatPlaceholder = () => <div className="p-10"><h1>Chat Service Coming Soon</h1></div>;
const TasksPlaceholder = () => <div className="p-10"><h1>Tasks Page Coming Soon</h1></div>;
const CalendarPlaceholder = () => <div className="p-10"><h1>Calendar Page Coming Soon</h1></div>;
const SettingsPlaceholder = () => <div className="p-10"><h1>Settings Page Coming Soon</h1></div>;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. THE LANDING ZONE - No Sidebar, just the Home Page */}
          <Route path="/" element={<Home />} />

          {/* 2. THE SECURITY ZONE - Login/Register, No Sidebar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          {/* <Route path="/auth" element={<AuthPlaceholder />} /> */}

          {/* 3. THE APP ZONE - Everything inside here HAS the Sidebar */}
          <Route element={<MainLayout />}>
            <Route path="/boards" element={<BoardPage />} />
            <Route path="/chat" element={<ChatPlaceholder />} />
            <Route path="/tasks" element={<TasksPlaceholder />} />
            <Route path="/calendar" element={<CalendarPlaceholder />} />
            <Route path="/settings" element={<SettingsPlaceholder />} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Route>

          {/* 4. 404 falback - THE SAFETY NET - Redirect unknown URLs to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}