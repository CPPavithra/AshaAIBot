import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import NavigationBar from './components/NavigationBar';
import EditProfile from './components/EditProfile'; // Import EditProfile
import Diversity from './components/DiversityViewer';
import History from './components/Chathistory.js';
import Newchatbot from './components/Chatwithhistory.js';
import Newchat from './components/NewChat.js';
import Job from './components/JobsPage.js';


const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const excludedRoutes = ['/', '/login', '/signup'];
  const shouldShowNavigationBar = !excludedRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} /> {/* Add the EditProfile route */}
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/diversity" element={<Diversity />} />
         <Route path="/chat" element={<Newchatbot />} />
         <Route path="/new" element={<Newchat />} />
         <Route path="/history" element={<History userId="user123" />} />
         <Route path="/jobs" element={<Job />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {shouldShowNavigationBar && <NavigationBar />}
    </div>
  );
}

export default App;
