import React, { useState, useEffect } from 'react';
import AuthContainer from './Auth/AuthContainer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ContactUs from './pages/Contact';
import './App.css';
import MyTeamMembers from './components/TeamManagement/MyTeamMembers';
import ProfileUpdateModal from './components/Edit_profile';
import MatchesManagement from './pages/Matches';
import Scoreboard from './components/scoreboard/Scoreboard';
import MyTeams from './components/TeamManagement/MyTeams'; 
import AllTeams from './components/TeamManagement/AllTeams'; 
import Shop from './pages/Shop'; // Import the Shop component
import ShopDetail from './components/ShopDetail';
import AddCart from './components/shops/AddCart';
import AddFav from './components/shops/AddFav';

function App() {
  const [lastActivity, setLastActivity] = useState(localStorage.getItem('lastActivity') || Date.now());

  // Check for inactivity and log out after 24 hours
  useEffect(() => {
    const checkInactivity = () => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivity;

      if (timeSinceLastActivity > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('lastActivity');
        window.location.href = '/login';
      }
    };

    const activityListener = () => {
      localStorage.setItem('lastActivity', Date.now());
      setLastActivity(Date.now());
    };

    window.addEventListener('mousemove', activityListener);
    window.addEventListener('keypress', activityListener);

    const inactivityInterval = setInterval(checkInactivity, 1000 * 60 * 60); // Check every hour

    return () => {
      window.removeEventListener('mousemove', activityListener);
      window.removeEventListener('keypress', activityListener);
      clearInterval(inactivityInterval);
    };
  }, [lastActivity]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<AuthContainer />} /> 
          <Route path="/" element={<Home />} />
          <Route path="/contact-us" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><ProfileUpdateModal /></ProtectedRoute>} />
          <Route path="/matches" element={<MatchesManagement />} />
          <Route path="/team-members/:id" element={<ProtectedRoute><MyTeamMembers /></ProtectedRoute>} />
          <Route path="/my-teams" element={<ProtectedRoute><MyTeams /></ProtectedRoute>} /> 
          <Route path="/all-teams" element={<ProtectedRoute><AllTeams /></ProtectedRoute>} /> 
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} /> {/* Added Shop route */}
          <Route path="/shop-detail/:id" element={<ProtectedRoute><ShopDetail /></ProtectedRoute>} />
          <Route path="/addcart" element={<ProtectedRoute><AddCart /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><AddFav /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const lastActivity = localStorage.getItem('lastActivity');
  const currentTime = Date.now();
  const timeSinceLastActivity = currentTime - lastActivity;

  if (!token || timeSinceLastActivity > 24 * 60 * 60 * 1000) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastActivity');
    return <Navigate to="/" />;
  }

  return children;
};

export default App;