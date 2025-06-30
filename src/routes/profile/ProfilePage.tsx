"use client"

import { useState } from "react"
// react-router-domからuseParamsをインポート
import { useNavigate, useParams } from "react-router-dom";
// react-iconsをインポート: FaBookOpenとFaMessageを適切なアイコン(FaBook, FaComment)に修正
import { FaHeart, FaStar, FaUser, FaUserPlus, FaCalendarAlt, FaComment, FaEllipsisV } from "react-icons/fa"; // Font Awesomeのアイコンを使用
import { FaCog } from "react-icons/fa"; // 設定アイコンの例 (編集ボタンで使用)
import { useUser, useCurrentUser, useUserPlant } from "../../hooks";
import { plantTypes } from "../../types/plantType";

// CSS Modulesファイルをインポート (変更なし)
import styles from './ProfilePage.module.css' // CSS Modulesのパスが正しいことを確認してください

// アクティビティタイプとアイコンのマッピング
// const activityIconMap: { [key: string]: JSX.Element } = {
//   course_completed: <FaBook className={styles.iconSmall} style={{ color: '#3b82f6' }} />, // FaBookOpen -> FaBook
//   Youtubeed: <FaComment className={styles.iconSmall} style={{ color: '#22c55e' }} />, // FaMessage -> FaComment
//   problem_solved: <FaCode className={styles.iconSmall} style={{ color: '#a855f7' }} />,
//   achievement: <FaTrophy className={styles.iconSmall} style={{ color: '#eab308' }} />,
// };

export default function ProfilePage() { // paramsの受け取りを削除
  const { id } = useParams<{ id: string }>(); // useParamsフックを使ってidを取得

  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("activity")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useUser(id ?? "");
  const { currentUser } = useCurrentUser();
  const { userplant } = useUserPlant(id ?? "");
  const navigate = useNavigate();

  const selectedType = plantTypes.find(
      (type) => type.id === userplant?.growth_stage
    );
  console.log(user)

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

  const isMyProfile = user?.user_id === (typeof currentUser === "string" ? currentUser : currentUser?.user_id);

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
                    <img src="/sampleA.png" alt={user?.first_name} className={styles.avatar} />
                    {/* {user.isOnline && <div className={styles.onlineIndicator} />} */}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userNameRank}>
                      <h1 className={styles.userName}>{user?.last_name}{user?.first_name}</h1>
                      <div className={`${styles.userRank} ${getRankClass(user?.ranks?.[1].rank_name ?? "")}`}>
                        {user?.ranks?.[1].rank_name}
                      </div>
                    </div>
                    <p className={styles.usernameText}>{user?.username}</p>
                    <p className={styles.lastSeenText}>
                      {/* {user.isOnline ? "オンライン" : `最終ログイン: ${user.lastSeen}`} */}
                    </p>
                  </div>
                </div>
                <div className={styles.profileDetails}>
                  <div className={styles.bioActions}>
                    <div className={styles.bioSection}>
                      <p className={styles.bioText}></p>
                      <div className={styles.specialties}>
                        {user?.categories.map((specialty) => (
                          <span
                            key={specialty.category_id}
                            className={styles.specialtyTag}
                          >
                            {specialty.category_name}
                          </span>
                        ))}
                      </div>
                      <div className={styles.joinLocation}>
                        <div className={styles.joinItem}>
                          <FaCalendarAlt className={styles.iconSmall} />
                          <span>{user?.created_at}に参加</span>
                        </div>
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
                                指導中
                              </>
                            ) : (
                              <div  className={styles.iconSmall} onClick={() => navigate(`/mentor/apply/${user?.user_id}`)}>
                                <FaUserPlus />
                                メンター申請へ
                              </div>
                            )}
                          </button>
                          <button className={styles.outlineButton} onClick={() => navigate(`/chats/${user?.user_id}`)}>
                            <FaComment className={styles.iconSmall} />
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
                      <div className={styles.statNumber}>{user?.mentees_count}</div>
                      <div className={styles.statLabel}>指導中</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statNumber}>0</div>
                      <div className={styles.statLabel}>フォロー中</div>
                    </div>
                    <div className={styles.statItem}>
                      {/* <div className={styles.statNumber}>{user.stats.studyStreak}</div> */}
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
                      {/* <span className={styles.statRowValue}>{user.stats.problemsSolved}</span> */}
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>完了した講座</span>
                      {/* <span className={styles.statRowValue}>{user.stats.coursesCompleted}</span> */}
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>回答した質問</span>
                      {/* <span className={styles.statRowValue}>{user.stats.questionsAnswered}</span> */}
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>役立った回答</span>
                      {/* <span className={styles.statRowValue}>{user.stats.helpfulAnswers}</span> */}
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statRowLabel}>総学習時間</span>
                      {/* <span className={styles.statRowValue}>{user.stats.totalStudyTime}</span> */}
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
                      style={{ backgroundColor: `${userplant?.color}20` }}
                    >
                      <div
                        className={styles.uchinoKoAvatarInner}
                        style={{ backgroundColor: userplant?.color }}
                      >
                        {selectedType?.icon || "🌱"}
                      </div>
                    </div>
                    <h3 className={styles.uchinoKoName}>{userplant?.plant_name}</h3>
                    <p className={styles.uchinoKoLevel}>レベル {userplant?.growth_milestones.level}</p>
                    <p className={styles.uchinoKoPersonality}>{userplant?.growth_stage}</p>
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