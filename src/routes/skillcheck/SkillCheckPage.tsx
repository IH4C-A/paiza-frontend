import { FaFilter, FaSearch } from "react-icons/fa";
import styles from "./SkillCheckPage.module.css";
import { useProblems } from "../../hooks";
import { useNavigate } from "react-router-dom";

export default function SkillCheckPage() {
  const { problems } = useProblems();
  const navigate = useNavigate();
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
                  <h2 className={styles.cardTitle}>{p.problem_title}</h2>
                  <span
                    className={styles.cardBadge}
                  >
                    {p.rank.rank_name}
                  </span>
                </div>
                {/* <div className={styles.cardDescription}>{p.description}</div> */}
              </div>
              <div className={styles.cardContent}>
                <p className={styles.cardText}>{p.problem_text}</p>
                <div className={styles.cardTags}>
                    <span className={styles.cardTag}>
                      {p.category.category_name}
                    </span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.cardButton} onClick={() => navigate(`/skillcheck/${p.problem_id}`)}>問題に挑戦</button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
