import React, { useState, useEffect } from 'react';
import '../styles/members.css';

interface Member {
  name: string;
  avatar: string;
  motto: string;
  info: string;
  role: string;
  position?: string;
}

interface MembersData {
  teachers: Member[];
  students: Member[];
}

interface User {
  name: string;
  role: string;
  class?: string;
}

interface MembersProps {
  user: User | null;
  isDebugMode: boolean;
}

const DEFAULT_AVATAR = 'https://via.placeholder.com/60';

// 学生名单
const studentList = [
  "陈慧", "陈民豪", "陈鹏", "陈瑞磊", "陈湜", "陈上扬", "陈轩昂", "杜晓晖",
  "方妙可", "郭欣怡", "洪东睿", "黄思晨", "何星磊", "黄子默", "韩致远",
  "江政谦", "林传涛", "李陈骁", "刘金榜", "李尚品", "李思雅", "林文波",
  "林忆晨", "林雅琪", "苏德翔", "苏义迪", "吴琪琪", "王仁健", "王杉杉",
  "温宇涛", "吴正豪", "徐皓", "叶克俭", "徐凌薇", "虞安琦", "杨锐",
  "杨锐棋", "杨钰莹", "张佳辉", "朱佳佳", "郑梦萱", "郑宁烈", "章显俊",
  "章筱语", "胡新诺"
];

const Members: React.FC<MembersProps> = ({ user, isDebugMode }) => {
  const [members, setMembers] = useState<MembersData>({ teachers: [], students: [] });

  useEffect(() => {
    loadMembersFromLocalStorage();
  }, []);

  const loadMembersFromLocalStorage = () => {
    try {
      const storedMembers = JSON.parse(localStorage.getItem('classMembers') || '{}');
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      const updateMemberInfo = (member: Member): Member => {
        if (users[member.name]) {
          member.avatar = users[member.name].avatar || member.avatar || DEFAULT_AVATAR;
          member.motto = users[member.name].motto || member.motto;
          if (member.role === 'teacher') {
            member.position = users[member.name].position || member.position;
          }
        } else if (currentUser && currentUser.name === member.name) {
          member.avatar = currentUser.avatar || member.avatar || DEFAULT_AVATAR;
          member.motto = currentUser.motto || member.motto;
          if (member.role === 'teacher') {
            member.position = currentUser.position || member.position;
          }
        } else {
          member.avatar = member.avatar || DEFAULT_AVATAR;
        }
        return member;
      };

      // 初始化学生列表
      const initialStudents = studentList.map(name => ({
        name,
        avatar: DEFAULT_AVATAR,
        motto: '这个人很懒，还没有设置签名',
        info: '高一三班学生',
        role: 'student'
      }));

      const updatedMembers: MembersData = {
        teachers: (storedMembers.teachers || []).map(updateMemberInfo),
        students: initialStudents.map(updateMemberInfo)
      };

      // 如果当前用户是老师，确保他们在教师列表中
      if (currentUser && currentUser.role === 'teacher' && !updatedMembers.teachers.find(t => t.name === currentUser.name)) {
        updatedMembers.teachers.push(updateMemberInfo({
          name: currentUser.name,
          avatar: currentUser.avatar || DEFAULT_AVATAR,
          motto: currentUser.motto || '这个人很懒，还没有设置签名',
          info: '高一三班教师',
          role: 'teacher',
          position: currentUser.position
        }));
      }

      setMembers(updatedMembers);
      
      // 保存更新后的成员列表到 localStorage
      localStorage.setItem('classMembers', JSON.stringify(updatedMembers));
    } catch (error) {
      console.error('加载成员信息时出错:', error);
    }
  };

  const createMemberCard = (member: Member, index: number) => (
    <div 
      className="member-card animate-scaleIn interactive-element" 
      key={member.name}
      style={{animationDelay: `${index * 0.05}s`}}
    >
      <img src={member.avatar} alt={member.name} className="member-avatar" />
      <div className="member-name">{member.name}</div>
      <div className="member-info">
        <p>{member.motto}</p>
        {member.role === 'teacher' ? (
          <p>{member.position || '未设置职位或科目'}</p>
        ) : (
          <p>{member.info}</p>
        )}
      </div>
    </div>
  );

  const createDesk = (students: Member[], index: number) => (
    <div className="desk" key={`desk-${index}`}>
      {students.map(createMemberCard)}
    </div>
  );

  return (
    <div id="members-page">
      <div className="members-container">
        <div className="class-info">
          班级人数：{members.students.length}
        </div>
        <div className="teachers">
          <h3>教师</h3>
          <div id="teachers-grid">
            {members.teachers.map(createMemberCard)}
          </div>
        </div>
        <div className="students">
          <h3>学生</h3>
          <div id="students-grid">
            {Array.from({ length: Math.ceil(members.students.length / 2) }, (_, i) =>
              createDesk(members.students.slice(i * 2, i * 2 + 2), i)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;