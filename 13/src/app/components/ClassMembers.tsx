import React, { useEffect, useState } from 'react';
import { getStudentList } from '../utils/studentList';

function ClassMembers() {
  const [studentList, setStudentList] = useState<string[]>([]);

  useEffect(() => {
    console.log('ClassMembers useEffect running');
    const students = getStudentList();
    console.log('Students fetched:', students);
    setStudentList(students);
  }, []);

  console.log('ClassMembers rendering, studentList:', studentList);

  return (
    <div>
      <div className="班级成员">
        <h2>班级成员</h2>
        <div className="班级人数">班级人数: {studentList.length}</div>
        <div className="成员列表">
          <div className="老师">
            <h3>老师</h3>
            <div className="老师列表">
              <div className="成员卡片">
                <img src="/path/to/default/avatar.png" alt="老师1" />
                <span>老师1</span>
              </div>
            </div>
          </div>
          <div className="同学">
            <h3>同学</h3>
            <div className="同学列表">
              {studentList.map((student, index) => (
                <div key={index} className="成员卡片">
                  <img src="/path/to/default/avatar.png" alt={student} />
                  <span>{student}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassMembers;