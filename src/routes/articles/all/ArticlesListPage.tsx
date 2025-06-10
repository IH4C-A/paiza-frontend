// HomePage.jsx
"use client";

import React, { useState, useMemo } from "react";
// react-iconsから必要なアイコンをインポート
import { FaHeart } from "react-icons/fa"; // FaMessageCircle は FaMessage に変更, FaPenTool は FaPencilAlt に変更 (Font Awesome 5/6)
import ArticleCard from "../components/ArticleCard";
import { useArticlesWithCategories } from "../../../hooks/useArticle";
import type { Article } from "../../../types/articleType";

// CSSモジュールをインポート
import styles from "./ArticleList.module.css";
import { useNavigate } from "react-router-dom";

// HomePageコンポーネント本体
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'following', 'trending'
  const [filterTag, setFilterTag] = useState(""); // タグフィルター用
  const [page, setPage] = useState(1);
  const articlesPerPage = 5;

  const { articles } = useArticlesWithCategories();
  const uniqueTags = [
    ...new Set(
      articles.flatMap((article: Article) =>
        article.categories.map((cat) => cat.category_name)
      )
    ),
  ];

  const filteredArticles = articles

    .filter(
      (article: Article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.categories.some((tag) =>
          tag.category_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )

    .filter((article: Article) =>
      filterTag
        ? article.categories.some((tag) => tag.category_name === filterTag)
        : true
    );

  const filteredAndSortedArticles = useMemo(() => {
    let currentArticles = articles;

    // 検索フィルター
    if (searchQuery) {
      currentArticles = currentArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.user?.username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          article.user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.categories.some((cat) =>
            cat.category_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // タグフィルター
    if (filterTag) {
      currentArticles = currentArticles.filter((article) =>
        article.categories.some((cat) => cat.category_name === filterTag)
      );
    }

    // フィルターボタン（ここでは簡易的にトレンド順にソートする例）
    if (filterType === "trending") {
      return articles
    }
    // "following" のロジックはユーザーデータやAPIが必要なので、ここでは実装をスキップします。

    return currentArticles;
  }, [searchQuery, filterTag, filterType]);

  const paginatedArticles = filteredAndSortedArticles.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage
  );

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/article/new");
  };

  return (
    <div className={styles.container}>

      <div className={styles.main}>
        <div className={styles.content}>
          {/* Main Content Area */}
          <main className={styles.mainContentArea}>
            <div className={styles.topSection}>
              <h1 className={styles.pageTitle}>新着記事</h1>
              <div className={styles.filterButtons}>
                <button
                  className={`${styles.filterButton} ${
                    filterType === "all" ? styles.filterButtonActive : ""
                  }`}
                  onClick={() => setFilterType("all")}
                >
                  すべて
                </button>
                <button
                  className={`${styles.filterButton} ${
                    filterType === "following" ? styles.filterButtonActive : ""
                  }`}
                  onClick={() => setFilterType("following")}
                >
                  フォロー中
                </button>
                <button
                  className={`${styles.filterButton} ${
                    filterType === "trending" ? styles.filterButtonActive : ""
                  }`}
                  onClick={() => setFilterType("trending")}
                >
                  トレンド
                </button>

                <button className={styles.writeButton} onClick={handleClick}>
                  投稿
                </button>
              </div>

              {/* 検索入力フィールド */}
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />

              {/* タグフィルターボタン */}
              <div className={styles.tagFilterSection}>
                <strong className={styles.tagFilterLabel}>
                  タグフィルター:
                </strong>
                <div className={styles.uniqueTagList}>
                  {uniqueTags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFilterTag(tag === filterTag ? "" : tag)}
                      className={`${styles.filterTagButton} ${
                        tag === filterTag ? styles.filterTagButtonActive : ""
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.articleList}>
              {filteredArticles.map((article) => (
                <ArticleCard key={article.article_id}{...article} />
              ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`${styles.paginationButton} ${
                  page === 1 ? styles.paginationButtonDisabled : ""
                }`}
              >
                前へ
              </button>

              {Array.from(
                {
                  length: Math.ceil(
                    filteredAndSortedArticles.length / articlesPerPage
                  ),
                },
                (_, i) => i + 1
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`${styles.paginationButton} ${
                    p === page ? styles.paginationButtonActive : ""
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() =>
                  setPage((p) =>
                    p * articlesPerPage < filteredAndSortedArticles.length
                      ? p + 1
                      : p
                  )
                }
                disabled={
                  page * articlesPerPage >= filteredAndSortedArticles.length
                }
                className={`${styles.paginationButton} ${
                  page * articlesPerPage >= filteredAndSortedArticles.length
                    ? styles.paginationButtonDisabled
                    : ""
                }`}
              >
                次へ
              </button>
            </div>

            {paginatedArticles.length === 0 && (
              <div className={styles.noArticlesFound}>
                <p>条件に一致する記事が見つかりませんでした。</p>
                <p>検索条件やフィルターを変更してお試しください。</p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>人気のタグ</h3>
              </div>
              <div className={styles.sidebarContent}>
                <div className={styles.popularTags}>
                  {[
                    "React",
                    "JavaScript",
                    "TypeScript",
                    "Next.js",
                    "Vue.js",
                    "Python",
                    "Go",
                    "Docker",
                  ].map((tag) => (
                    <span key={tag} className={styles.popularTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>トレンド記事</h3>
              </div>
              <div className={styles.sidebarContent}>
                <div className={styles.trendList}>
                  {articles.slice(0, 3).map(
                    (
                      article,
                      index // mockArticlesを使用
                    ) => (
                      <div
                        key={article.article_id}
                        className={styles.trendItem}
                      >
                        <span className={styles.trendNumber}>{index + 1}</span>
                        <div>
                          <a
                            href={`/articles/${article.article_id}`}
                            className={styles.trendTitleLink}
                          >
                            <h4
                              className={`${styles.trendTitle} ${styles.lineClamp2}`}
                            >
                              {article.title}
                            </h4>
                          </a>
                          <div className={styles.trendStats}>
                            <FaHeart className={styles.trendStatIcon} />
                            <span className={styles.trendLikes}>10</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
