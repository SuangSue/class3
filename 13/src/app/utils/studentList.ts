// 模拟学生列表
const mockStudentList = [
  "张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十"
];

export function getStudentList(): string[] {
  console.log('Fetching mock student list');
  return mockStudentList;
}

// 移除之前的 getStudentList 实现