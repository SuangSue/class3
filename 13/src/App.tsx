import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Members from './pages/Members';
import Announcements from './pages/Announcements';
import Grades from './pages/Grades';
import Resources from './pages/Resources';
import Activities from './pages/Activities';
import Login from './components/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import PublishGrades from './pages/PublishGrades';

interface User {
  name: string;
  role: string;
  avatar?: string;
  class?: string;
  motto?: string;
  position?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={
              <PrivateRoute user={user} component={Members} />
            } />
            <Route path="/announcements" element={
              <PrivateRoute user={user} component={() => <Announcements user={user} />} />
            } />
            <Route path="/grades" element={
              <PrivateRoute user={user} component={() => <Grades user={user} />} />
            } />
            <Route path="/resources" element={
              <PrivateRoute user={user} component={Resources} />
            } />
            <Route path="/activities" element={
              <PrivateRoute user={user} component={Activities} />
            } />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/profile" element={user ? <Profile user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/publish-grades" element={
              <PrivateRoute user={user} component={PublishGrades} />
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;