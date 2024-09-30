import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

// 定义常量
const MAX_WIDTH = 800; // 或者您想要的最大宽度
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB，或者您想要的最大文件大小

// 定义 User 类型
interface User {
  name: string;
  role: string;
  avatar?: string;
  class?: string;
  motto?: string;
  position?: string;
}

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onDebugModeToggle: (isActive: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout, onDebugModeToggle }) => {
  const [avatarHover, setAvatarHover] = useState(false);
  const [editingMotto, setEditingMotto] = useState(false);
  const [editingPosition, setEditingPosition] = useState(false);
  const [newMotto, setNewMotto] = useState(user.motto || '');
  const [newPosition, setNewPosition] = useState(user.position || '');
  const navigate = useNavigate();
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugPassword, setDebugPassword] = useState('');

  const updateLocalStorage = (updatedUser: User) => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[updatedUser.name] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error updating localStorage:', error);
      alert('无法保存用户信息。可能是由于存储空间不足。');
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const elem = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const data = ctx?.canvas.toDataURL('image/jpeg', 0.8);
          resolve(data as string);
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        let compressedImage: string;
        if (file.size > MAX_FILE_SIZE) {
          compressedImage = await compressImage(file);
        } else {
          compressedImage = await readFileAsDataURL(file);
        }
        const updatedUser = { ...user, avatar: compressedImage };
        onUpdateUser(updatedUser);
        updateLocalStorage(updatedUser);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('处理图片时出错，请重试。');
      }
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const handleMottoSave = () => {
    const updatedUser = { ...user, motto: newMotto };
    onUpdateUser(updatedUser);
    setEditingMotto(false);
    updateLocalStorage(updatedUser);
  };

  const handlePositionSave = () => {
    onUpdateUser({ ...user, position: newPosition });
    setEditingPosition(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    // 不要移除 'users'
    onLogout();
    navigate('/');
  };

  const handleDebugClick = () => {
    setShowDebugModal(true);
  };

  const handleDebugAuth = () => {
    if (debugPassword === 'xfyyds') {
      // console.log('Debug mode activated');
      onDebugModeToggle(true);
      setShowDebugModal(false);
      alert('已进入调试模式'); // 添加这行
    } else {
      alert('认证失败');
    }
    setDebugPassword('');
  };

  const translateRole = (role: string) => {
    return role === 'student' ? '学生' : role === 'teacher' ? '教师' : role;
  };

  return (
    <div id="profile-page">
      <div className="profile-info">
        <div className="avatar-container">
          <img 
            id="profile-avatar"
            src={user.avatar || 'https://via.placeholder.com/200'} // 增大默认头像尺寸
            alt="用户头像"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          />
          {avatarHover && (
            <div className="avatar-hover-text">
              <label htmlFor="avatar-upload">
                更换头像
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}
        </div>
        <p className="avatar-tip">点击头像更换</p>
        <div className="info-container">
          <div className="info-item">
            <strong>姓名:</strong>
            <span>{user.name}</span>
          </div>
          <div className="info-item">
            <strong>角色:</strong>
            <span>{translateRole(user.role)}</span>
          </div>
          {user.class && (
            <div className="info-item">
              <strong>班级:</strong>
              <span>{user.class}</span>
            </div>
          )}
          <div className="info-item">
            <strong>签名:</strong>
            {editingMotto ? (
              <div className="motto-edit">
                <input
                  type="text"
                  value={newMotto}
                  onChange={(e) => setNewMotto(e.target.value)}
                  autoFocus
                />
                <div className="motto-buttons">
                  <button className="save-btn" onClick={handleMottoSave}>保存</button>
                  <button className="cancel-btn" onClick={() => setEditingMotto(false)}>取消</button>
                </div>
              </div>
            ) : (
              <div className="motto-display">
                <span>{user.motto || '未设置'}</span>
                <button className="edit-btn" onClick={() => setEditingMotto(true)}>编辑</button>
              </div>
            )}
          </div>
          {user.role === 'teacher' && (
            <div className="info-item">
              <strong>职位:</strong>
              {editingPosition ? (
                <div className="motto-edit">
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    autoFocus
                  />
                  <div className="motto-buttons">
                    <button className="save-btn" onClick={handlePositionSave}>保存</button>
                    <button className="cancel-btn" onClick={() => setEditingPosition(false)}>取消</button>
                  </div>
                </div>
              ) : (
                <div className="motto-display">
                  <span>{user.position || '未设置'}</span>
                  <button className="edit-btn" onClick={() => setEditingPosition(true)}>编辑</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <button onClick={handleLogout} className="logout-btn">登出</button>
      <div className="debug-mode-entry" style={{ marginTop: '20px' }}>
        <button
          onClick={handleDebugClick}
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            fontSize: '12px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          进入调试模式
        </button>
      </div>
      {showDebugModal && (
        <div className="debug-modal" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <h3>调试模式认证</h3>
          <input
            type="password"
            value={debugPassword}
            onChange={(e) => setDebugPassword(e.target.value)}
            placeholder="请输入调试密码"
          />
          <button onClick={handleDebugAuth}>确认</button>
          <button onClick={() => setShowDebugModal(false)}>取消</button>
        </div>
      )}
    </div>
  );
};

export default Profile;