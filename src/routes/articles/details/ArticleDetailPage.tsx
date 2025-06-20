// components/ArticlePage.jsx
"use client"

import {  useParams } from "react-router-dom" // Next.jsのuseParamsを使用
import { FaHeart, FaBookmark, FaShareNodes, FaArrowLeft, FaThumbsUp } from "react-icons/fa6" // またはfaなど
// Markdownレンダラーコンポーネント (別途定義)
import MarkdownRenderer from "../components/MarkdownRenderer"
import { useArticle, useArticleLike, useUnlikeArticle, useArticleLikeStatus } from '../../../hooks';
// CSSモジュールをインポート
import styles from './ArticleDetail.module.css'; // Assuming you have a CSS module for styles


// ArticlePageコンポーネネント
export default function ArticlePage() {
  const { id } = useParams();
  const { article } = useArticle(id || '');
  const { addArticleLike } = useArticleLike();
  const { unlikeArticle } = useUnlikeArticle();
  const { likeStatus } = useArticleLikeStatus(id || '');

  if (!article) return <div>記事が見つかりませんでした。</div>;

  const handleLike = () => {
    if (article) {
      addArticleLike(article.article_id);
    } 
  }

  const handleUnLike = () => {
    if (article) {
      unlikeArticle(article.article_id);
    } 
  }
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div>
          <a href="/article" className={styles.backLink}>
            <FaArrowLeft className={styles.backIcon} /> {/* react-iconsのArrowLeftを使用 */}
            記事一覧に戻る
          </a>
        </div>

        <article className={styles.article}>
          {/* Article Header */}
          <div className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{article.title}</h1>

            <div className={styles.articleMeta}>
              <div className={styles.authorSection}>
                <div className={styles.authorAvatar}>
                  {/* アバター画像があればimgタグ、なければFallback */}
                  {/* <img src={article.author.avatar} alt={article.author.name} className={styles.authorAvatarImage} /> */}
                  {article.user.username}
                </div>
                <div>
                  <p className={styles.authorName}>{article.user.username}</p>
                  <p className={styles.authorUsername}>@{article.user.user_id}</p>
                  <p className={styles.articleDate}>
                    {article.created_at instanceof Date ? article.created_at.toLocaleString() : article.created_at} に投稿
                  </p>
                </div>
              </div>

              <div className={styles.actionButtons}>
                {likeStatus?.liked == false ? (
                <button type="button" className={styles.actionButton} onClick={handleLike}>
                  <FaHeart className={styles.actionButtonIcon} /> {/* react-iconsのHeartを使用 */}
                </button>
                ) : (
                <button type="button" className={styles.actionButton} onClick={handleUnLike}>
                  <FaHeart className={styles.actionButtonDeleteIcon} /> {/* react-iconsのHeartを使用 */}
                </button>
                )}
                <button type="button" className={styles.actionButton}>
                  <FaBookmark className={styles.actionButtonIcon} /> {/* react-iconsのBookmarkを使用 */}
                  
                </button>
                <button type="button" className={styles.actionButton}>
                  <FaShareNodes className={styles.actionButtonIcon} /> {/* react-iconsのShare2を使用 */}
                </button>
              </div>
            </div>

            <div className={styles.tagList}>
              {article.categories.map((tag) => ( // categoriesを使うように変更
                <span key={tag.category_id} className={styles.tag}>
                  #{tag.category_name}
                </span>
              ))}
            </div>
          </div>

          {/* Article Content */}
          <div className={styles.articleContent}>
            <MarkdownRenderer content={article.content} /> {/* MarkdownRendererを使用 */}
          </div>

          {/* Article Footer */}
          <div className={styles.articleFooter}>
            <div className={styles.footerActions}>
              <div className={styles.footerLeft}>
                
                {likeStatus?.liked == false ? (
                <button type="button" className={styles.actionButton} onClick={handleLike}>
                  <FaThumbsUp className={styles.actionButtonIcon} /> {/* react-iconsのThumbsUpを使用 */}
                  いいね 
                </button>
                ) : (
                <button type="button" className={styles.actionButton} onClick={handleUnLike}>
                  <FaThumbsUp className={styles.actionButtonDeleteIcon} /> {/* react-iconsのThumbsUpを使用 */}
                  いいね 
                </button>
                )}
                <button type="button" className={styles.actionButton}>
                  <FaBookmark className={styles.actionButtonIcon} /> {/* react-iconsのBookmarkを使用 */}
                  ストック
                </button>
              </div>
              <button type="button" className={styles.actionButton}>
                <FaShareNodes className={styles.actionButtonIcon} /> {/* react-iconsのShare2を使用 */}
                シェア
              </button>
            </div>
          </div>
        </article>

        {/* Author Info */}
        <div className={styles.authorCard}>
          <div className={styles.authorCardContent}>
            <div className={styles.authorCardAvatar}>{article.user.username}</div>
            <div className={styles.authorCardInfo}>
              <h3 className={styles.authorCardName}>{article.user.username}</h3>
              <p className={styles.authorCardBio}></p>
              <button type="button" className={`${styles.buttonBase} ${styles.followButton}`}>フォロー</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}