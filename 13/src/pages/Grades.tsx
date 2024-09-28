import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/grades.css';

interface Grade {
  id: string;
  name: string;
  subject: string;
  grade: number;
  exam: string;
  examDate: string;
}

interface User {
  name: string;
  role: string;
  class?: string;
}

interface GradesProps {
  user: User | null;
}

const Grades: React.FC<GradesProps> = ({ user }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const allGrades = JSON.parse(localStorage.getItem('grades') || '[]');
      const userGrades = allGrades.filter((grade: Grade) => grade.name === user.name);
      setGrades(userGrades);
    }
  }, [user]);

  const filteredGrades = grades.filter(grade => 
    (selectedSubject === '' || grade.subject === selectedSubject) &&
    (selectedExam === '' || grade.exam === selectedExam)
  );

  const uniqueExams = Array.from(new Set(grades.map(g => g.exam)));

  const handlePublishGrade = () => {
    navigate('/publish-grades');
  };

  const isTeacher = user && user.role === 'teacher';

  return (
    <div id="grades-page">
      <h1>成绩查询</h1>
      <div className="search-container">
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">所有科目</option>
          <option value="数学">数学</option>
          <option value="语文">语文</option>
          <option value="英语">英语</option>
          <option value="政治">政治</option>
          <option value="历史">历史</option>
          <option value="地理">地理</option>
          <option value="物理">物理</option>
          <option value="化学">化学</option>
          <option value="生物">生物</option>
        </select>
        <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
          <option value="">所有考试</option>
          {uniqueExams.map(exam => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>
      </div>
      {isTeacher && (
        <div className="teacher-actions">
          <button onClick={handlePublishGrade}>发布成绩</button>
        </div>
      )}
      <div id="results-container">
        {filteredGrades.map((grade, index) => (
          <div key={index} className="result-item">
            <h4>{grade.subject} - {grade.exam}</h4>
            <p>成绩: {grade.grade}</p>
            <p>考试日期: {grade.examDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grades;