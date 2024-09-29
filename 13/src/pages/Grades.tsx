import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/grades.css';

interface Grade {
  id: string;
  name: string;
  subject: string;
  grade: number;
  exam: string;
  examDate: string;
  publishRanking: boolean; // 新增
}

interface User {
  name: string;
  role: string;
  class?: string;
}

interface GradesProps {
  user: User | null;
  isDebugMode: boolean;  // 添加这个属性
}

const Grades: React.FC<GradesProps> = ({ user, isDebugMode }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [latestGrades, setLatestGrades] = useState<Grade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const allGrades = JSON.parse(localStorage.getItem('grades') || '[]');
      const userGrades = allGrades.filter((grade: Grade) => grade.name === user.name);
      setGrades(userGrades);

      // 获取每个科目的最新成绩
      const latestGradesBySubject = userGrades.reduce((acc: Grade[], current: Grade) => {
        const existingIndex = acc.findIndex(g => g.subject === current.subject);
        if (existingIndex === -1 || new Date(current.examDate) > new Date(acc[existingIndex].examDate)) {
          if (existingIndex !== -1) {
            acc[existingIndex] = current;
          } else {
            acc.push(current);
          }
        }
        return acc;
      }, []);

      setLatestGrades(latestGradesBySubject);
    }
  }, [user]);

  const filteredGrades = searchTerm || selectedExam ? grades.filter(grade => 
    (selectedSubject === '' || grade.subject === selectedSubject) &&
    (selectedExam === '' || grade.exam === selectedExam) &&
    (searchTerm === '' || grade.exam.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : latestGrades;

  const uniqueExams = Array.from(new Set(grades.map(g => g.exam)));
  const uniqueSubjects = Array.from(new Set(grades.map(g => g.subject)));

  const handlePublishGrade = () => {
    navigate('/publish-grades');
  };

  const handleViewAllGrades = () => {
    navigate('/all-grades');
  };

  const isTeacher = user && user.role === 'teacher';
  const showTeacherFeatures = isTeacher || isDebugMode;

  return (
    <div id="grades-page" className="grades-page animate-fadeIn">
      <h1 className="animate-slideInUp">成绩查询</h1>
      <div className="search-container animate-slideInUp" style={{animationDelay: '0.1s'}}>
        <input
          type="text"
          placeholder="搜索考试名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="select-input">
          <option value="">所有科目</option>
          {uniqueSubjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="select-input">
          <option value="">所有考试</option>
          {uniqueExams.map(exam => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>
      </div>
      {showTeacherFeatures && (
        <div className="teacher-actions animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <button onClick={handlePublishGrade}>发布成绩</button>
          <button onClick={handleViewAllGrades}>所有学生成绩</button>
        </div>
      )}
      <Link to="/grade-analysis" className="analysis-link animate-slideInUp" style={{animationDelay: '0.3s'}}>查看成绩剖析</Link>
      <table className="grades-table animate-scaleIn" style={{animationDelay: '0.4s'}}>
        <thead>
          <tr>
            <th>科目</th>
            <th>考试名称</th>
            <th>成绩</th>
            <th>考试日期</th>
            {(isTeacher || isDebugMode) && <th>排名</th>} {/* 新增 */}
          </tr>
        </thead>
        <tbody>
          {filteredGrades.map((grade, index) => (
            <tr key={`grade-${grade.id}-${index}`}>
              <td>{grade.subject}</td>
              <td>{grade.exam}</td>
              <td>{grade.grade}</td>
              <td>{grade.examDate}</td>
              {(isTeacher || isDebugMode) && (
                <td>{grade.publishRanking ? '已公布' : '未公布'}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;