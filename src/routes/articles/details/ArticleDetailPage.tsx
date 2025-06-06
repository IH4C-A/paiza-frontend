import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import style from './ArticleDetail.module.css'; // Assuming you have a CSS module for styles
import { useArticle } from '../../../hooks';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article } = useArticle(id || '');

  if (!article) return <div>記事が見つかりませんでした。</div>;

  return (
    <div className={style.detailcontainer}>
      <button onClick={() => navigate('/article')}>←</button>
      <h1>{article.title}</h1>
      <div className={style.tags}>
        {article.categories.map((tag, idx) => (
          <span key={idx} className={style.tag}>
            #{tag.category_name}
          </span>
        ))}
      </div>
      <div className={style.markdowncontent}>
        <MarkdownRenderer content={article.content} />
      </div>
      <small>{new Date(article.created_at).toLocaleDateString()}</small>
    </div>
  );
};

export default ArticleDetailPage;
