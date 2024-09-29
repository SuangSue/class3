import React from 'react';
import '../styles/activities.css';

const Activities: React.FC = () => {
  return (
    <div className="activities-page animate-fadeIn">
      <h1 className="animate-slideInUp">活动与投票</h1>
      {/* 添加活动和投票组件，并为它们添加动画类 */}
      <div className="activity-list animate-slideInUp" style={{animationDelay: '0.1s'}}>
        {/* 活动列表内容 */}
      </div>
      <div className="voting-system animate-slideInUp" style={{animationDelay: '0.2s'}}>
        {/* 投票系统内容 */}
      </div>
    </div>
  );
};

export default Activities;