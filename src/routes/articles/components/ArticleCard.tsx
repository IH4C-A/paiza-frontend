import React from 'react';
import styles from './ArticleCard.module.css';
import { useNavigate } from 'react-router-dom';

type ArticleCardProps = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ id, title, summary, tags, date }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${id}`);
  };
  return (
    <div className={styles.card} onClick={handleClick}>
      <h2>{title}</h2>
      <p className={styles.summary}>{summary}</p>
      <div className={styles.tags}>
        {tags.map((tag, idx) => (
          <span key={idx} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>
      <small className={styles.date}>{new Date(date).toLocaleDateString()}</small>
    </div>
  );
};

export default ArticleCard;
