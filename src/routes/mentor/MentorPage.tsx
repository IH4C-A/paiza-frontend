import React, { useState, useMemo } from "react";
import styles from "./MentorPage.module.css";

// Define the Mentor type
interface Mentor {
  id: string;
  name: string;
  rank: "S" | "A";
  description: string;
  avatarSrc: string;
  avatarFallback: string;
  specialties: string[]; // For filtering by tab and display
  languages: string[]; // For filtering by language
  answerCount: number;
  // Rating related fields are removed as per requirement
  category: "algorithm" | "web" | "design" | "exam" | "general"; // To match tab values
}

// Sample Mentor Data
const allMentorsData: Mentor[] = [
  {
    id: "1",
    name: "田中さん",
    rank: "S",
    description: "アルゴリズム、React専門",
    avatarSrc: "/placeholder-avatar.png", // Replace with actual path or use placeholder.svg
    avatarFallback: "田中",
    specialties: ["アルゴリズム", "React", "JavaScript"],
    languages: ["JavaScript", "Python"],
    answerCount: 256,
    category: "algorithm", // Tanaka is strong in algorithms
  },
  {
    id: "2",
    name: "佐藤さん",
    rank: "A",
    description: "UI/UX、Vue.js専門",
    avatarSrc: "/placeholder-avatar.png",
    avatarFallback: "佐藤",
    specialties: ["UI/UX", "Vue.js", "CSS"],
    languages: ["JavaScript"],
    answerCount: 178,
    category: "design", // Sato is strong in UI/UX
  },
  {
    id: "3",
    name: "鈴木さん",
    rank: "A",
    description: "情報処理試験、DB専門",
    avatarSrc: "/placeholder-avatar.png",
    avatarFallback: "鈴木",
    specialties: ["情報処理試験", "データベース", "SQL"],
    languages: ["Java", "SQL"],
    answerCount: 142,
    category: "exam", // Suzuki is strong in exams
  },
  {
    id: "4",
    name: "高橋さん",
    rank: "S",
    description: "機械学習、Python専門",
    avatarSrc: "/placeholder-avatar.png",
    avatarFallback: "高橋",
    specialties: ["機械学習", "Python", "データ分析"],
    languages: ["Python"],
    answerCount: 312,
    category: "algorithm", // Takahashi ML aligns with general algorithms or a new category
  },
  {
    id: "5",
    name: "渡辺さん",
    rank: "A",
    description: "Webフレームワーク全般",
    avatarSrc: "/placeholder-avatar.png",
    avatarFallback: "渡辺",
    specialties: ["Ruby on Rails", "Django", "Node.js"],
    languages: ["Ruby", "Python", "JavaScript"],
    answerCount: 190,
    category: "web",
  },
];

// Tab configuration
const TABS = [
  { value: "all", label: "すべて" },
  { value: "algorithm", label: "アルゴリズム" },
  { value: "web", label: "Webフレームワーク" },
  { value: "design", label: "UI/UX" },
  { value: "exam", label: "情報処理試験" },
];

const MentorCard: React.FC<{ mentor: Mentor }> = ({ mentor }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderContent}>
          <img
            src={mentor.avatarSrc}
            alt={mentor.name}
            className={styles.avatar}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          {/* Basic fallback if image fails, can be enhanced */}
          {!mentor.avatarSrc && (
            <div className={styles.avatarFallback}>{mentor.avatarFallback}</div>
          )}

          <div className={styles.cardTitleContainer}>
            <h3 className={styles.cardTitle}>
              {mentor.name}
              <span
                className={`${styles.rankBadge} ${
                  mentor.rank === "S" ? styles.rankS : styles.rankA
                }`}
              >
                {mentor.rank}
              </span>
            </h3>
            <p className={styles.cardDescription}>{mentor.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.contentSection}>
          <h4 className={styles.subHeading}>専門分野</h4>
          <div className={styles.tagsContainer}>
            {mentor.specialties.map((spec, index) => (
              <span key={index} className={styles.tag}>
                {spec}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.contentSection}>
          <h4 className={styles.subHeading}>回答数</h4>
          <p className={styles.answerCountText}>{mentor.answerCount}件</p>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.actionButton}>質問する</button>
      </div>
    </div>
  );
};

export default function MentorsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRank, setSelectedRank] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const filteredMentors = useMemo(() => {
    return allMentorsData.filter((mentor) => {
      const matchesTab =
        activeTab === "all" ||
        mentor.category === activeTab ||
        mentor.specialties.some((s) => s.toLowerCase().includes(activeTab));
      const matchesSearch =
        searchTerm === "" ||
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.specialties.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesRank =
        selectedRank === "all" || mentor.rank === selectedRank;
      const matchesLanguage =
        selectedLanguage === "all" ||
        mentor.languages.includes(selectedLanguage);

      return matchesTab && matchesSearch && matchesRank && matchesLanguage;
    });
  }, [activeTab, searchTerm, selectedRank, selectedLanguage]);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <div className={styles.titleText}>
              <h1>メンター</h1>
            </div>
            <div className={styles.searchAndFilters}>
              <input
                type="search"
                placeholder="メンターを検索..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tabsContainer}>
            <div className={styles.tabsList}>
              {TABS.map((tab) => (
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

            <div className={styles.filtersRow}>
              <select
                className={styles.selectControl}
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
              >
                <option value="all">すべてのランク</option>
                <option value="S">Sランク</option>
                <option value="A">Aランク</option>
              </select>
              <select
                className={styles.selectControl}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="all">すべての言語</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="sql">SQL</option>{" "}
                {/* Added SQL based on Suzuki's data */}
                {/* Add other languages as needed */}
              </select>
            </div>

            {/* Tab Content - Dynamically render filtered mentors */}
            {/* The content for different tabs is now handled by the filtering logic */}
            <div className={styles.cardsGrid}>
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))
              ) : (
                <p>該当するメンターが見つかりません。</p>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Footer would be part of a Layout component */}
    </div>
  );
}
