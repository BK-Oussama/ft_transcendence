import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Feature Imports
import Home from './features/home/Home';
import BoardPage from './features/boards/KanbanBoardPage'; // Import your Board UI
import { RegisterPage } from './features/auth/pages/RegisterPage'; // Updated paths
import { LoginPage } from './features/auth/pages/LoginPage'; // Updated paths
import OAuthSuccess from './features/auth/OAuthSuccess';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. PUBLIC ZONE - No Sidebar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* 2. PROTECTED ZONE - Wraps everything in Sidebar + Auth Check */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<div>Welcome to Dashboard</div>} />
            
            {/* THIS IS THE MISSING LINK! */}
            <Route path="/boards" element={<BoardPage />} />
            
            {/* Future Chat Route */}
            <Route path="/chat" element={<div>Chat Coming Soon</div>} />
          </Route>

          {/* 3. SAFETY NET */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

 