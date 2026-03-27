import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import MembersPage from './pages/MembersPage';
import MyTasksPage from './pages/MyTasksPage';
import KanbanBoardPage from './pages/KanbanBoardPage';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import OAuthSuccess from './components/auth/OAuthSuccess';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SettingsPage } from './pages/SettingsPage';
import ChatPage from './pages/ChatPage';

import UserProfile from './pages/UserProfile';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/tasks" element={<MyTasksPage />} />
            <Route path="/board" element={<KanbanBoardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile/:id" element={<UserProfile />} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

