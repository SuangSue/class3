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

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);