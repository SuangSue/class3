import React, { useState, useEffect } from 'react';
import '../styles/announcements.css';

interface User {
  name: string;
  role: string;
  class?: string;
}

interface AnnouncementsProps {
  user: User | null;
  isDebugMode: boolean;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  author: string;
  image?: string;
}

const Announcements: React.FC<AnnouncementsProps> = ({ user, isDebugMode }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', image: '' });
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image: '' });
  const [isDeletingNotices, setIsDeletingNotices] = useState(false);
  const [isDeletingEvents, setIsDeletingEvents] = useState(false);

  useEffect(() => {
    const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    const storedEvents = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
    setNotices(storedNotices);
    setTimelineEvents(storedEvents);
  }, []);

  useEffect(() => {
    if (showNoticeModal) {
      console.log("Rendering notice modal");
    }
  }, [showNoticeModal]);

  useEffect(() => {
    if (showEventModal) {
      console.log("Rendering event modal");
    }
  }, [showEventModal]);

  const handlePublishAnnouncement = () => {
    console.log("Attempting to open notice modal");
    setShowNoticeModal(true);
  };

  const handleAddTimelineEvent = () => {
    console.log("Attempting to open event modal");
    setShowEventModal(true);
  };

  const handleNoticeSubmit = () => {
    const newNoticeItem: Notice = {
      id: Date.now().toString(),
      ...newNotice,
      date: new Date().toLocaleString(),
      author: user?.name || 'Unknown'
    };
    const updatedNotices = [...notices, newNoticeItem];
    setNotices(updatedNotices);
    localStorage.setItem('notices', JSON.stringify(updatedNotices));
    setShowNoticeModal(false);
    setNewNotice({ title: '', content: '', image: '' });
  };

  const handleEventSubmit = () => {
    const newEventItem: TimelineEvent = {
      id: Date.now().toString(),
      ...newEvent,
      author: user?.name || 'Unknown'
    };
    const updatedEvents = [...timelineEvents, newEventItem];
    setTimelineEvents(updatedEvents);
    localStorage.setItem('timelineEvents', JSON.stringify(updatedEvents));
    setShowEventModal(false);
    setNewEvent({ title: '', description: '', date: '', image: '' });
  };

  const handleDeleteNotice = (id: string) => {
    const updatedNotices = notices.filter(notice => notice.id !== id);
    setNotices(updatedNotices);
    localStorage.setItem('notices', JSON.stringify(updatedNotices));
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = timelineEvents.filter(event => event.id !== id);
    setTimelineEvents(updatedEvents);
    localStorage.setItem('timelineEvents', JSON.stringify(updatedEvents));
  };

  const isTeacher = user && user.role === 'teacher';
  const showTeacherFeatures = isTeacher || isDebugMode;

  console.log("Render - showNoticeModal:", showNoticeModal);
  console.log("Render - showEventModal:", showEventModal);

  return (
    <div id="announcements-page" className="animate-fadeIn">
      <h1 className="animate-slideInUp">班级动态</h1>
      <div className="notice-board animate-slideInUp" style={{animationDelay: '0.1s'}}>
        <h2>公告板</h2>
        {showTeacherFeatures && (
          <div className="teacher-actions">
            <button onClick={handlePublishAnnouncement}>发布公告</button>
            <button onClick={() => setIsDeletingNotices(!isDeletingNotices)}>
              {isDeletingNotices ? '完成' : '删除公告'}
            </button>
          </div>
        )}
        {notices.map((notice) => (
          <div key={notice.id} className="notice-item">
            <h3>{notice.title}</h3>
            <p>{notice.content}</p>
            {notice.image && <img src={notice.image} alt="公告图片" className="notice-image" />}
            <div className="notice-info">
              <span>{notice.author}</span>
              <span>{notice.date}</span>
            </div>
            {isDeletingNotices && showTeacherFeatures && (
              <button className="delete-btn" onClick={() => handleDeleteNotice(notice.id)}>×</button>
            )}
          </div>
        ))}
      </div>
      <div className="timeline animate-slideInUp" style={{animationDelay: '0.2s'}}>
        <h2>活动时间轴</h2>
        {showTeacherFeatures && (
          <div className="teacher-actions">
            <button onClick={handleAddTimelineEvent}>添加事件</button>
            <button onClick={() => setIsDeletingEvents(!isDeletingEvents)}>
              {isDeletingEvents ? '完成' : '删除事件'}
            </button>
          </div>
        )}
        {timelineEvents.map((event) => (
          <div key={event.id} className="timeline-event">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            {event.image && <img src={event.image} alt="事件图片" className="event-image" />}
            <div className="event-info">
              <span>{event.author}</span>
              <span>{event.date}</span>
            </div>
            {isDeletingEvents && showTeacherFeatures && (
              <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>×</button>
            )}
          </div>
        ))}
      </div>
      {showNoticeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>发布公告</h3>
            <input
              type="text"
              placeholder="标题"
              value={newNotice.title}
              onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
            />
            <textarea
              placeholder="内容"
              value={newNotice.content}
              onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
            />
            <input
              type="text"
              placeholder="图片URL（可选）"
              value={newNotice.image}
              onChange={(e) => setNewNotice({...newNotice, image: e.target.value})}
            />
            <div className="modal-buttons">
              <button onClick={handleNoticeSubmit}>发布</button>
              <button onClick={() => setShowNoticeModal(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
      {showEventModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>添加事件</h3>
            <input
              type="text"
              placeholder="标题"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            />
            <textarea
              placeholder="描述"
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
            />
            <input
              type="text"
              placeholder="图片URL（可选）"
              value={newEvent.image}
              onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
            />
            <div className="modal-buttons">
              <button onClick={handleEventSubmit}>添加</button>
              <button onClick={() => setShowEventModal(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;