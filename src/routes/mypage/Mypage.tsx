import { useState } from "react";
import styles from "./Mypage.module.css";
import { FaCode } from "react-icons/fa";
import { FiCode } from "react-icons/fi";
import { useCurrentUser } from "../../hooks/useUser";
import { usePlant, useMentorships } from "../../hooks";
import { plantTypes } from "../../types/plantType";
import UserCategoryGate from "../../components/modal/UserCategoryGate";
import { useNavigate } from "react-router-dom";
import { useMentorshipSchedules } from "../../hooks/useMentorSchedule";
import type { MentorSchedule } from "../../types/mentorSchedule";

function getThisWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay()); // 日曜始まり

  const end = new Date(start);
  end.setDate(start.getDate() + 7); // 土曜終わり

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function groupThisWeekSchedules(schedules: MentorSchedule[]) {
  const { start, end } = getThisWeekRange();
  const grouped: Record<string, { count: number; schedule_id: string; start_time: string }> = {};

  schedules.forEach((s) => {
    const startTime = new Date(s.start_time);
    if (startTime >= start && startTime <= end) {
      const key = s.topic || "未分類";
      if (!grouped[key]) {
        grouped[key] = { count: 1, schedule_id: s.schedule_id, start_time: s.start_time };
      } else {
        grouped[key].count += 1;
      }
    }
  });

  return grouped;
}


export default function Mypage() {
  const [activeTab, setActiveTab] = useState("all");
  const { currentUser } = useCurrentUser();
  const { plant } = usePlant();
  const navigate = useNavigate();
  const { candidateMentors } = useMentorships();
  const { schedules } = useMentorshipSchedules();

  const progressData = groupThisWeekSchedules(schedules);
  // const maxCount = Math.max(...Object.values(progressData).map((v) => v.count), 1);

  const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({
    value,
    children,
  }) => {
    return activeTab === value ? (
      <div className={styles.tabsContent}>{children}</div>
    ) : null;
  };

  const handleClick = () => {
    navigate("/question");
  };
  const getPlantPreview = () => {
    const selectedType = plantTypes.find(
      (type) => type.id === plant?.growth_stage
    );
    return (
      <div className={styles.plantPreviewContainer}>
        <div
          className={styles.plantPreviewOuter}
          style={{
            width: `${(plant?.size ?? 100) + 50}px`,
            height: `${(plant?.size ?? 100) + 50}px`,
            backgroundColor: `${plant?.color}20`,
          }}
        >
          <div
            className={styles.plantPreviewInner}
            style={{
              width: `${plant?.size}px`,
              height: `${plant?.size}px`,
              backgroundColor: plant?.color,
            }}
          >
            {selectedType?.icon || "🌱"}
          </div>
        </div>
      </div>
    );
  };

  const handlePlantClick = () => {
    if (plant) {
      navigate("/partner");
    } else {
      navigate("/partner/setup");
    }
  };

  return (
    <>
      <UserCategoryGate />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.mainContent}>
            <div className={styles.leftColumn}>
              <div className={styles.dashboardHeader}>
                <h1 className={styles.title}>{currentUser?.first_name} さん</h1>
                <div className={styles.rank}>
                  <span className={styles.rankText}>ランク(学生):</span>
                  <div className={styles.rankBadge}>
                    {currentUser?.ranks?.[0]?.rank_name}
                  </div>
                  <span className={styles.rankText}>ランク(メンター):</span>
                  <div className={styles.rankBadge}>
                    {currentUser?.ranks?.[1]?.rank_name}
                  </div>
                </div>
              </div>

              <div className={styles.tabs}>
                <div className={styles.tabsList}>
                  <button
                    className={`${styles.tabsTrigger} ${
                      activeTab === "all" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    すべて
                  </button>
                  <button
                    className={`${styles.tabsTrigger} ${
                      activeTab === "algorithm" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("algorithm")}
                  >
                    アルゴリズム
                  </button>
                  <button
                    className={`${styles.tabsTrigger} ${
                      activeTab === "web" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("web")}
                  >
                    Webフレームワーク
                  </button>
                  <button
                    className={`${styles.tabsTrigger} ${
                      activeTab === "design" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("design")}
                  >
                    UI/UX
                  </button>
                  <button
                    className={`${styles.tabsTrigger} ${
                      activeTab === "exam" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("exam")}
                  >
                    情報処理試験
                  </button>
                </div>

                <TabsContent value="all">
                  <div className={styles.cardGrid}>
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>今日のおすすめ問題</h3>
                        <p className={styles.cardDescription}>
                          あなたのレベルに合わせた問題です
                        </p>
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.problemList}>
                          <div className={styles.problemItem}>
                            <div className={styles.problemIcon}>
                              <FaCode className={styles.icon} />
                            </div>
                            <div className={styles.problemContent}>
                              <div className={styles.problemHeader}>
                                <h4 className={styles.problemTitle}>
                                  Reactコンポーネント設計
                                </h4>
                                <span className={styles.difficultyB}>B</span>
                              </div>
                              <p className={styles.problemDescription}>
                                Reactを使用して再利用可能なコンポーネントを設計する問題
                              </p>
                            </div>
                          </div>
                          <div className={styles.problemItem}>
                            <div className={styles.problemIcon}>
                              <FiCode className={styles.icon} />
                            </div>
                            <div className={styles.problemContent}>
                              <div className={styles.problemHeader}>
                                <h4 className={styles.problemTitle}>
                                  二分探索木の実装
                                </h4>
                                <span className={styles.difficultyB}>B</span>
                              </div>
                              <p className={styles.problemDescription}>
                                二分探索木のデータ構造を実装する問題
                              </p>
                            </div>
                          </div>
                          <div className={styles.problemItem}>
                            <div className={styles.problemIcon}>
                              <FiCode className={styles.icon} />
                            </div>
                            <div className={styles.problemContent}>
                              <div className={styles.problemHeader}>
                                <h4 className={styles.problemTitle}>
                                  レスポンシブデザインの実装
                                </h4>
                                <span className={styles.difficultyB}>B</span>
                              </div>
                              <p className={styles.problemDescription}>
                                モバイルフレンドリーなWebページを設計する問題
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.cardFooter}>
                        <button className={styles.primaryButton}>
                          すべての問題を見る
                        </button>
                      </div>
                    </div>

                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>スケジュール予定</h3>
                        <p className={styles.cardDescription}>今週のスケジュール予定</p>
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.progressList}>
                          {Object.entries(progressData).map(
                            ([topic, count]) => {
                              return (
                                <div
                                  className={styles.progressItem}
                                  key={topic}
                                  onClick={() => {
                                    navigate(`/mentor/schedule/${count.schedule_id}`);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className={styles.progressHeader}>
                                    <span className={styles.progressLabel}>
                                      {topic}
                                    </span>
                                    <span className={styles.progressValue}>
                                      {count.start_time}
                                    </span>
                                  </div>
                                  <div className={styles.progressBar}>
                                    <span className={styles.progressValue}>
                                      {count.start_time}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="algorithm">
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>アルゴリズム問題</h3>
                      <p className={styles.cardDescription}>
                        データ構造とアルゴリズムの問題
                      </p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardGrid}>
                        {/* アルゴリズム問題のリスト */}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="web">
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>
                        Webフレームワーク問題
                      </h3>
                      <p className={styles.cardDescription}>
                        React, Vue, Angularなどのフレームワーク問題
                      </p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardGrid}>
                        {/* Webフレームワーク問題のリスト */}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design">
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>UI/UX問題</h3>
                      <p className={styles.cardDescription}>
                        デザインとユーザー体験に関する問題
                      </p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardGrid}>
                        {/* UI/UX問題のリスト */}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="exam">
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>情報処理試験対策</h3>
                      <p className={styles.cardDescription}>
                        情報処理技術者試験の対策問題
                      </p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardGrid}>
                        {/* 情報処理試験問題のリスト */}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>うちのコ</h3>
                  <p className={styles.cardDescription}>あなたのパートナー</p>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.petContainer}>
                    <div className={styles.petVisual}>{getPlantPreview()}</div>
                    <h4 className={styles.petName}>{plant?.plant_name}</h4>
                    <p className={styles.petLevel}>
                      レベル: {plant?.growth_milestones?.level ?? 0}
                    </p>
                    <div className={styles.progressItem}>
                      <div className={styles.progressHeader}>
                        <span className={styles.progressLabel}>成長度</span>
                        <span className={styles.progressValue}>
                          {plant?.growth_milestones?.milestone ?? 0}%
                        </span>
                      </div>
                      <div
                        className={`${styles.progressBar} ${styles.petProgress}`}
                      >
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${
                              plant?.growth_milestones?.milestone ?? 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.petMessage}>
                      <p>
                        「今日も一緒に頑張ろう！新しいWebフレームワークの問題に挑戦してみない？」
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <button
                    className={styles.outlineButton}
                    onClick={handlePlantClick}
                  >
                    うちのコと話す
                  </button>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>メンターシステム</h3>
                  <p className={styles.cardDescription}>質問や相談ができます</p>
                </div>
                <div className={styles.cardContent}>
                  {candidateMentors.slice(0, 3).map((mentor) => (
                    <div className={styles.mentorList}>
                      <div className={styles.mentorItem}>
                        <div className={styles.mentorAvatar}>
                          <div
                            className={`${styles.mentorBadge} ${styles.rankS}`}
                          >
                            {mentor.ranks?.[1].rank_name}
                          </div>
                        </div>
                        <div className={styles.mentorInfo}>
                          <h4 className={styles.mentorName}>
                            {mentor?.first_name}さん
                          </h4>
                          <div className={styles.mentorSpecialtyList}>
                            {mentor.categories?.map((category) => (
                              <p
                                key={category.category_id}
                                className={styles.mentorSpecialty}
                              >
                                {category.category_name}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.cardFooter}>
                  <button
                    className={styles.primaryButton}
                    onClick={handleClick}
                  >
                    メンターに質問する
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
