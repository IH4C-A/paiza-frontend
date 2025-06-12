import React from "react";
import styles from "./ArticleCard.module.css";
import type { Article } from "../../../types/articleType";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useArticleLikesCount } from "../../../hooks";

const ArticleCard: React.FC<Article> = ({
  article_id,
  title,
  content,
  categories,
  created_at,
  user,
}) => {
  const navigate = useNavigate();
  const { articleLikesCount } = useArticleLikesCount(article_id);

  const handleClick = () => {
    navigate(`/article/${article_id}`);
  };
  return (
    <div className={styles.articleCard} onClick={handleClick}>
      <div className={styles.articleHeader}>
        <div className={styles.authorInfo}>
          <div className={styles.authorAvatar}>{user.username}</div>
          <div>
            <p className={styles.authorName}>{user.username}</p>
            <p className={styles.authorUsername}>@{user.user_id}</p>
            <span className={styles.articleDate}>
              {created_at instanceof Date
                ? created_at.toLocaleString()
                : created_at}{" "}
              に投稿
            </span>{" "}
            {/* 日付フォーマットは任意 */}
          </div>
        </div>
          <h2 className={styles.articleCardTitle}>{title}</h2>
      </div>
      <div className={styles.articleContent}>
        <p className={`${styles.articleExcerpt} ${styles.lineClamp2}`}>
          {content}
        </p>{" "}
        {/* `summary`を使用 */}
        <div className={styles.articleFooter}>
          <div className={styles.tagList}>
            {categories.map((tag) => (
              <span key={tag.category_id} className={styles.tag}>
                #{tag.category_name}
              </span>
            ))}
          </div>
          <div className={styles.articleStats}>
            <div className={styles.statItem}>
              <FaHeart className={articleLikesCount?.like ? `${styles.likeItem}` : `${styles.statIcon}`} />
              <span>{articleLikesCount?.like_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
