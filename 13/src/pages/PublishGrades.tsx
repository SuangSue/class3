import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/publishGrades.css';

interface Student {
  name: string;
  id: string;
  grades: {
    [subject: string]: number | undefined;
  };
}

interface User {
  name: string;
  role: string;
  class?: string;
}

interface PublishGradesProps {
  user: User | null;
  isDebugMode: boolean;
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

const subjects = [
  "数学", "语文", "英语", "政治", "历史", "地理", "物理", "化学", "生物", "全科"
];

const allSubjects = ["语文", "数学", "英语", "政治", "历史", "地理", "物理", "化学", "生物"];

const PublishGrades: React.FC<PublishGradesProps> = ({ user, isDebugMode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examName, setExamName] = useState('');
  const [publishRanking, setPublishRanking] = useState(true); // 新增：是否公布排名
  const navigate = useNavigate();

  useEffect(() => {
    const initialStudents = studentList.map((name, index) => ({
      name,
      id: `2024${(index + 1).toString().padStart(2, '0')}`,
      grades: allSubjects.reduce((acc, subj) => ({ ...acc, [subj]: undefined }), {}),
    }));
    setStudents(initialStudents);
  }, []);

  const handleGradeChange = (id: string, subj: string, grade: number) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, grades: { ...student.grades, [subj]: grade } } : student
    ));
  };

  const handleSave = () => {
    if (!subject || !examDate || !examName) {
      alert('请填写完整的考试信息');
      return;
    }

    const grades = students.flatMap(student => 
      subject === '全科' 
        ? allSubjects.map(subj => ({
            id: student.id,
            name: student.name,
            grade: student.grades[subj],
            subject: subj,
            examDate,
            examName,
            publishRanking, // 新增：是否公布排名
          }))
        : [{
            id: student.id,
            name: student.name,
            grade: student.grades[subject],
            subject,
            examDate,
            examName,
            publishRanking, // 新增：是否公布排名
          }]
    );

    const existingGrades = JSON.parse(localStorage.getItem('grades') || '[]');
    localStorage.setItem('grades', JSON.stringify([...existingGrades, ...grades]));
    alert('成绩已保存');
    navigate('/grades');
  };

  return (
    <div className="publish-grades animate-fadeIn">
      <h1 className="animate-slideInUp">发布成绩</h1>
      <div className="exam-info animate-slideInUp" style={{animationDelay: '0.1s'}}>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">选择科目</option>
          {subjects.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
        <input 
          type="date" 
          value={examDate} 
          onChange={(e) => setExamDate(e.target.value)}
        />
        <input 
          type="text" 
          value={examName} 
          onChange={(e) => setExamName(e.target.value)}
          placeholder="考试名称"
        />
        <div className="publish-ranking">
          <label>
            <input
              type="checkbox"
              checked={publishRanking}
              onChange={(e) => setPublishRanking(e.target.checked)}
            />
            公布班级排名
          </label>
        </div>
      </div>
      <table className="animate-scaleIn" style={{animationDelay: '0.2s'}}>
        <thead>
          <tr>
            <th>姓名</th>
            {subject === '全科' ? allSubjects.map(subj => <th key={subj}>{subj}</th>) : <th>成绩</th>}
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              {subject === '全科' 
                ? allSubjects.map(subj => (
                    <td key={subj}>
                      <input 
                        type="number" 
                        value={student.grades[subj] || ''} 
                        onChange={(e) => handleGradeChange(student.id, subj, Number(e.target.value))}
                      />
                    </td>
                  ))
                : <td>
                    <input 
                      type="number" 
                      value={student.grades[subject] || ''} 
                      onChange={(e) => handleGradeChange(student.id, subject, Number(e.target.value))}
                    />
                  </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} className="animate-slideInUp" style={{animationDelay: '0.3s'}}>保存成绩</button>
    </div>
  );
};

export default PublishGrades;