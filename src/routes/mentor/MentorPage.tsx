"use client";

import { useState } from "react";
// lucide-reactの代わりにreact-icons/fa6からアイコンをインポート
import { FaStar, FaUsers, FaMessage } from "react-icons/fa6"; // FaMessageはFa6にあります

// CSSモジュールをインポート
import styles from "./MentorPage.module.css";
import { FaSearch } from "react-icons/fa";
import { useCategories, useMentorships } from "../../hooks";
import type { Rank } from "../../types/rankType";

export default function MentorListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedRank, setSelectedRank] = useState("すべて");
  const [sortBy, setSortBy] = useState("rating");
  const { categories } = useCategories();
  const { mentorships, candidateMentors } = useMentorships();

  console.log(mentorships);

  const filteredMentors = candidateMentors.filter((mentor) => {
    const matchesSearch =
      mentor.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      mentor.categories.some((cat) =>
        (typeof cat === "string" ? cat : cat.category_name)
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "すべて" ||
      mentor.categories.some(
        (cat) =>
          (typeof cat === "string" && cat === selectedCategory) ||
          (typeof cat === "object" &&
            ("category_name" in cat
              ? cat.category_name === selectedCategory
              : false))
      );

    const matchesRank =
      selectedRank === "すべて" ||
      mentor.ranks.includes(selectedRank as unknown as Rank);

    return matchesSearch && matchesCategory && matchesRank;
  });

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (
          Number(b.ranks?.[0]?.rank_id ?? 0) -
          Number(a.ranks?.[0]?.rank_id ?? 0)
        );
      case "reviews":
        return (
          parseInt(b.ranks?.[0]?.rank_id ?? "0", 10) -
          parseInt(a.ranks?.[0]?.rank_id ?? "0", 10)
        );
        
      default:
        return 0;
    }
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

          {/* 検索・フィルター */}
          <div className={styles.searchFilterSection}>
            <div className={styles.searchFilterControls}>
              <div className={styles.searchInputWrapper}>
                <FaSearch className={styles.searchIcon} />{" "}
                {/* SearchアイコンをFaSearchに変更 */}
                {/* Inputコンポーネントの代わりにinputタグを使用 */}
                <input
                  type="text"
                  placeholder="メンター名、スキル、キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.filterDropdowns}>
                {/* Selectコンポーネントの代わりにselectタグを使用 */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.selectCategory}
                >
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_name}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
                {/* Selectコンポーネントの代わりにselectタグを使用 */}
                <select
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(e.target.value)}
                  className={styles.selectRank}
                >
                  <option value="すべて">すべて</option>
                  <option value="S">Sランク</option>
                  <option value="A">Aランク</option>
                </select>
                {/* Selectコンポーネントの代わりにselectタグを使用 */}
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
            {filteredMentors.map((mentor) => (
              // Cardコンポーネントの代わりにdivタグを使用
              <div key={mentor.user_id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.mentorHeader}>
                    <div className={styles.avatarWrapper}>
                      {/* Avatarコンポーネントの代わりにimgタグとdivタグを使用 */}
                      <div className={styles.avatar}>
                        <img
                          src={
                            mentor.profile_image ||
                            "/placeholder.svg"
                          }
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
                        {/* Badgeコンポーネントの代わりにspanタグを使用 */}
                        <span
                          className={`${styles.badgeBase} ${
                            mentor.ranks?.[0]?.rank_name === "S"
                              ? styles.badgeDestructive
                              : styles.badgeSecondary
                          } ${styles.rankBadge}`}
                        >
                          {mentor.ranks?.[0]?.rank_name}
                        </span>
                      </div>
                    </div>
                    <div className={styles.mentorMeta}>
                      {/* CardTitleの代わりにh3タグを使用 */}
                      <h3 className={styles.mentorName}>
                        {mentor.first_name}
                      </h3>
                      <div className={styles.mentorStats}>
                        <div className={styles.rating}>
                          <FaStar className={styles.starIcon} />{" "}
                          {/* StarアイコンをFaStarに変更 */}
                          {/* <span className={styles.ratingText}>{mentor.rating}</span> */}
                        </div>
                        {/* <span className={styles.reviewCount}>({mentor.reviewCount}件)</span> */}
                        <div
                          className={`${styles.statusDot} ${
                            mentor.employment_status ===
                            "available"
                              ? styles.statusDotAvailable
                              : styles.statusDotBusy
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  {/* <p className={styles.introductionText}>{mentor.introduction}</p> */}

                  <div>
                    <h4 className={styles.subHeading}>得意分野</h4>
                    <div className={styles.categoryBadges}>
                      {mentor.categories
                        .slice(0, 4)
                        .map((category) => (
                          // Badgeコンポーネントの代わりにspanタグを使用
                          <span
                            key={category.category_id}
                            className={`${styles.badgeBase} ${styles.badgeOutline} ${styles.badgeXs}`}
                          >
                            {category.category_name}
                          </span>
                        ))}
                      {mentor.categories.length > 4 && (
                        <span
                          className={`${styles.badgeBase} ${styles.badgeOutline} ${styles.badgeXs}`}
                        >
                          +{mentor.categories.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Separatorコンポーネントの代わりにdivタグを使用 */}
                  <div className={styles.separator} />

                  <div className={styles.mentorDetails}>
                    <div className={styles.detailItem}>
                      <FaUsers className={styles.detailIcon} />{" "}
                      {/* UsersアイコンをFaUsersに変更 */}
                      <span className={styles.detailLabel}>指導中:</span>
                      {/* <span className={styles.detailValue}>{mentor.menteeCount}人</span> */}
                    </div>
                    <div className={styles.detailItem}>
                      <FaMessage className={styles.detailIcon} />{" "}
                      {/* MessageCircleアイコンをFaMessageに変更 */}
                      <span className={styles.detailLabel}>返信:</span>
                      <span
                        className={`${styles.detailValue} ${styles.responseTimeText}`}
                      ></span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.buttonGroup}>
                    {/* Buttonコンポーネントの代わりにbuttonタグを使用 */}
                    <a
                      href={`/profile/${mentor.user_id}`}
                      className={`${styles.buttonBase} ${styles.buttonOutline} ${styles.buttonSm} ${styles.buttonFlex1}`}
                    >
                      プロフィール
                    </a>
                    {/* Buttonコンポーネントの代わりにLinkタグを使用 */}
                    <a
                      href={`/mentor/apply/${mentor.user_id}`}
                      className={`${styles.buttonBase} ${
                        styles.buttonPrimary
                      } ${styles.buttonSm} ${styles.buttonFlex1} ${
                        mentor.employment_status === "busy"
                          ? styles.buttonDisabled
                          : ""
                      }`}
                      aria-disabled={
                        mentor.employment_status === "busy"
                      } // アクセシビリティのために追加
                    >
                      {mentor.employment_status === "busy"
                        ? "受付停止中"
                        : "申請する"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
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
