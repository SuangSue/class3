import React, { useState, useEffect } from 'react';
import '../styles/resources.css';

interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  answers: string[];
}

interface Resource {
  id: number;
  title: string;
  description: string;
  fileName: string;
  timestamp: string;
}

const Resources: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
    const storedResources = JSON.parse(localStorage.getItem('resources') || '[]');
    setQuestions(storedQuestions);
    setResources(storedResources);
  }, []);

  const submitQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const title = (form.elements.namedItem('question-title') as HTMLInputElement).value;
    const content = (form.elements.namedItem('question-content') as HTMLTextAreaElement).value;
    const isAnonymous = (form.elements.namedItem('question-anonymous') as HTMLInputElement).checked;
    const author = isAnonymous ? '匿名' : (form.elements.namedItem('question-author') as HTMLInputElement).value || '未署名';

    if (title && content) {
      const newQuestion: Question = {
        id: Date.now(),
        title,
        content,
        author,
        timestamp: new Date().toLocaleString(),
        answers: []
      };
      setQuestions(prev => [newQuestion, ...prev]);
      localStorage.setItem('questions', JSON.stringify([newQuestion, ...questions]));
      form.reset();
    } else {
      alert('请填写问题标题和内容！');
    }
  };

  const submitResource = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const title = (form.elements.namedItem('resource-title') as HTMLInputElement).value;
    const description = (form.elements.namedItem('resource-description') as HTMLTextAreaElement).value;
    const fileInput = form.elements.namedItem('resource-file') as HTMLInputElement;
    
    if (title && description && fileInput.files && fileInput.files[0]) {
      const newResource: Resource = {
        id: Date.now(),
        title,
        description,
        fileName: fileInput.files[0].name,
        timestamp: new Date().toLocaleString()
      };
      setResources(prev => [newResource, ...prev]);
      localStorage.setItem('resources', JSON.stringify([newResource, ...resources]));
      form.reset();
    } else {
      alert('请填写资源标题、描述并选择文件！');
    }
  };

  const addAnswer = (questionId: number, answer: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q
    ));
    localStorage.setItem('questions', JSON.stringify(questions));
  };

  return (
    <div id="resources-page" className="animate-fadeIn">
      <section id="qa-section" className="animate-slideInUp" style={{animationDelay: '0.1s'}}>
        <h2>问答区</h2>
        <form onSubmit={submitQuestion}>
          <input type="text" name="question-title" placeholder="问题标题" required />
          <textarea name="question-content" placeholder="问题内容" required></textarea>
          <input type="text" name="question-author" placeholder="您的名字（可选）" />
          <label>
            <input type="checkbox" name="question-anonymous" /> 匿名提问
          </label>
          <button type="submit">提交问题</button>
        </form>
        <div id="questions-list">
          {questions.map(q => (
            <div key={q.id} className="question">
              <h4>{q.title}</h4>
              <p>{q.content}</p>
              <p>提问者：{q.author} | 时间：{q.timestamp}</p>
              <button onClick={() => {
                const answer = prompt('请输入你的回答：');
                if (answer) addAnswer(q.id, answer);
              }}>回答</button>
              <div className="answers">
                {q.answers.map((a, i) => <p key={i}>{a}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="resources-section" className="animate-slideInUp" style={{animationDelay: '0.2s'}}>
        <h2>资源共享</h2>
        <form onSubmit={submitResource}>
          <input type="text" name="resource-title" placeholder="资源标题" required />
          <textarea name="resource-description" placeholder="资源描述" required></textarea>
          <input type="file" name="resource-file" required />
          <button type="submit">上传资源</button>
        </form>
        <div id="resources-list">
          {resources.map(r => (
            <div key={r.id} className="resource">
              <h4>{r.title}</h4>
              <p>{r.description}</p>
              <p>文件名：{r.fileName} | 上传时间：{r.timestamp}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Resources;