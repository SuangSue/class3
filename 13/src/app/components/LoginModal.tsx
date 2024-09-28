import React, { useState } from 'react';
import { getStudentList } from '../utils/studentList';

const studentList = getStudentList();

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userType: string, username: string) => void;
}

function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [userType, setUserType] = useState('');
  const [username, setUsername] = useState('');

  console.log('LoginModal render, isOpen:', isOpen);

  if (!isOpen) return null;

  const handleLogin = () => {
    console.log('handleLogin called', { userType, username });

    if (userType === 'student') {
      if (studentList.includes(username)) {
        console.log('Student login successful');
        onLogin(userType, username);
      } else {
        console.log('Student not in list');
        alert('抱歉，您不在高一三班学生名单中。');
      }
    } else if (userType === 'teacher') {
      console.log('Teacher login successful');
      onLogin(userType, username);
    } else {
      alert('请选择身份');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>登录</h2>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="">请选择身份</option>
          <option value="student">高一三班学生</option>
          <option value="teacher">老师</option>
        </select>
        <input
          type="text"
          placeholder="请输入姓名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>登录</button>
        <button onClick={onClose}>取消</button>
      </div>
    </div>
  );
}

export default LoginModal;