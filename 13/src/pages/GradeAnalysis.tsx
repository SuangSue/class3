import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom'; // 添加这行
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../styles/gradeAnalysis.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

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

interface GradeAnalysisProps {
  user: User | null;
  isDebugMode: boolean;
}

interface SubjectStats {
  average: number;
  highest: { score: number; name: string };
  lowest: { score: number; name: string };
  weight?: number;
}

// 在文件顶部添加这个函数
function isSubjectStats(value: any): value is SubjectStats {
  return value && typeof value.average === 'number';
}

const GradeAnalysis: React.FC<GradeAnalysisProps> = ({ user, isDebugMode }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('全科');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [subjectStats, setSubjectStats] = useState<{[key: string]: SubjectStats}>({});
  const [totalStats, setTotalStats] = useState<SubjectStats | null>(null);
  const [showClassAnalysis, setShowClassAnalysis] = useState(false);
  const [classStats, setClassStats] = useState<{[key: string]: SubjectStats}>({});
  const [classAverageHistory, setClassAverageHistory] = useState<{[key: string]: number[]}>({});

  useEffect(() => {
    const allGrades = JSON.parse(localStorage.getItem('grades') || '[]') as Grade[];
    setGrades(allGrades);

    const uniqueSubjects = Array.from(new Set(allGrades.map((grade: Grade) => grade.subject))) as string[];
    const uniqueExams = Array.from(new Set(allGrades.map((grade: Grade) => grade.exam))) as string[];
    setSubjects(['全科', ...uniqueSubjects]);

    const uniqueStudents = Array.from(new Set(allGrades.map((grade: Grade) => grade.name))) as string[];
    setStudents(uniqueStudents);

    if (user) {
      setSelectedStudent(user.name);
      calculateStats(allGrades, uniqueSubjects, uniqueExams);
      if (user.role === 'teacher' || isDebugMode) {
        calculateClassStats(allGrades, uniqueSubjects, uniqueExams);
      }
    }
  }, [user, isDebugMode]);

  const calculateStats = (allGrades: Grade[], subjects: string[], exams: string[]) => {
    const stats: {[key: string]: SubjectStats} = {};
    let totalScore = 0;
    let totalCount = 0;

    subjects.forEach(subject => {
      const subjectGrades = allGrades.filter(grade => grade.subject === subject && grade.name === (user?.name || selectedStudent));
      if (subjectGrades.length > 0) {
        const scores = subjectGrades.map(grade => grade.grade);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        stats[subject] = {
          average,
          highest: { score: Math.max(...scores), name: user?.name || selectedStudent },
          lowest: { score: Math.min(...scores), name: user?.name || selectedStudent },
        };
        totalScore += average;
        totalCount++;
      }
    });

    // Calculate weights
    Object.keys(stats).forEach(subject => {
      stats[subject].weight = stats[subject].average / totalScore;
    });

    setSubjectStats(stats);
    setTotalStats({
      average: totalScore / totalCount,
      highest: { score: totalScore, name: user?.name || selectedStudent },
      lowest: { score: totalScore, name: user?.name || selectedStudent },
    });
  };

  const calculateClassStats = (allGrades: Grade[], subjects: string[], exams: string[]) => {
    const stats: {[key: string]: SubjectStats} = {};
    const averageHistory: {[key: string]: number[]} = {};

    subjects.forEach(subject => {
      const subjectGrades = allGrades.filter(grade => grade.subject === subject);
      if (subjectGrades.length > 0) {
        const scores = subjectGrades.map(grade => grade.grade);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        stats[subject] = {
          average,
          highest: { score: Math.max(...scores), name: subjectGrades.find(g => g.grade === Math.max(...scores))?.name || '' },
          lowest: { score: Math.min(...scores), name: subjectGrades.find(g => g.grade === Math.min(...scores))?.name || '' },
        };

        // Calculate average history
        const examAverages = exams.map(exam => {
          const examGrades = subjectGrades.filter(g => g.exam === exam);
          return examGrades.length > 0 ? examGrades.reduce((sum, g) => sum + g.grade, 0) / examGrades.length : 0;
        });
        averageHistory[subject] = examAverages;
      }
    });

    // Calculate total average
    const totalAverage = Object.values(stats).reduce((sum, stat) => sum + stat.average, 0) / subjects.length;
    stats['全科'] = {
      average: totalAverage,
      highest: { score: Math.max(...Object.values(stats).map(s => s.highest.score)), name: '' },
      lowest: { score: Math.min(...Object.values(stats).map(s => s.lowest.score)), name: '' },
    };

    // Calculate weights
    Object.keys(stats).forEach(subject => {
      stats[subject].weight = stats[subject].average / totalAverage;
    });

    setClassStats(stats);
    setClassAverageHistory(averageHistory);
  };

  const calculateRank = (grade: number, subject: string, exam: string) => {
    const allGradesForSubjectAndExam = grades.filter(g => g.subject === subject && g.exam === exam);
    const sortedGrades = allGradesForSubjectAndExam.sort((a, b) => b.grade - a.grade);
    return sortedGrades.findIndex(g => g.grade === grade) + 1;
  };

  const filteredGrades = grades.filter(grade => 
    (selectedSubject === '全科' || grade.subject === selectedSubject) && 
    grade.name === (user?.name || selectedStudent)
  ).sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const pieChartData = {
    labels: Object.keys(subjectStats),
    datasets: [
      {
        data: Object.values(subjectStats).map(stat => stat.average),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
        ],
      },
    ],
  };

  const lineChartData = {
    labels: filteredGrades.map(grade => grade.exam),
    datasets: [
      {
        label: selectedSubject,
        data: filteredGrades.map(grade => grade.grade),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedSubject}成绩走势`,
      },
      datalabels: {
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: number) => value.toFixed(2)
      }
    },
  };

  const renderAnalysis = () => {
    if (selectedSubject === '全科') {
      const subjectEntries = Object.entries(subjectStats);
      const weakestSubject = subjectEntries.length > 0 
        ? subjectEntries.reduce((a, b) => a[1].average < b[1].average ? a : b) 
        : ['N/A', { average: 0 }];
      const strongestSubject = subjectEntries.length > 0 
        ? subjectEntries.reduce((a, b) => a[1].average > b[1].average ? a : b) 
        : ['N/A', { average: 0 }];

      const totalScoreHistory = grades
        .filter(grade => grade.name === (user?.name || selectedStudent))
        .reduce((acc, grade) => {
          if (!acc[grade.exam]) {
            acc[grade.exam] = { total: 0, count: 0 };
          }
          acc[grade.exam].total += grade.grade;
          acc[grade.exam].count += 1;
          return acc;
        }, {} as { [key: string]: { total: number, count: number } });

      const sortedExams = Object.keys(totalScoreHistory).sort((a, b) => 
        new Date(grades.find(g => g.exam === a)?.examDate || '').getTime() - 
        new Date(grades.find(g => g.exam === b)?.examDate || '').getTime()
      );

      const totalScoreLineData = {
        labels: sortedExams,
        datasets: [{
          label: '总分',
          data: sortedExams.map(exam => totalScoreHistory[exam].total / totalScoreHistory[exam].count),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };

      return (
        <div className="all-subjects-analysis">
          <div className="analysis-content">
            <div className="total-stats">
              <h3>总分统计</h3>
              {totalStats && (
                <>
                  <p>分数：{totalStats.average.toFixed(2)}</p>
                  {isSubjectStats(weakestSubject[1]) && (
                    <p>{`最薄弱科目：${weakestSubject[0]} (${weakestSubject[1].average.toFixed(2)}分)`}</p>
                  )}
                  {isSubjectStats(strongestSubject[1]) && (
                    <p>{`强项科目：${strongestSubject[0]} (${strongestSubject[1].average.toFixed(2)}分)`}</p>
                  )}
                </>
              )}
            </div>
            <div className="all-subjects-grades">
              <h4>所有科目成绩</h4>
              <ul>
                {Object.entries(subjectStats).map(([subject, stats]) => (
                  <li key={subject}>
                    <span>{subject}：</span>
                    <span>{stats.average.toFixed(2)}分</span>
                    <span>（占比：{(stats.weight! * 100).toFixed(2)}%）</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="charts-container">
            <div className="chart-container pie-chart">
              <h3>各科分数占比</h3>
              {Object.keys(subjectStats).length > 0 ? (
                <Pie data={pieChartData} />
              ) : (
                <p>暂无数据</p>
              )}
            </div>
            <div className="chart-container line-chart">
              <h3>总分走向</h3>
              {sortedExams.length > 0 ? (
                <Line data={totalScoreLineData} options={options} />
              ) : (
                <p>暂无数据</p>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="single-subject-analysis">
          <h3>{selectedSubject}统计</h3>
          {subjectStats[selectedSubject] ? (
            <>
              <p>分数：{subjectStats[selectedSubject].average.toFixed(2)}</p>
              <p>最高分：{subjectStats[selectedSubject].highest.score.toFixed(2)}</p>
              <p>最低分：{subjectStats[selectedSubject].lowest.score.toFixed(2)}</p>
              <p>占总分比重：{(subjectStats[selectedSubject].weight! * 100).toFixed(2)}%</p>
            </>
          ) : (
            <p>暂无数据</p>
          )}
          <div className="chart-container">
            {filteredGrades.length > 0 ? (
              <Line data={lineChartData} options={options} />
            ) : (
              <p>暂无数据</p>
            )}
          </div>
        </div>
      );
    }
  };

  const renderClassAnalysis = () => {
    const classAverageLineData = {
      labels: grades.map(grade => grade.exam),
      datasets: Object.entries(classAverageHistory).map(([subject, averages]) => ({
        label: subject,
        data: averages,
        fill: false,
        borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        tension: 0.1
      }))
    };

    return (
      <div className="class-analysis">
        <h3>班级统计</h3>
        <p>全班最高分：{classStats['全科'].highest.score.toFixed(2)}</p>
        <p>全班最低分：{classStats['全科'].lowest.score.toFixed(2)}</p>
        <p>班级平均分：{classStats['全科'].average.toFixed(2)}</p>
        <div className="chart-container">
          <h4>班级平均分走向</h4>
          <Line data={classAverageLineData} />
        </div>
        <div className="subject-selector">
          <label htmlFor="class-subject-select">选择科目：</label>
          <select
            id="class-subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        {selectedSubject !== '全科' && classStats[selectedSubject] && (
          <div className="subject-stats">
            <h4>{selectedSubject}统计</h4>
            <p>最高分：{classStats[selectedSubject].highest.score.toFixed(2)} ({classStats[selectedSubject].highest.name})</p>
            <p>最低分：{classStats[selectedSubject].lowest.score.toFixed(2)} ({classStats[selectedSubject].lowest.name})</p>
            <p>平均分：{classStats[selectedSubject].average.toFixed(2)}</p>
            <p>占总分平均分比重：{(classStats[selectedSubject].weight! * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grade-analysis animate-fadeIn">
      <h1 className="animate-slideInUp">成绩剖析</h1>
      <Link to="/grades" className="back-to-grades animate-fadeIn" style={{animationDelay: '0.2s'}}>返回成绩页面</Link>
      <div className="analysis-container">
        {(user?.role === 'teacher' || isDebugMode) ? (
          <>
            <div className="student-list animate-slideInUp" style={{animationDelay: '0.1s'}}>
              <h2>学生名单</h2>
              <div className="student-grid">
                <button
                  className={`student-button class-button ${showClassAnalysis ? 'active' : ''} animate-scaleIn`}
                  onClick={() => setShowClassAnalysis(true)}
                  style={{animationDelay: '0.2s'}}
                >
                  班级
                </button>
                {students.map((student, index) => (
                  <button
                    key={student}
                    className={`student-button ${selectedStudent === student && !showClassAnalysis ? 'active' : ''} animate-scaleIn`}
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowClassAnalysis(false);
                      calculateStats(grades, subjects.filter(s => s !== '全科'), []);
                    }}
                    style={{animationDelay: `${0.2 + (index + 1) * 0.05}s`}}
                  >
                    {student}
                  </button>
                ))}
              </div>
            </div>
            <div className="analysis-view animate-slideInUp" style={{animationDelay: '0.3s'}}>
              {showClassAnalysis ? (
                renderClassAnalysis()
              ) : (
                <>
                  <h2 className="animate-slideInUp" style={{animationDelay: '0.4s'}}>{selectedStudent}的成绩分析</h2>
                  <div className="subject-selector animate-slideInUp" style={{animationDelay: '0.5s'}}>
                    <label htmlFor="subject-select">选择科目：</label>
                    <select
                      id="subject-select"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div className="animate-fadeIn" style={{animationDelay: '0.6s'}}>
                    {renderAnalysis()}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="analysis-view student-view animate-slideInUp" style={{animationDelay: '0.1s'}}>
            <h2 className="animate-slideInUp" style={{animationDelay: '0.2s'}}>{user?.name}的成绩分析</h2>
            <div className="subject-selector animate-slideInUp" style={{animationDelay: '0.3s'}}>
              <label htmlFor="subject-select">选择科目：</label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div className="animate-fadeIn" style={{animationDelay: '0.4s'}}>
              {renderAnalysis()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeAnalysis;