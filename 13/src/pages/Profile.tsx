import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

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
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [avatarHover, setAvatarHover] = useState(false);
  const [editingMotto, setEditingMotto] = useState(false);
  const [editingPosition, setEditingPosition] = useState(false);
  const [newMotto, setNewMotto] = useState(user.motto || '');
  const [newPosition, setNewPosition] = useState(user.position || '');
  const navigate = useNavigate();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = e.target?.result as string;
        onUpdateUser({ ...user, avatar: newAvatar });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMottoSave = () => {
    onUpdateUser({ ...user, motto: newMotto });
    setEditingMotto(false);
  };

  const handlePositionSave = () => {
    onUpdateUser({ ...user, position: newPosition });
    setEditingPosition(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div id="profile-page">
      <h1>个人资料</h1>
      <div className="profile-info">
        <div 
          className="avatar-container"
          onMouseEnter={() => setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}
        >
          <img 
            src={user.avatar || 'https://via.placeholder.com/150'} 
            alt="头像" 
            id="profile-avatar" 
            onClick={() => document.getElementById('avatar-upload')?.click()}
          />
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
          {avatarHover && <div className="avatar-hover-text">点击更换头像</div>}
        </div>
        <div className="avatar-tip">点击头像可以更换</div>
        <div className="info-container">
          <div className="info-item"><strong>姓名：</strong><span>{user.name}</span></div>
          <div className="info-item"><strong>身份：</strong><span>{user.role === 'teacher' ? '老师' : '学生'}</span></div>
          {user.role === 'teacher' ? (
            <div className="info-item">
              <strong>职位或科目：</strong>
              {editingPosition ? (
                <div className="position-edit">
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="输入职位或科目"
                  />
                  <div className="position-buttons">
                    <button className="save-btn" onClick={handlePositionSave}>保存</button>
                    <button className="cancel-btn" onClick={() => setEditingPosition(false)}>取消</button>
                  </div>
                </div>
              ) : (
                <div className="position-display">
                  <span>{user.position || '未设置'}</span>
                  <button className="edit-btn" onClick={() => setEditingPosition(true)}>编辑</button>
                </div>
              )}
            </div>
          ) : (
            <div className="info-item"><strong>班级：</strong><span>{user.class || '高一三班'}</span></div>
          )}
          <div className="info-item">
            <strong>签名：</strong>
            {editingMotto ? (
              <div className="motto-edit">
                <input
                  type="text"
                  value={newMotto}
                  onChange={(e) => setNewMotto(e.target.value)}
                  placeholder="输入新的签名"
                />
                <div className="motto-buttons">
                  <button className="save-btn" onClick={handleMottoSave}>保存</button>
                  <button className="cancel-btn" onClick={() => setEditingMotto(false)}>取消</button>
                </div>
              </div>
            ) : (
              <div className="motto-display">
                <span>{user.motto || '这个人很懒，还没有设置签名'}</span>
                <button className="edit-btn" onClick={() => setEditingMotto(true)}>编辑</button>
              </div>
            )}
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>登出</button>
      </div>
    </div>
  );
};

export default Profile;