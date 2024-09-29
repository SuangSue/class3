import React, { useState, useEffect, ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingBar from './components/LoadingBar'; // 新增
import Home from './pages/Home';
import Members from './pages/Members';
import Announcements from './pages/Announcements';
import Grades from './pages/Grades';
import Resources from './pages/Resources';
import Activities from './pages/Activities';
import Login from './components/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import PublishGrades from './pages/PublishGrades';  // 确保这行存在
import AllGrades from './pages/AllGrades';
import GradeAnalysis from './pages/GradeAnalysis';

interface User {
  name: string;
  role: string;
  avatar?: string;
  class?: string;
  motto?: string;
  position?: string;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [showDebugAlert, setShowDebugAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 新增

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsDebugMode(false);
    // 模拟加载过程
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1秒后结束加载
  }, []);

  const handleLogin = (userData: User) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    const updatedUser = storedUsers[userData.name] || userData;
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setIsDebugMode(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setIsDebugMode(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const handleDebugModeToggle = (isActive: boolean) => {
    setIsDebugMode(isActive);
    if (isActive) {
      setShowDebugAlert(true);
      setTimeout(() => setShowDebugAlert(false), 3000);
    }
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Header user={user} isDebugMode={isDebugMode} />
          <LoadingBar isLoading={isLoading} /> {/* 新增 */}
          <main>
            {showDebugAlert && (
              <div className="debug-alert" style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                zIndex: 1000
              }}>
                已进入调试模式
              </div>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/members" element={
                <PrivateRoute user={user}>
                  <Members user={user} isDebugMode={isDebugMode} />
                </PrivateRoute>
              } />
              <Route path="/announcements" element={
                <PrivateRoute user={user}>
                  <Announcements user={user} isDebugMode={isDebugMode} />
                </PrivateRoute>
              } />
              <Route path="/grades" element={
                <PrivateRoute user={user}>
                  <Grades user={user} isDebugMode={isDebugMode} />
                </PrivateRoute>
              } />
              <Route path="/resources" element={
                <PrivateRoute user={user}>
                  <Resources />
                </PrivateRoute>
              } />
              <Route path="/activities" element={
                <PrivateRoute user={user}>
                  <Activities />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/profile" element={user ? <Profile user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onDebugModeToggle={handleDebugModeToggle} /> : <Navigate to="/login" />} />
              <Route path="/publish-grades" element={
                <PrivateRoute user={user}>
                  <PublishGrades user={user} isDebugMode={isDebugMode} />
                </PrivateRoute>
              } />
              <Route path="/all-grades" element={
                <PrivateRoute user={user}>
                  {(user?.role === 'teacher' || isDebugMode) ? (
                    <AllGrades user={user} isDebugMode={isDebugMode} />
                  ) : (
                    <Navigate to="/grades" />
                  )}
                </PrivateRoute>
              } />
              <Route path="/grade-analysis" element={
                <PrivateRoute user={user}>
                  <GradeAnalysis user={user} isDebugMode={isDebugMode} />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;