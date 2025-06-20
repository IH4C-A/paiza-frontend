"use client"

import { useState, type JSX } from "react"
// react-router-domからuseParamsをインポート
import { useParams } from "react-router-dom";
// react-iconsをインポート: FaBookOpenとFaMessageを適切なアイコン(FaBook, FaComment)に修正
import { FaHeart, FaStar, FaTrophy, FaUser, FaUserPlus, FaCalendarAlt, FaCode, FaComment, FaBook, FaEllipsisV } from "react-icons/fa"; // Font Awesomeのアイコンを使用
import { FaCog } from "react-icons/fa"; // 設定アイコンの例 (編集ボタンで使用)


// CSS Modulesファイルをインポート (変更なし)
import styles from './ProfilePage.module.css' // CSS Modulesのパスが正しいことを確認してください

// アクティビティタイプとアイコンのマッピング
const activityIconMap: { [key: string]: JSX.Element } = {
  course_completed: <FaBook className={styles.iconSmall} style={{ color: '#3b82f6' }} />, // FaBookOpen -> FaBook
  Youtubeed: <FaComment className={styles.iconSmall} style={{ color: '#22c55e' }} />, // FaMessage -> FaComment
  problem_solved: <FaCode className={styles.iconSmall} style={{ color: '#a855f7' }} />,
  achievement: <FaTrophy className={styles.iconSmall} style={{ color: '#eab308' }} />,
};

export default function ProfilePage() { // paramsの受け取りを削除
  const { id } = useParams<{ id: string }>(); // useParamsフックを使ってidを取得

  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("activity")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ログインユーザーのID（実際の認証システムから取得するように置き換えてください）
  const currentLoggedInUserId = "user123"; // 例: あなたのログインユーザーID

  // ユーザーデータのモック
  // useParamsで取得したIDに基づいてデータを表示するように変更
  const user = {
    id: id || currentLoggedInUserId, // URLにIDがあればそのID、なければログインユーザーIDを使用
    name: "田中太郎",
    username: "@tanaka_dev",
    rank: "A",
    bio: "フロントエンドエンジニア志望の大学生です。React、TypeScriptを中心に学習中。UI/UXにも興味があります。",
    joinDate: "2024年1月",
    location: "東京都",
    website: "https://tanaka-dev.com",
    followers: 156,
    following: 89,
    isOnline: true,
    lastSeen: "2分前",
    specialties: ["React", "TypeScript", "UI/UX", "JavaScript"],
    achievements: [
      { id: "1", name: "React マスター", description: "React基礎講座を完了", icon: "🏆", date: "2024年3月" },
      { id: "2", name: "問題解決王", description: "100問の問題を解決", icon: "🧩", date: "2024年2月" },
      { id: "3", name: "コミュニティ貢献者", description: "50回の質問に回答", icon: "🤝", date: "2024年1月" },
    ],
    stats: {
      problemsSolved: 127,
      coursesCompleted: 8,
      questionsAnswered: 43,
      helpfulAnswers: 38,
      studyStreak: 15,
      totalStudyTime: "156時間",
    },
    learningProgress: [
      { category: "React", progress: 85, level: "上級" },
      { category: "TypeScript", progress: 70, level: "中級" },
      { category: "UI/UX", progress: 60, level: "中級" },
      { category: "アルゴリズム", progress: 45, level: "初級" },
    ],
    recentActivity: [
      {
        id: "1",
        type: "course_completed", // type を使用
        title: "TypeScript応用講座を完了しました",
        timestamp: "2時間前",
      },
      {
        id: "2",
        type: "Youtubeed", // type を使用
        title: "「Reactのパフォーマンス最適化」に回答しました",
        timestamp: "5時間前",
      },
      {
        id: "3",
        type: "problem_solved", // type を使用
        title: "「二分探索の実装」問題を解決しました",
        timestamp: "1日前",
      },
      {
        id: "4",
        type: "achievement", // type を使用
        title: "「React マスター」の称号を獲得しました",
        timestamp: "3日前",
      },
    ],
    uchinoKo: {
      name: "ピカピカ",
      type: "flower",
      level: 7,
      personality: "明るい励まし屋",
      color: "#f59e0b",
      icon: "🌸",
    },
  }

  // 自分のプロフィールかどうかを判定
  const isMyProfile = user.id === currentLoggedInUserId;


  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const getRankClass = (rank: string) => {
    if (rank === "S") return styles.rankS;
    if (rank === "A") return styles.rankA;
    return styles.rankOther;
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {/* プロフィールヘッダー */}
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatarContainer}>
                    <img src="/sampleA.png" alt={user.name} className={styles.avatar} />
                    {user.isOnline && <div className={styles.onlineIndicator} />}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userNameRank}>
                      <h1 className={styles.userName}>{user.name}</h1>
                      <div className={`${styles.userRank} ${getRankClass(user.rank)}`}>
                        {user.rank}
                      </div>
                    </div>
                    <p className={styles.usernameText}>{user.username}</p>
                    <p className={styles.lastSeenText}>
                      {user.isOnline ? "オンライン" : `最終ログイン: ${user.lastSeen}`}
                    </p>
                  </div>
                </div>
                <div className={styles.profileDetails}>
                  <div className={styles.bioActions}>
                    <div className={styles.bioSection}>
                      <p className={styles.bioText}>{user.bio}</p>
                      <div className={styles.specialties}>
                        {user.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className={styles.specialtyTag}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <div className={styles.joinLocation}>
                        <div className={styles.joinItem}>
                          <FaCalendarAlt className={styles.iconSmall} />
                          <span>{user.joinDate}に参加</span>
                        </div>
                        {user.location && (
                          <div className={styles.joinItem}>
                            <span>📍 {user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.actionButtons}>
                      {/* 自分のプロフィールか他人のプロフィールかでボタンを出し分け */}
                      {isMyProfile ? (
                        <>
                          <button className={styles.primaryButton}>
                            <FaUser className={styles.iconSmall} />
                            プロフィールを編集
                          </button>
                          <button className={styles.outlineButton}>
                            <FaCog className={styles.iconSmall} />
                            設定
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={toggleFollow} className={styles.primaryButton}>
                            {isFollowing ? (
                              <>
                                <FaUserPlus className={styles.iconSmall} />
                                フォロー中
                              </>
                            ) : (
                              <>
                                <FaUserPlus className={styles.iconSmall} />
                                フォローする
                              </>
                            )}
                          </button>
                          <button className={styles.outlineButton}>
                            <FaComment className={styles.iconSmall} /> {/* FaMessage -> FaComment */}
                            メッセージ
                          </button>
                          <div className={styles.dropdown}>
                            <button onClick={toggleDropdown} className={styles.outlineIconButton}>
                              <FaEllipsisV className={styles.iconSmall} />
                              <span className={styles.srOnly}>その他</span>
                            </button>
                            {isDropdownOpen && (
                              <div className={styles.dropdownContent}>
                                <a href="#" className={styles.dropdownItem}>プロフィールをシェア</a>
                                <a href="#" className={styles.dropdownItem}>ブロック</a>
                                <a href="#" className={styles.dropdownItem}>報告</a>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.followStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statNumber}>{user.followers}</div>
                      <div className={styles.statLabel}>フォロワー</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statNumber}>{user.following}</div>
                      <div className={styles.statLabel}>フォロー中</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statNumber}>{user.stats.studyStreak}</div>
                      <div className={styles.statLabel}>連続学習日</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mainGrid}>
            <div>
              <div className={styles.tabsContainer}>
                <div className={styles.tabsList}>
                  <button
                    className={`${styles.tabTrigger} ${activeTab === 'activity' ? styles.tabTriggerActive : ''}`}
                    onClick={() => setActiveTab('activity')}
                  >
                    アクティビティ
                  </button>
                  <button
                    className={`${styles.tabTrigger} ${activeTab === 'progress' ? styles.tabTriggerActive : ''}`}
                    onClick={() => setActiveTab('progress')}
                  >
                    学習進捗
                  </button>
                  <button
                    className={`${styles.tabTrigger} ${activeTab === 'achievements' ? styles.tabTriggerActive : ''}`}
                    onClick={() => setActiveTab('achievements')}
                  >
                    実績
                  </button>
                </div>

                {activeTab === 'activity' && (
                  <div className={styles.tabContent}>
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>最近のアクティビティ</h2>
                        <p className={styles.cardDescription}>最近の学習活動と成果</p>
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.activityList}>
                          {user.recentActivity.map((activity) => (
                            <div key={activity.id} className={styles.activityItem}>
                              <div className={styles.activityIconContainer}>
                                {activityIconMap[activity.type]} {/* typeに基づいてアイコンをレンダリング */}
                              </div>
                              <div className={styles.activityText}>
                                <p className={styles.activityTitle}>{activity.title}</p>
                                <p className={styles.activityTimestamp}>{activity.timestamp}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'progress' && (
                  <div className={styles.tabContent}>
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>学習進捗</h2>
                        <p className={styles.cardDescription}>各分野での学習状況</p>
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.progressList}>
                          {user.learningProgress.map((item) => (
                            <div key={item.category} className={styles.progressItem}>
                              <div className={styles.progressHeader}>
                                <span className={styles.progressCategory}>{item.category}</span>
                                <div className={styles.progressDetails}>
                                  <span className={styles.progressLevel}>{item.level}</span>
                                  <span className={styles.progressPercentage}>{item.progress}%</span>
                                </div>
                              </div>
                              <div className={styles.progressBarBackground}>
                                <div className={styles.progressBarFill} style={{ width: `${item.progress}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div className={styles.tabContent}>
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>獲得した実績</h2>
                        <p className={styles.cardDescription}>学習で達成した成果と称号</p>
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.achievementsGrid}>
                          {user.achievements.map((achievement) => (
                            <div key={achievement.id} className={styles.achievementItem}>
                              <div className={styles.achievementIcon}>{achievement.icon}</div>
                              <div className={styles.achievementText}>
                                <h3 className={styles.achievementName}>{achievement.name}</h3>
                                <p className={styles.achievementDescription}>{achievement.description}</p>
                                <p className={styles.achievementDate}>{achievement.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.sidebar}>
              {/* 統計情報 */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>学習統計</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.statsList}>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>解決した問題</span>
                      <span className={styles.statRowValue}>{user.stats.problemsSolved}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>完了した講座</span>
                      <span className={styles.statRowValue}>{user.stats.coursesCompleted}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>回答した質問</span>
                      <span className={styles.statRowValue}>{user.stats.questionsAnswered}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>役立った回答</span>
                      <span className={styles.statRowValue}>{user.stats.helpfulAnswers}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>総学習時間</span>
                      <span className={styles.statRowValue}>{user.stats.totalStudyTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* うちのコ情報 */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitleWithIcon}>
                    <FaHeart className={styles.iconSmall} style={{ color: '#ec4899' }} />
                    うちのコ
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.uchinoKoInfo}>
                    <div
                      className={styles.uchinoKoAvatarOuter}
                      style={{ backgroundColor: `${user.uchinoKo.color}20` }}
                    >
                      <div
                        className={styles.uchinoKoAvatarInner}
                        style={{ backgroundColor: user.uchinoKo.color }}
                      >
                        {user.uchinoKo.icon}
                      </div>
                    </div>
                    <h3 className={styles.uchinoKoName}>{user.uchinoKo.name}</h3>
                    <p className={styles.uchinoKoLevel}>レベル {user.uchinoKo.level}</p>
                    <p className={styles.uchinoKoPersonality}>{user.uchinoKo.personality}</p>
                  </div>
                </div>
              </div>

              {/* ランキング */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitleWithIcon}>
                    <FaStar className={styles.iconSmall} style={{ color: '#facc15' }} />
                    ランキング
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.rankingList}>
                    <div className={styles.rankingItem}>
                      <span className={styles.rankingLabel}>総合ランキング</span>
                      <span className={styles.rankingValue}>#42</span>
                    </div>
                    <div className={styles.rankingItem}>
                      <span className={styles.rankingLabel}>React分野</span>
                      <span className={styles.rankingValue}>#15</span>
                    </div>
                    <div className={styles.rankingItem}>
                      <span className={styles.rankingLabel}>問題解決数</span>
                      <span className={styles.rankingValue}>#28</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}