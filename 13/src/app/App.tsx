import React, { useState } from 'react';
import LoginModal from './components/LoginModal';
import ClassMembers from './components/ClassMembers';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ type: string; name: string } | null>(null);

  console.log('App rendering');

  const handleLogin = (userType: string, username: string) => {
    setLoggedInUser({ type: userType, name: username });
    setIsLoginModalOpen(false);
  };

  return (
    <div>
      <h1>高一三班</h1>
      {loggedInUser ? (
        <div>
          <p>欢迎，{loggedInUser.name} ({loggedInUser.type})</p>
          <button onClick={() => setLoggedInUser(null)}>登出</button>
        </div>
      ) : (
        <button onClick={() => setIsLoginModalOpen(true)}>登录</button>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      <ClassMembers />
    </div>
  );
}

export default App;