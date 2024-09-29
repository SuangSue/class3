import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/layout.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/home.css';
import './styles/members.css';
import './styles/announcements.css';
import './styles/resources.css';
import './styles/components.css';
import './styles/utilities.css';
import './styles/activities.css';
import './styles/grades.css';
import './styles/login.css';
import './styles/profile.css';
import './styles/publishGrades.css';
import './styles/allGrades.css';
import './styles/loadingBar.css';
import './styles/gradeAnalysis.css';
import './styles/animations.css';

// 添加全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', message, 'at', source, lineno, colno, error);
  return false;
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);