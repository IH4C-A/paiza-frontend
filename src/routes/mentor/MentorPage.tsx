"use client"

import { useState } from "react"
// lucide-reactの代わりにreact-icons/fa6からアイコンをインポート
import {  FaStar, FaUsers, FaMessage } from "react-icons/fa6" // FaMessageはFa6にあります

// CSSモジュールをインポート
import styles from "./MentorPage.module.css"
import { FaSearch } from "react-icons/fa"

const mentors = [
  {
    id: 1,
    name: "田中 太郎",
    avatar: "/placeholder.svg?height=80&width=80",
    rank: "S",
    introduction:
      "10年以上のWebエンジニア経験を持ち、React/Next.jsを中心としたフロントエンド開発が得意です。初心者から上級者まで丁寧に指導します。",
    categories: ["React", "JavaScript", "TypeScript", "Next.js"],
    rating: 4.9,
    reviewCount: 156,
    menteeCount: 23,
    responseTime: "平均2時間以内",
    status: "available",
  },
  {
    id: 2,
    name: "佐藤 花子",
    avatar: "/placeholder.svg?height=80&width=80",
    rank: "A",
    introduction:
      "UI/UXデザイナーとして5年の経験があります。デザインシステムの構築やユーザビリティ向上のお手伝いをします。",
    categories: ["UI/UX", "Figma", "デザインシステム", "ユーザビリティ"],
    rating: 4.8,
    reviewCount: 89,
    menteeCount: 15,
    responseTime: "平均4時間以内",
    status: "available",
  },
  {
    id: 3,
    name: "鈴木 一郎",
    avatar: "/placeholder.svg?height=80&width=80",
    rank: "S",
    introduction: "機械学習エンジニアとして8年の経験。Python、TensorFlow、PyTorchを使ったAI開発を専門としています。",
    categories: ["Python", "機械学習", "AI", "データサイエンス"],
    rating: 4.7,
    reviewCount: 203,
    menteeCount: 31,
    responseTime: "平均3時間以内",
    status: "busy",
  },
  {
    id: 4,
    name: "高橋 美咲",
    avatar: "/placeholder.svg?height=80&width=80",
    rank: "A",
    introduction: "バックエンドエンジニアとして6年の経験。Node.js、Go、AWSを使ったサーバーサイド開発が得意です。",
    categories: ["Node.js", "Go", "AWS", "データベース"],
    rating: 4.6,
    reviewCount: 124,
    menteeCount: 18,
    responseTime: "平均5時間以内",
    status: "available",
  },
]

const categories = [
  "すべて",
  "React",
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Node.js",
  "UI/UX",
  "機械学習",
  "AWS",
  "データベース",
  "Next.js",
  "Figma",
]

export default function MentorListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("すべて")
  const [selectedRank, setSelectedRank] = useState("すべて")
  const [sortBy, setSortBy] = useState("rating")

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.introduction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "すべて" || mentor.categories.includes(selectedCategory)

    const matchesRank = selectedRank === "すべて" || mentor.rank === selectedRank

    return matchesSearch && matchesCategory && matchesRank
  })

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviewCount - a.reviewCount
      case "mentees":
        return b.menteeCount - a.menteeCount
      default:
        return 0
    }
  })

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
                <FaSearch className={styles.searchIcon} /> {/* SearchアイコンをFaSearchに変更 */}
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
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={styles.selectCategory}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {/* Selectコンポーネントの代わりにselectタグを使用 */}
                <select value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)} className={styles.selectRank}>
                  <option value="すべて">すべて</option>
                  <option value="S">Sランク</option>
                  <option value="A">Aランク</option>
                </select>
                {/* Selectコンポーネントの代わりにselectタグを使用 */}
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.selectSortBy}>
                  <option value="rating">評価順</option>
                  <option value="reviews">レビュー数順</option>
                  <option value="mentees">指導人数順</option>
                </select>
              </div>
            </div>
          </div>

          {/* 検索結果 */}
          <div className={styles.resultsSummary}>
            <p className={styles.resultsCount}>{sortedMentors.length}件のメンターが見つかりました</p>
          </div>

          {/* メンターカード一覧 */}
          <div className={styles.mentorCardsGrid}>
            {sortedMentors.map((mentor) => (
              // Cardコンポーネントの代わりにdivタグを使用
              <div key={mentor.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.mentorHeader}>
                    <div className={styles.avatarWrapper}>
                      {/* Avatarコンポーネントの代わりにimgタグとdivタグを使用 */}
                      <div className={styles.avatar}>
                        <img src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} className={styles.avatarImage} />
                        {!mentor.avatar && <div className={styles.avatarFallback}>{mentor.name.slice(0, 2)}</div>}
                      </div>
                      <div className={styles.badgeAbsolute}>
                        {/* Badgeコンポーネントの代わりにspanタグを使用 */}
                        <span
                          className={`${styles.badgeBase} ${mentor.rank === "S" ? styles.badgeDestructive : styles.badgeSecondary} ${styles.rankBadge}`}
                        >
                          {mentor.rank}
                        </span>
                      </div>
                    </div>
                    <div className={styles.mentorMeta}>
                      {/* CardTitleの代わりにh3タグを使用 */}
                      <h3 className={styles.mentorName}>{mentor.name}</h3>
                      <div className={styles.mentorStats}>
                        <div className={styles.rating}>
                          <FaStar className={styles.starIcon} /> {/* StarアイコンをFaStarに変更 */}
                          <span className={styles.ratingText}>{mentor.rating}</span>
                        </div>
                        <span className={styles.reviewCount}>({mentor.reviewCount}件)</span>
                        <div
                          className={`${styles.statusDot} ${
                            mentor.status === "available" ? styles.statusDotAvailable : styles.statusDotBusy
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <p className={styles.introductionText}>{mentor.introduction}</p>

                  <div>
                    <h4 className={styles.subHeading}>得意分野</h4>
                    <div className={styles.categoryBadges}>
                      {mentor.categories.slice(0, 4).map((category) => (
                        // Badgeコンポーネントの代わりにspanタグを使用
                        <span key={category} className={`${styles.badgeBase} ${styles.badgeOutline} ${styles.badgeXs}`}>
                          {category}
                        </span>
                      ))}
                      {mentor.categories.length > 4 && (
                        <span className={`${styles.badgeBase} ${styles.badgeOutline} ${styles.badgeXs}`}>
                          +{mentor.categories.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Separatorコンポーネントの代わりにdivタグを使用 */}
                  <div className={styles.separator} />

                  <div className={styles.mentorDetails}>
                    <div className={styles.detailItem}>
                      <FaUsers className={styles.detailIcon} /> {/* UsersアイコンをFaUsersに変更 */}
                      <span className={styles.detailLabel}>指導中:</span>
                      <span className={styles.detailValue}>{mentor.menteeCount}人</span>
                    </div>
                    <div className={styles.detailItem}>
                      <FaMessage className={styles.detailIcon} /> {/* MessageCircleアイコンをFaMessageに変更 */}
                      <span className={styles.detailLabel}>返信:</span>
                      <span className={`${styles.detailValue} ${styles.responseTimeText}`}>{mentor.responseTime}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.buttonGroup}>
                    {/* Buttonコンポーネントの代わりにbuttonタグを使用 */}
                    <a href={`/profile/${mentor.id}`} className={`${styles.buttonBase} ${styles.buttonOutline} ${styles.buttonSm} ${styles.buttonFlex1}`}>
                      プロフィール
                    </a>
                    {/* Buttonコンポーネントの代わりにLinkタグを使用 */}
                    <a
                      href={`/mentor/apply/${mentor.id}`}
                      className={`${styles.buttonBase} ${styles.buttonPrimary} ${styles.buttonSm} ${styles.buttonFlex1} ${mentor.status === "busy" ? styles.buttonDisabled : ""}`}
                      aria-disabled={mentor.status === "busy"} // アクセシビリティのために追加
                    >
                      {mentor.status === "busy" ? "受付停止中" : "申請する"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedMentors.length === 0 && (
            <div className={styles.noMentorsFound}>
              <p className={styles.noMentorsText}>条件に一致するメンターが見つかりませんでした。</p>
              <p className={styles.noMentorsText}>検索条件を変更してお試しください。</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}