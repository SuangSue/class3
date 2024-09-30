import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface HeaderProps {
  user: User | null;
  isDebugMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, isDebugMode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const navItems = [
    { name: '首页', path: '/' },
    { name: '班级成员', path: '/members' },
    { name: '班级动态', path: '/announcements' },
    { name: '成绩与作业', path: '/grades' },
    { name: '学习资源', path: '/resources' },
    { name: '活动与投票', path: '/activities' }
  ];

  return (
    <header style={{ position: 'relative' }}>
      <div className="header-content">
        <h1 className="class-name">高一三班</h1>
        <nav>
          {navItems.map((item, index) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="nav-link"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="user-actions">
          {currentUser ? (
            <Link to="/profile" className="user-profile">
              <img 
                src={currentUser.avatar || 'https://via.placeholder.com/40'} 
                alt="用户头像" 
                className="user-avatar" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = 'https://via.placeholder.com/40';
                }}
              />
              <span>{currentUser.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="login-btn">登录</Link>
          )}
        </div>
      </div>
      {isDebugMode && (
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '0',
          width: '100%',
          backgroundColor: '#ffeb3b',
          color: '#000',
          textAlign: 'center',
          padding: '2px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          目前在调试模式
        </div>
      )}
    </header>
  );
};

export default Header;