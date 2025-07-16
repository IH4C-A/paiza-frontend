import { FaSearch } from "react-icons/fa";
import styles from "./SkillCheckPage.module.css";
import { useProblems } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react"; // Import useState and useMemo

export default function SkillCheckPage() {
  const { problems } = useProblems();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Filter problems based on searchTerm
  const filteredProblems = useMemo(() => {
    if (!searchTerm) {
      return problems; // Return all problems if search term is empty
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return problems.filter((p) =>
      p.problem_title.toLowerCase().includes(lowerCaseSearchTerm) ||
      p.problem_text.toLowerCase().includes(lowerCaseSearchTerm) ||
      p.category.category_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      p.rank.rank_name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [problems, searchTerm]); // Re-run memoization when problems or searchTerm changes

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
                  value={searchTerm} // Bind input value to state
                  onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
                />
              </div>
            </div>
          </div>
          {/* Tabs & Filters は別コンポーネント化または削除予定 */}
        </div>

        <div className={styles.cardGrid}>
          {filteredProblems.map((p, i) => ( // Use filteredProblems here
            <div className={styles.card} key={i}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleRow}>
                  <h2 className={styles.cardTitle}>{p.problem_title}</h2>
                  <span
                    className={styles.cardBadge}
                    // You might want to dynamically set background color based on rank
                    // style={{ backgroundColor: getRankColor(p.rank.rank_name) }}
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
                <button
                  className={styles.cardButton}
                  onClick={() => navigate(`/skillcheck/${p.problem_id}`)}
                >
                  問題に挑戦
                </button>
              </div>
            </div>
          ))}
          {filteredProblems.length === 0 && searchTerm && (
            <p style={{ textAlign: 'center', width: '100%', marginTop: '2rem' }}>
              "{searchTerm}" に一致する問題は見つかりませんでした。
            </p>
          )}
        </div>
      </main>
    </div>
  );
}