import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionsPage.module.css";
import { useBoards } from "../../hooks/useBoard";
import { FaFilter, FaPlus, FaSearch } from "react-icons/fa";
import { useCategories } from "../../hooks";



// --- メインコンポーネント ---
export default function QuestionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const { boards } = useBoards();
  const { categories } = useCategories();

    // 表示するカテゴリタブを動的に生成
  const categoryTabs = useMemo(() => {
    // まず "すべて" タブを追加
    const allTab = { value: 'all', label: 'すべて' };
    // バックエンドから取得したカテゴリをマップしてタブ形式に変換
    const dynamicTabs = categories.map(cat => ({
      value: cat.category_name,
      label: cat.category_name,
    }));
    // "すべて" タブと動的タブを結合
    return [allTab, ...dynamicTabs];
  }, [categories]);

  // フィルタリングとソーティングロジック
  const displayedQuestions = useMemo(() => {
    let processedQuestions = boards;
    console.log(processedQuestions);

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      processedQuestions = processedQuestions.filter(
        (q) =>
          q.title.toLowerCase().includes(lowercasedTerm) ||
          q.content.toLowerCase().includes(lowercasedTerm)
      );
    }

    // activeTab によるフィルタリングロジック
    if (activeTab !== 'all') {
      processedQuestions = processedQuestions.filter(q =>
        // q.categories はボードに紐づくカテゴリの配列
        // activeTab (category_code) と一致するカテゴリがあるかチェック
        Array.isArray(q.categories) && q.categories.some(cat => cat.category_name === activeTab)
      );
    }

    switch (sortOrder) {
      case "popular":
        // ここに人気順のソートロジックを実装 (例: コメント数や閲覧数など)
        break;
      case "unanswered":
        // ここに未回答のフィルタリングロジックを実装 (例: q.comment_count === 0)
        processedQuestions = processedQuestions.filter(
          (q) => q.comment_count === 0
        );
        break;
      case "latest":
      default:
        // 新着順 (created_at) でソート
        processedQuestions.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return processedQuestions;
  }, [boards, activeTab, sortOrder, searchTerm]); // 依存配列に boards を追加

  const handleAskQuestionClick = () => {
    navigate("/question/new");
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.topSection}>
            <div>
              <h1 className={styles.titleTextH1}>質問掲示板</h1>
              <p className={styles.titleTextP}>
                プログラミングに関する質問を投稿したり、他のユーザーの質問に回答したりできます
              </p>
            </div>
            <div className={styles.actionsContainer}>
              <div className={styles.searchInputContainer}>
                <FaSearch className={styles.searchInputIcon} />
                <input
                  type="search"
                  placeholder="質問を検索..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className={styles.iconButton} aria-label="フィルター">
                <FaFilter />
                <span className={styles.srOnly}>フィルター</span>
              </button>
              <button
                onClick={handleAskQuestionClick}
                className={styles.askQuestionButton}
              >
                <FaPlus /> 質問する
              </button>
            </div>
          </div>

          <div className={styles.filtersContainer}>
            <div className={styles.tabsContainer}>
              <div className={styles.tabsList}>
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.value}
                    className={`${styles.tabTrigger} ${
                      activeTab === tab.value ? styles.tabTriggerActive : ""
                    }`}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.sortContainer}>
              <select
                className={styles.selectControl}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="latest">新着順</option>
                <option value="popular">人気順</option>
                <option value="unanswered">未回答</option>
              </select>
            </div>
          </div>

          <div className={styles.questionsGrid}>
            {displayedQuestions.length > 0 ? (
              displayedQuestions.map((q) => (
                <div key={q.board_id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderTop}>
                      <div>
                        <h2 className={styles.cardTitle}>
                          <a href={`/question/${q.board_id}`}>{q.title}</a>
                        </h2>
                        <div className={styles.cardTags}>
                          {/* カテゴリは常に配列と仮定して map する */}
                          {Array.isArray(q.categories) &&
                            q.categories.map((tag) => (
                              <span
                                key={tag.category_id}
                                className={styles.tag}
                              >
                                {tag.category_name}
                              </span>
                            ))}
                        </div>
                      </div>
                      {(() => {
                        let displayRank = null;
                        if (q.user_id && Array.isArray(q.user_id.rank) && q.user_id.rank.length > 0) {
                          const mentorRank = q.user_id.rank.find(
                            (r) => r.rank_code === "mentor"
                          );
                          displayRank = mentorRank || q.user_id.rank[0];
                        }
                        return (
                          <div
                            className={`${styles.rankBadge} ${
                              displayRank?.rank_name === "A"
                                ? styles.rankBadgeA
                                : styles.rankBadgeB
                            }`}
                          >
                            {displayRank ? (
                              <span key={displayRank.rank_id}>
                                {displayRank.rank_name}
                              </span>
                            ) : (
                              <span></span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardSnippet}>{q.content}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardFooterInfo}>
                      {/* ユーザー名を表示 */}
                      <span>{q.user_id?.username}</span>{" "}
                      {/* オプショナルチェイニングで安全にアクセス */}
                      {/* 投稿日時をLocaleStringで表示 */}
                      <span>
                        {q.created_at
                          ? new Date(q.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <div className={styles.cardFooterStats}>
                      <span>回答 {q.comment_count}件</span>{" "}
                      {/* コメント数を表示 */}
                      <span>閲覧 10回</span>{" "}
                      {/* 閲覧数は現在データにないので仮の値 */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>該当する質問はありません。</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
