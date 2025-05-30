import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import style from './ArticleDetail.module.css'; // Assuming you have a CSS module for styles

const dummyArticles = [
  {
    id: '1',
    title: 'ReactでMarkdownエディターを作る方法',
    content: '# 見出し\n\nこれは詳細な記事の本文です。\n\n- 項目1\n- 項目2',
    tags: ['React', 'Markdown', 'フロントエンド'],
    date: '2025-05-25',
  },
  {
    id: '2',
    title: 'FlaskでAPIを作成してみよう',
    content: '# Flask API\n\nFlaskの詳細記事内容。',
    tags: ['Flask', 'API', 'バックエンド'],
    date: '2025-05-20',
  },
];

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = dummyArticles.find((a) => a.id === id);

  if (!article) return <div>記事が見つかりませんでした。</div>;

  return (
    <div className={style.detailcontainer}>
      <button onClick={() => navigate('/article')}>← 一覧に戻る</button>
      <h1>{article.title}</h1>
      <div className="tags">
        {article.tags.map((tag, idx) => (
          <span key={idx} className="tag">
            #{tag}
          </span>
        ))}
      </div>
      <small>{new Date(article.date).toLocaleDateString()}</small>
      <div className={style.markdowncontent}>
        <MarkdownRenderer content={article.content} />
      </div>
    </div>
  );
};

export default ArticleDetailPage;
