import { useState } from "react";
import styles from "./Mypage.module.css";
import { FaCode } from "react-icons/fa";
import { FiCode } from "react-icons/fi";
import { useCurrentUser } from "../../hooks/useUser";

export default function Mypage() {
  const [activeTab, setActiveTab] = useState("all");
  const { currentUser } = useCurrentUser();

  const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({
    value,
    children,
  }) => {
    return activeTab === value ? (
      <div className={styles.tabsContent}>{children}</div>
    ) : null;
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            <div className={styles.dashboardHeader}>
              <h1 className={styles.title}>{currentUser?.first_name} さん</h1>
              <div className={styles.rank}>
                <span className={styles.rankText}>ランク: B</span>
                <div className={styles.rankBadge}>B</div>
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
                      <h3 className={styles.cardTitle}>学習の進捗</h3>
                      <p className={styles.cardDescription}>今週の学習状況</p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.progressList}>
                        <div className={styles.progressItem}>
                          <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>
                              アルゴリズム
                            </span>
                            <span className={styles.progressValue}>65%</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: "65%" }}
                            />
                          </div>
                        </div>
                        <div className={styles.progressItem}>
                          <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>
                              Webフレームワーク
                            </span>
                            <span className={styles.progressValue}>40%</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: "40%" }}
                            />
                          </div>
                        </div>
                        <div className={styles.progressItem}>
                          <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>UI/UX</span>
                            <span className={styles.progressValue}>25%</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: "25%" }}
                            />
                          </div>
                        </div>
                        <div className={styles.progressItem}>
                          <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>
                              情報処理試験
                            </span>
                            <span className={styles.progressValue}>10%</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: "10%" }}
                            />
                          </div>
                        </div>
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
                    <h3 className={styles.cardTitle}>Webフレームワーク問題</h3>
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
                  <div className={styles.petVisual}>
                    <div className={styles.petBase}></div>
                    <div className={styles.petBody}></div>
                    <div className={styles.petHead}></div>
                  </div>
                  <h4 className={styles.petName}>モリモリ</h4>
                  <p className={styles.petLevel}>レベル: 5</p>
                  <div className={styles.progressItem}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressLabel}>成長度</span>
                      <span className={styles.progressValue}>45%</span>
                    </div>
                    <div
                      className={`${styles.progressBar} ${styles.petProgress}`}
                    >
                      <div
                        className={styles.progressFill}
                        style={{ width: "45%" }}
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
                <button className={styles.outlineButton}>うちのコと話す</button>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>メンターシステム</h3>
                <p className={styles.cardDescription}>質問や相談ができます</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.mentorList}>
                  <div className={styles.mentorItem}>
                    <div className={styles.mentorAvatar}>
                      <div className={`${styles.mentorBadge} ${styles.rankS}`}>
                        S
                      </div>
                    </div>
                    <div className={styles.mentorInfo}>
                      <h4 className={styles.mentorName}>田中さん</h4>
                      <p className={styles.mentorSpecialty}>
                        アルゴリズム、React専門
                      </p>
                    </div>
                  </div>
                  <div className={styles.mentorItem}>
                    <div className={styles.mentorAvatar}>
                      <div className={`${styles.mentorBadge} ${styles.rankA}`}>
                        A
                      </div>
                    </div>
                    <div className={styles.mentorInfo}>
                      <h4 className={styles.mentorName}>佐藤さん</h4>
                      <p className={styles.mentorSpecialty}>
                        UI/UX、Vue.js専門
                      </p>
                    </div>
                  </div>
                  <div className={styles.mentorItem}>
                    <div className={styles.mentorAvatar}>
                      <div className={`${styles.mentorBadge} ${styles.rankA}`}>
                        A
                      </div>
                    </div>
                    <div className={styles.mentorInfo}>
                      <h4 className={styles.mentorName}>鈴木さん</h4>
                      <p className={styles.mentorSpecialty}>
                        情報処理試験、DB専門
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.primaryButton}>
                  メンターに質問する
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
