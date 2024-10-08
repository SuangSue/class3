import React from 'react';
import '../styles/home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="animate-slideInUp">欢迎来到高一三班</h1>
        <p className="animate-slideInUp delay-1">
          这是钱库高级中学唯一一个以班级为单位建立的网站
        </p>
        <p className="animate-slideInUp delay-2">在这里，你可以了解到班级的最新动态，也可以了解到班级的每一位同学</p>
        <p className="animate-slideInUp delay-3">成绩查询、问题互答、资源共享同样是本网站的功能</p>
        <p className="animate-slideInUp delay-4">欢迎老师同学以本网站作为了解班级、交流互动的平台</p>
      </div>
    </div>
  );
};

export default Home;