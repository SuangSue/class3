import React from 'react';
import { Navigate } from 'react-router-dom';

interface User {
  name: string;
  role: string;
  class?: string;
}

interface PrivateRouteProps {
  user: User | null;
  children: React.ReactNode;
}

function PrivateRoute({ user, children }: PrivateRouteProps) {
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default PrivateRoute;