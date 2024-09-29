import React, { useState } from 'react';
import { useDebug } from '../contexts/DebugContext';
import { useAuth } from '../contexts/AuthContext'; // 假设你有一个 AuthContext

const Announcements: React.FC = () => {
  const { isDebugMode } = useDebug();
  const { user } = useAuth(); // 假设 AuthContext 提供了用户信息
  const [announcements, setAnnouncements] = useState<string[]>([]); // 用于存储公告

  const handlePublishAnnouncement = () => {
    // 这里应该是发布公告的逻辑
    const newAnnouncement = prompt('请输入新公告：');
    if (newAnnouncement) {
      setAnnouncements([...announcements, newAnnouncement]);
    }
  };

  return (
    <div>
      <h2>公告栏</h2>
      {announcements.map((announcement, index) => (
        <p key={index}>{announcement}</p>
      ))}
      
      {(isDebugMode || user?.role === 'teacher') && (
        <button onClick={handlePublishAnnouncement}>发布公告</button>
      )}
    </div>
  );
};

export default Announcements;