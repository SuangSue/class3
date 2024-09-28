import React from 'react';
import { Navigate } from 'react-router-dom';

interface User {
  name: string;
  role: string;
  class?: string;
}

interface PrivateRouteProps {
  user: User | null;
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user, component: Component }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'teacher') {
    // 教师可以访问所有页面
    return <Component />;
  }

  if (user.role === 'student' && user.class !== '高一三班') {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default PrivateRoute;