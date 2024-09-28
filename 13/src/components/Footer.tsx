import React from 'react';
import '../styles/footer.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>关于我们</h3>
          <p>高一三班是一个充满活力和创造力的集体，我们致力于共同成长、互帮互助。</p>
        </div>
        <div className="footer-section">
          <h3>联系我们</h3>
          <p>QQ群组(语文)：870058186</p>
          <p>所有：浙江省温州市苍南县钱库高级中学高一三班</p>
          <p>制作：高一三班电技组</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 高一三班 版权所有</p>
      </div>
    </footer>
  );
};

export default Footer;