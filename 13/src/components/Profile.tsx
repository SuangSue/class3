import React, { useState } from 'react';
import { useDebug } from '../contexts/DebugContext';

const Profile: React.FC = () => {
  const { isDebugMode, setDebugMode } = useDebug();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState('');

  const handleDebugClick = () => {
    setShowAuthModal(true);
  };

  const handleAuthSubmit = () => {
    if (authCode === 'xfyyds') {
      setDebugMode(true);
      alert('Debug mode activated!');
    } else {
      alert('Invalid authentication code');
    }
    setShowAuthModal(false);
    setAuthCode('');
  };

  return (
    <div>
      <h2>个人资料</h2>
      {/* 其他个人信息 */}
      
      <div style={{ marginTop: '20px' }}>
        <span 
          style={{ color: 'blue', cursor: 'pointer', fontSize: '12px' }}
          onClick={handleDebugClick}
        >
          Debug Mode {isDebugMode ? '(Activated)' : ''}
        </span>
      </div>

      {showAuthModal && (
        <div className="modal">
          <input
            type="password"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            placeholder="Enter auth code"
          />
          <button onClick={handleAuthSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Profile;