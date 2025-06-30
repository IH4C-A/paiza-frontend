import { useState } from "react";
import styles from "./Mypage.module.css";
import { FaCode } from "react-icons/fa";
import { useCurrentUser } from "../../hooks/useUser";
import {
  usePlant,
  useMentorships,
  useCategories,
  useProblems,
  useProblemsByCategory,
} from "../../hooks";
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
  const grouped: Record<
    string,
    { count: number; schedule_id: string; start_time: string }
  > = {};

  schedules.forEach((s) => {
    const startTime = new Date(s.start_time);
    if (startTime >= start && startTime <= end) {
      const key = s.topic || "未分類";
      if (!grouped[key]) {
        grouped[key] = {
          count: 1,
          schedule_id: s.schedule_id,
          start_time: s.start_time,
        };
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
  const { categories } = useCategories();
  const progressData = groupThisWeekSchedules(schedules);
  const { problems } = useProblems();
  const categoriesToRender = currentUser?.categories || categories;
  const categoryId = activeTab === "all" ? "" : activeTab;
  const { problemcategory } = useProblemsByCategory(categoryId);
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
                  {categoriesToRender.map((cat) => (
                    <button
                      key={cat.category_id}
                      className={`${styles.tabsTrigger} ${
                        activeTab === cat.category_id ? styles.active : ""
                      }`}
                      onClick={() => setActiveTab(cat.category_id)}
                    >
                      {cat.category_name}
                    </button>
                  ))}
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
                          {problems.slice(0, 3).map((problem) => (
                            <div
                              key={problem.problem_id}
                              className={styles.problemItem}
                              onClick={() => navigate(`/skillcheck/${problem.problem_id}`)}
                                style={{cursor: "pointer"}}
                            >
                              <div className={styles.problemIcon}>
                                <FaCode className={styles.icon} />
                              </div>
                              <div className={styles.problemContent}>
                                <div className={styles.problemHeader}>
                                  <h4 className={styles.problemTitle}>
                                    {problem.problem_title}
                                  </h4>
                                  <span
                                    className={
                                      styles[
                                        `difficulty${problem.rank.rank_name?.charAt(
                                          0
                                        )}`
                                      ]
                                    }
                                  >
                                    {problem.rank.rank_name?.charAt(0)}
                                  </span>
                                </div>
                                <p className={styles.problemDescription}>
                                  {problem.problem_text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={styles.cardFooter}>
                        <button
                          className={styles.primaryButton}
                          onClick={() => navigate("/skillcheck")}
                        >
                          すべての問題を見る
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {problemcategory.slice(0, 3).map((cat) => {
                  return (
                    <TabsContent
                      value={cat.category.category_id}
                      key={cat.category.category_id}
                    >
                      <div className={styles.cardGrid}>
                        <div className={styles.card}>
                          <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                              {cat.category.category_name}問題
                            </h3>
                            <p className={styles.cardDescription}>
                              {cat.rank.rank_name}問題です
                            </p>
                          </div>
                          <div className={styles.cardContent}>
                            <div className={styles.problemList}>
                              <div
                                key={cat.problem_id}
                                className={styles.problemItem}
                                onClick={() => navigate(`/skillcheck/${cat.problem_id}`)}
                                style={{cursor: "pointer"}}
                              >
                                <div className={styles.problemIcon}>
                                  <FaCode className={styles.icon} />
                                </div>
                                <div className={styles.problemContent}>
                                  <div className={styles.problemHeader}>
                                    <h4 className={styles.problemTitle}>
                                      {cat.problem_title}
                                    </h4>
                                    <span
                                      className={
                                        styles[
                                          `difficulty${cat.rank.rank_name?.charAt(
                                            0
                                          )}`
                                        ]
                                      }
                                    >
                                      {cat.rank.rank_name?.charAt(0)}
                                    </span>
                                  </div>
                                  <p className={styles.problemDescription}>
                                    {cat.problem_text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>スケジュール予定</h3>
                    <p className={styles.cardDescription}>
                      今週のスケジュール予定
                    </p>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.progressList}>
                      {Object.entries(progressData).map(([topic, count]) => {
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
                      })}
                    </div>
                  </div>
                </div>
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
