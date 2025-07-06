"use client";

import { useState } from "react";
// react-icons/fa6からアイコンをインポート
import { FaStar, FaUsers, FaMessage } from "react-icons/fa6"; // FaMessageはFa6にあります

// CSSモジュールをインポート
import styles from "./MentorPage.module.css";
import { FaSearch } from "react-icons/fa";
import { useCategories, useMentorships, useAllMentors } from "../../hooks";
import type { Rank } from "../../types/rankType";
import type { Mentorship } from "../../types/mentorshipType";
import type { User } from "../../types/userTypes";
import type { Category } from "../../types/categoryType";

// ★新しいタブの種類を定義
type MentorListTab = "myMentors" | "recommended";

function getMentorUser(obj: Mentorship | User): User {
  return "mentor" in obj ? obj.mentor : obj;
}

export default function MentorListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedRank, setSelectedRank] = useState("すべて");
  const [sortBy, setSortBy] = useState("rating");
  // ★新しいステート: アクティブなタブを管理
  const [activeTab, setActiveTab] = useState<MentorListTab>("recommended"); // デフォルトは「おすすめメンター」

  const { categories } = useCategories();
  // useMentorships から両方のリストを取得
  const { mentorships, candidateMentors } = useMentorships();
  const { mentors } = useAllMentors();

  // ★表示するメンターリストを activeTab に応じて切り替える
const currentMentorList =
  activeTab === "myMentors"
    ? mentorships
    : activeTab === "recommended" && candidateMentors.length === 0
      ? mentors
      : candidateMentors;

  const filteredMentors = currentMentorList.filter((mentor) => {
    // 型ガード: Mentorshipかどうかを判定
    const mentorObj = "mentor" in mentor ? mentor.mentor : mentor;

    const mentorName = mentorObj.first_name?.toLowerCase() || "";
    const mentorCategories = mentorObj.categories || [];
    const mentorRanks = mentorObj.ranks || [];

    const matchesSearch =
      mentorName.includes(searchQuery.toLowerCase()) ||
      mentorCategories.some((cat) => {
        const categoryName = typeof cat === "string" ? cat : cat.category_name;
        return categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
      });

    const matchesCategory =
      selectedCategory === "すべて" ||
      mentorCategories.some((cat) => {
        const categoryName = typeof cat === "string" ? cat : cat.category_name;
        return categoryName === selectedCategory;
      });

    const matchesRank =
      selectedRank === "すべて" ||
      mentorRanks.some((r: Rank) => r.rank_name === selectedRank);

    return matchesSearch && matchesCategory && matchesRank;
  });

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    // Mentorship 型かどうかを判定し、User オブジェクトを取得
    const aUser = "mentor" in a ? a.mentor : a;
    const bUser = "mentor" in b ? b.mentor : b;

    const aRankId = Number(aUser.ranks?.[0]?.rank_id ?? 0);
    const bRankId = Number(bUser.ranks?.[0]?.rank_id ?? 0);

    if (sortBy === "rating") {
      return bRankId - aRankId;
    }

    if (sortBy === "reviews") {
      // 仮：レビュー数が未実装のためスキップ
      return 0;
    }

    if (sortBy === "mentees") {
      // 仮：メンティー数が未実装のためスキップ
      return 0;
    }

    return 0;
  });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageContainer}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>メンター一覧</h1>
            <p className={styles.pageDescription}>
              経験豊富なメンターから個別指導を受けて、スキルアップを目指しましょう
            </p>
          </div>

          {/* ★新しいタブセクションの追加★ */}
          <div className={styles.mentorTabsSection}>
            <div className={styles.mentorTabsList}>
              <button
                className={`${styles.mentorTabTrigger} ${
                  activeTab === "recommended"
                    ? styles.mentorTabTriggerActive
                    : ""
                }`}
                onClick={() => setActiveTab("recommended")}
              >
                おすすめ一覧
              </button>
              <button
                className={`${styles.mentorTabTrigger} ${
                  activeTab === "myMentors" ? styles.mentorTabTriggerActive : ""
                }`}
                onClick={() => setActiveTab("myMentors")}
              >
                メンター一覧
              </button>
            </div>
          </div>

          {/* 検索・フィルター */}
          <div className={styles.searchFilterSection}>
            <div className={styles.searchFilterControls}>
              <div className={styles.searchInputWrapper}>
                <FaSearch className={styles.searchIcon} />{" "}
                <input
                  type="text"
                  placeholder="メンター名、スキル、キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.filterDropdowns}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.selectCategory}
                >
                  {/* "すべて" オプションを追加 */}
                  <option value="すべて">すべて</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_name}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(e.target.value)}
                  className={styles.selectRank}
                >
                  <option value="すべて">すべて</option>
                  <option value="S">Sランク</option>
                  <option value="A">Aランク</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.selectSortBy}
                >
                  <option value="rating">評価順</option>
                  <option value="reviews">レビュー数順</option>
                  <option value="mentees">指導人数順</option>
                </select>
              </div>
            </div>
          </div>

          {/* 検索結果 */}
          <div className={styles.resultsSummary}>
            <p className={styles.resultsCount}>
              {filteredMentors.length}件のメンターが見つかりました
            </p>
          </div>

          {/* メンターカード一覧 */}
          <div className={styles.mentorCardsGrid}>
            {filteredMentors.map((mentorRaw) => {
              const mentor = getMentorUser(mentorRaw);

              return (
                <div key={mentor.user_id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.mentorHeader}>
                      <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                          <img
                            src={mentor.profile_image || "/placeholder.svg"}
                            alt={mentor.first_name}
                            className={styles.avatarImage}
                          />
                          {!mentor.profile_image && (
                            <div className={styles.avatarFallback}>
                              {mentor.first_name.slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className={styles.badgeAbsolute}>
                          {mentor.ranks && mentor.ranks.length > 0 && (
                            <span
                              className={`${styles.badgeBase} ${
                                mentor.ranks[0].rank_name === "S"
                                  ? styles.badgeDestructive
                                  : styles.badgeSecondary
                              } ${styles.rankBadge}`}
                            >
                              {mentor.ranks[0].rank_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.mentorMeta}>
                        <h3 className={styles.mentorName}>
                          {mentor.first_name}
                        </h3>
                        <div className={styles.mentorStats}>
                          <div className={styles.rating}>
                            <FaStar className={styles.starIcon} />
                            <span className={styles.ratingText}>{mentor?.average_rating}</span>
                          </div>
                          <div
                            className={`${styles.statusDot} ${
                              mentor.mentor_status === "available"
                                ? styles.statusDotAvailable
                                : styles.statusDotBusy
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div>
                      <h4 className={styles.subHeading}>得意分野</h4>
                      <div className={styles.categoryBadges}>
                        {Array.isArray(mentor.categories) && mentor.categories.length > 0 ? (
                          <>
                            {mentor.categories.slice(0, 4).map((category: Category) => (
                              <span
                                key={
                                  typeof category === "string"
                                    ? category
                                    : category.category_id
                                }
                                className={`${styles.badgeBase} ${styles.badgeOutline} ${styles.badgeXs}`}
                              >
                                {typeof category === "string"
                                  ? category
                                  : category.category_name}
                              </span>
                            ))}
                            {mentor.categories.length > 4 && (
                              <span
                                className={`${styles.badgeBase} ${styles.badgeOutline} ${styles.badgeXs}`}
                              >
                                +{mentor.categories.length - 4}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className={styles.noCategoriesText}>
                            カテゴリなし
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.separator} />

                    <div className={styles.mentorDetails}>
                      <div className={styles.detailItem}>
                        <FaUsers className={styles.detailIcon} />
                        <span className={styles.detailLabel}>指導中:</span>
                        <span className={styles.detailValue}>{mentor.mentees_count}人</span>
                      </div>
                      <div className={styles.detailItem}>
                        <FaMessage className={styles.detailIcon} />
                        <span className={styles.detailLabel}>返信:</span>
                        <span
                          className={`${styles.detailValue} ${styles.responseTimeText}`}
                        >
                          平均{mentor?.response_time}時間以内
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.buttonGroup}>
                      <a
                        href={`/profile/${mentor.user_id}`}
                        className={`${styles.buttonBase} ${styles.buttonOutline} ${styles.buttonSm} ${styles.buttonFlex1}`}
                      >
                        プロフィール
                      </a>
                      <a
                        href={`/mentor/apply/${mentor.user_id}`}
                        className={`${styles.buttonBase} ${
                          styles.buttonPrimary
                        } ${styles.buttonSm} ${styles.buttonFlex1} ${
                          mentor.employment_status === "busy"
                            ? styles.buttonDisabled
                            : ""
                        }`}
                        aria-disabled={mentor.employment_status === "busy"}
                      >
                        {mentor.mentor_status === "busy"
                          ? "受付停止中"
                          : "申請する"}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {sortedMentors.length === 0 && (
            <div className={styles.noMentorsFound}>
              <p className={styles.noMentorsText}>
                条件に一致するメンターが見つかりませんでした。
              </p>
              <p className={styles.noMentorsText}>
                検索条件を変更してお試しください。
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
