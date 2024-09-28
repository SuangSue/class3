import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

interface User {
  name: string;
  role: string;
  class?: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

const studentList = [
  "陈慧", "陈民豪", "陈鹏", "陈瑞磊", "陈湜", "陈上扬", "陈轩昂", "杜晓晖",
  "方妙可", "郭欣怡", "洪东睿", "黄思晨", "何星磊", "黄子默", "韩致远",
  "江政谦", "林传涛", "李陈骁", "刘金榜", "李尚品", "李思雅", "林文波",
  "林忆晨", "林雅琪", "苏德翔", "苏义迪", "吴琪琪", "王仁健", "王杉杉",
  "温宇涛", "吴正豪", "徐皓", "叶克俭", "徐凌薇", "虞安琦", "杨锐",
  "杨锐棋", "杨钰莹", "张佳辉", "朱佳佳", "郑梦萱", "郑宁烈", "章显俊",
  "章筱语", "胡新诺"
];

const TEACHER_AUTH_CODE = "2024c3";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [userClass, setUserClass] = useState('');
  const [teacherAuthCode, setTeacherAuthCode] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      setUserClass(studentList.includes(username) ? '高一三班' : '其他班级');
    } else {
      setUserClass('');
    }
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      if (role === 'teacher' && teacherAuthCode !== TEACHER_AUTH_CODE) {
        setLoginMessage('教师认证码错误');
        return;
      }
      // 这里应该有实际的身份验证逻辑
      // 为了演示，我们假设所有登录都是成功的
      const user = { 
        name: username, 
        role: role, 
        class: role === 'student' ? (studentList.includes(username) ? '高一三班' : '其他班级') : undefined
      };
      onLogin(user);
      setLoginMessage('登录成功！正在跳转到主页...');
      setTimeout(() => {
        navigate('/');
      }, 2000); // 2秒后跳转到主页
    } else {
      setLoginMessage('请输入用户名和密码');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>登录</h2>
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {role === 'student' && (
            <input
              type="text"
              placeholder="班级"
              value={userClass}
              readOnly
              className="class-input"
            />
          )}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">学生</option>
            <option value="teacher">教师</option>
          </select>
          {role === 'teacher' && (
            <input
              type="password"
              placeholder="教师认证码"
              value={teacherAuthCode}
              onChange={(e) => setTeacherAuthCode(e.target.value)}
            />
          )}
          <button type="submit">登录</button>
          {loginMessage && <div className="login-message">{loginMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;