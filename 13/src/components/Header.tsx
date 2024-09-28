import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header>
      <div className="header-content">
        <h1 className="class-name">高一三班</h1>
        <nav>
          <ul>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/members">班级成员</Link></li>
            <li><Link to="/announcements">班级动态</Link></li>
            <li><Link to="/grades">成绩与作业</Link></li>
            <li><Link to="/resources">学习资源</Link></li>
            <li><Link to="/activities">活动与投票</Link></li>
          </ul>
        </nav>
        <div className="user-actions">
          {user ? (
            <Link to="/profile" className="user-profile">
              <img src={user.avatar || 'https://via.placeholder.com/40'} alt="用户头像" className="user-avatar" />
              <span>{user.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="login-btn">登录</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;