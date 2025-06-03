import React from 'react';
import styles from './ArticleCard.module.css';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../../../types/articleType';


const ArticleCard: React.FC<Article> = ({ article_id, title, content, categories, created_at }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article_id}`);
  };
  return (
    <div className={styles.card} onClick={handleClick}>
      <h2>{title}</h2>
      <p className={styles.summary}>{content}</p>
      <div className={styles.tags}>
        {categories.map((tag, idx) => (
          <span key={idx} className={styles.tag}>
            #{tag.category_name}
          </span>
        ))}
      </div>
      <small className={styles.date}>{new Date(created_at).toLocaleDateString()}</small>
    </div>
  );
};

export default ArticleCard;
