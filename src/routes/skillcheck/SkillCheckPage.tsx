import { FaFilter, FaSearch } from "react-icons/fa";
import styles from "./SkillCheckPage.module.css";
const problems = [
  {
    title: "Reactコンポーネント設計",
    description: "Webフレームワーク",
    detail:
      "Reactを使用して再利用可能なコンポーネントを設計する問題。状態管理とpropsの適切な使用方法を学びます。",
    tags: ["React", "JavaScript", "コンポーネント"],
    rank: "B",
    rankColor: "#facc15",
  },
  {
    title: "二分探索木の実装",
    description: "アルゴリズム",
    detail:
      "二分探索木のデータ構造を実装し、挿入、検索、削除の操作を実装する問題。効率的なデータ構造の理解を深めます。",
    tags: ["データ構造", "二分木", "探索"],
    rank: "B",
    rankColor: "#facc15",
  },
  {
    title: "レスポンシブデザインの実装",
    description: "UI/UX",
    detail: "モバイルフレンドリーなWebページを設計する問題。メディアクエリとフレックスボックスを使用したレスポンシブデザインを学びます。",
    tags: ["CSS", "レスポンシブ", "デザイン"],
    rank: "B",
    rankColor: "#facc15"
  },
  {
    title: "データベース正規化",
    description: "情報処理試験",
    detail:
      "データベース設計における正規化の概念と実践方法を学ぶ問題。第1正規形から第3正規形までの変換を行います。",
    tags: ["データベース", "正規化", "SQL"],
    rank: "A",
    rankColor: "#f97316",
  },
  {
    title: "GraphQLスキーマ設計",
    description: "Webフレームワーク",
    detail:
      "GraphQLのスキーマ設計とリゾルバの実装を行う問題。RESTful APIとの違いと利点を理解します。",
    tags: ["GraphQL", "API", "スキーマ"],
    rank: "A",
    rankColor: "#f97316",
  },
  {
    title: "ダイクストラ法の実装",
    description: "アルゴリズム",
    detail:
      "グラフ上の最短経路を求めるダイクストラ法を実装する問題。優先度キューを使った効率的な実装方法を学びます。",
    tags: ["グラフ", "最短経路", "アルゴリズム"],
    rank: "S",
    rankColor: "#ef4444",
  },
];

export default function SkillCheckPage() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.mainContainer}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>問題一覧</h1>
              <p className={styles.pageSubtitle}>
                アルゴリズムからWebフレームワーク、UI/UXまで幅広い問題に挑戦しよう
              </p>
            </div>
            <div className={styles.searchFilterWrapper}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="search"
                  placeholder="問題を検索..."
                  className={styles.searchInput}
                />
              </div>
              <button className={styles.outlineButton}>
                <FaFilter className={styles.iconSm} />

                <span className="sr-only">フィルター</span>
              </button>
            </div>
          </div>
          {/* Tabs & Filters は別コンポーネント化または削除予定 */}
        </div>

        <div className={styles.cardGrid}>
          {problems.map((p, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleRow}>
                  <h2 className={styles.cardTitle}>{p.title}</h2>
                  <span
                    className={styles.cardBadge}
                    style={{ backgroundColor: p.rankColor }}
                  >
                    {p.rank}
                  </span>
                </div>
                <div className={styles.cardDescription}>{p.description}</div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.cardText}>{p.detail}</p>
                <div className={styles.cardTags}>
                  {p.tags.map((tag, j) => (
                    <span className={styles.cardTag} key={j}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.cardButton}>問題に挑戦</button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
