import React from 'react';
import '../styles/loadingBar.css';

interface LoadingBarProps {
  isLoading: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  return (
    <div className={`loading-bar ${isLoading ? 'loading' : ''}`}>
      <div className="bar"></div>
    </div>
  );
};

export default LoadingBar;