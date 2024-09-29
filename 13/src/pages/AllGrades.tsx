import React, { useState, useEffect } from 'react';
import '../styles/allGrades.css';

interface Grade {
  id: string;
  name: string;
  subject: string;
  grade: number;
  exam: string;
  examDate: string;
  publishRanking: boolean;
}

interface User {
  name: string;
  role: string;
  class?: string;
}

interface AllGradesProps {
  user: User | null;
  isDebugMode: boolean;
}

const AllGrades: React.FC<AllGradesProps> = ({ user, isDebugMode }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => {
    const allGrades = JSON.parse(localStorage.getItem('grades') || '[]');
    setGrades(allGrades);
    setFilteredGrades(allGrades);
  }, []);

  useEffect(() => {
    const filtered = grades.filter(grade => 
      (searchTerm === '' || grade.name.toLowerCase().includes(searchTerm.toLowerCase()) || grade.exam.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSubject === '' || grade.subject === selectedSubject) &&
      (selectedExam === '' || grade.exam === selectedExam)
    );
    setFilteredGrades(filtered);
  }, [searchTerm, selectedSubject, selectedExam, grades]);

  const uniqueSubjects = Array.from(new Set(grades.map(g => g.subject)));
  const uniqueExams = Array.from(new Set(grades.map(g => g.exam)));

  const calculateRank = (grade: Grade) => {
    const sameExamGrades = grades.filter(g => g.exam === grade.exam && g.subject === grade.subject);
    const sortedGrades = sameExamGrades.sort((a, b) => b.grade - a.grade);
    return sortedGrades.findIndex(g => g.id === grade.id) + 1;
  };

  return (
    <div className="all-grades-page animate-fadeIn">
      <h1 className="animate-slideInUp">所有学生成绩</h1>
      <div className="search-filters animate-slideInUp" style={{animationDelay: '0.1s'}}>
        <input
          type="text"
          placeholder="搜索学生姓名或考试名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">所有科目</option>
          {uniqueSubjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
          <option value="">所有考试</option>
          {uniqueExams.map(exam => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>
      </div>
      <table className="grades-table animate-scaleIn" style={{animationDelay: '0.2s'}}>
        <thead>
          <tr>
            <th>学生姓名</th>
            <th>考试名称</th>
            <th>科目</th>
            <th>成绩</th>
            <th>排名</th>
            <th>考试日期</th>
            <th>排名公布</th>
          </tr>
        </thead>
        <tbody>
          {filteredGrades.map((grade, index) => (
            <tr key={`${grade.id}-${index}`}>
              <td>{grade.name}</td>
              <td>{grade.exam}</td>
              <td>{grade.subject}</td>
              <td>{grade.grade}</td>
              <td>{calculateRank(grade)}</td>
              <td>{grade.examDate}</td>
              <td>{grade.publishRanking ? '是' : '否'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllGrades;