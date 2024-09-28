import React, { useState, useEffect } from 'react';
import '../styles/announcements.css';

interface User {
  name: string;
  role: string;
  class?: string;
}

interface AnnouncementsProps {
  user: User | null;
}

const Announcements: React.FC<AnnouncementsProps> = ({ user }) => {
  const [notices, setNotices] = useState<any[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  useEffect(() => {
    // 从 localStorage 加载数据
    const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    const storedEvents = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
    setNotices(storedNotices);
    setTimelineEvents(storedEvents);
  }, []);

  const handlePublishAnnouncement = () => {
    // 实现发布公告的逻辑
    console.log('发布公告');
  };

  const handleDeleteAnnouncement = () => {
    // 实现删除公告的逻辑
    console.log('删除公告');
  };

  const handleAddTimelineEvent = () => {
    // 实现添加时间轴事件的逻辑
    console.log('添加时间轴事件');
  };

  const handleDeleteTimelineEvent = () => {
    // 实现删除时间轴事件的逻辑
    console.log('删除时间轴事件');
  };

  const isTeacher = user && user.role === 'teacher';

  return (
    <div id="announcements-page">
      <h1>班级动态</h1>
      <div className="notice-board">
        <h2>公告板</h2>
        {isTeacher && (
          <>
            <button className="publish-btn" onClick={handlePublishAnnouncement}>发布公告</button>
            <button className="delete-btn" onClick={handleDeleteAnnouncement}>删除公告</button>
          </>
        )}
        {/* 这里添加公告列表 */}
      </div>
      <div className="timeline">
        <h2>活动时间轴</h2>
        {isTeacher && (
          <>
            <button className="add-btn" onClick={handleAddTimelineEvent}>添加事件</button>
            <button className="delete-btn" onClick={handleDeleteTimelineEvent}>删除事件</button>
          </>
        )}
        {/* 这里添加时间轴事件列表 */}
      </div>
    </div>
  );
};

export default Announcements;