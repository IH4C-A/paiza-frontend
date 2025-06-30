import React, { useState, useEffect, useRef } from "react";
import styles from "./PartnerPage.module.css";
import { usePlant } from "../../hooks/usePlant";
import { plantTypes, personalities } from "../../types/plantType";
import { FaCalendar, FaChevronCircleRight } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { useMentorshipSchedules } from "../../hooks/useMentorSchedule";
import type { MentorSchedule } from "../../types/mentorSchedule";
import { useNavigate } from "react-router-dom";

// --- インターフェース定義 ---
interface Message {
  text: string;
  sender: "user" | "plant";
  time: string;
}

interface LearningProgressItem {
  subject: string;
  percentage: number;
}

// --- カスタムコンポーネント (Shadcn UIのProgress代替) ---
const CustomProgressBar: React.FC<{ value: number; barClassName?: string }> = ({
  value,
  barClassName,
}) => {
  return (
    <div className={styles.progressBarContainer}>
      <div
        className={`${styles.progressBarFill} ${barClassName || ""}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
};

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

// --- メインコンポーネント ---
export default function PartnerPage() {
  const { plant } = usePlant();
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "おはよう！今日も一緒に頑張ろうね！",
      sender: "plant",
      time: "9:00",
    },
    { text: "今日はどんな勉強をする予定？", sender: "plant", time: "9:01" },
    {
      text: "Reactのコンポーネント設計について勉強したいと思ってるよ",
      sender: "user",
      time: "9:05",
    },
    {
      text: "いいね！Reactは楽しいよ。わからないことがあったら、いつでも質問してね！",
      sender: "plant",
      time: "9:06",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const { schedules } = useMentorshipSchedules();
  const navigate = useNavigate();

  const learningProgressData: LearningProgressItem[] = [
    { subject: "アルゴリズム", percentage: 65 },
    { subject: "Webフレームワーク", percentage: 40 },
    { subject: "UI/UX", percentage: 25 },
    { subject: "情報処理試験", percentage: 10 },
  ];

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: "user",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setNewMessage("");
      setTimeout(() => {
        const responses = [
          "その調子！頑張ってるね！",
          "素晴らしい進捗だね！",
          "何か困ったことはある？",
          "今日の学習目標は達成できそう？",
          "休憩も大切だよ！無理しないでね。",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [
          ...prev,
          {
            text: randomResponse,
            sender: "plant",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 1000);
    }
  };

  const handleSaveCustomization = () => {
    alert(`カスタマイズ情報`);
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
  const progressData = groupThisWeekSchedules(schedules);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <div>
              <h1 className={styles.titleTextH1}>うちのコ (パートナー)</h1>
              <p className={styles.titleTextP}>
                あなたのパートナーと一緒に成長しましょう
              </p>
            </div>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.leftColumn}>
              {/* Profile Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>プロフィール</h2>
                  <p className={styles.cardDescription}>
                    あなたのパートナー情報
                  </p>
                </div>
                <div
                  className={`${styles.cardContent} ${styles.profileCardContent}`}
                >
                  <div className={styles.plantVisualContainer}>
                    {getPlantPreview()}
                  </div>
                  <h3 className={styles.partnerName}>{plant?.plant_name}</h3>
                  <p className={styles.partnerLevel}>
                    レベル:{plant?.growth_milestones.level}
                  </p>
                  <div className={styles.statRowContainer}>
                    <div className={styles.statRowInner}>
                      <div className={styles.statLabelContainer}>
                        <span className={styles.statLabel}>成長度</span>
                        <span className={styles.statValue}>
                          {plant?.growth_milestones.milestone}%
                        </span>
                      </div>
                      <CustomProgressBar
                        value={plant?.growth_milestones?.milestone ?? 0}
                      />
                    </div>
                  </div>
                  <div
                    className={styles.statRowContainer}
                    style={{ marginTop: "1rem" }}
                  >
                    <div className={styles.statRowInner}>
                      <div className={styles.statLabelContainer}>
                        <span className={styles.statLabel}>性格</span>
                        <span className={styles.statValue}>
                          {personalities.find((p) => p.id === plant?.mood)
                            ?.name || "性格未設定"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Status Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>学習状況</h2>
                  <p className={styles.cardDescription}>今週の学習状況</p>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.learningStatusGrid}>
                    {learningProgressData.map((item) => (
                      <div key={item.subject} className={styles.progressItem}>
                        <div className={styles.statLabelContainer}>
                          <span className={styles.statLabel}>
                            {item.subject}
                          </span>
                          <span className={styles.statValue}>
                            {item.percentage}%
                          </span>
                        </div>
                        <CustomProgressBar value={item.percentage} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Calendar Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>学習カレンダー</h2>
                  <p className={styles.cardDescription}>今週の学習予定</p>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.calendarList}>
                    {Object.entries(progressData).map(([topic, count]) => (
                      <div
                        key={topic}
                        className={styles.calendarItem}
                      >
                        <div className={styles.calendarIconContainer}>
                          {/* public/icons/calendar.svg を配置してください */}
                          <FaCalendar />
                        </div>
                        <div>
                          <h3 className={styles.calendarItemTextH3}>{topic}</h3>
                          <p className={styles.calendarItemTextP}>
                            {count.start_time}
                          </p>
                        </div>
                        <button
                          className={`${styles.iconButton} ${styles.calendarItemButton}`}
                          onClick={() => {
                            navigate(`/mentor/schedule/${count.schedule_id}`);
                          }}
                        >
                          {/* public/icons/chevron-right.svg を配置してください */}
                          <FaChevronCircleRight />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Tabs */}
            <div>
              <div className={styles.tabsList}>
                <button
                  className={`${styles.tabTrigger} ${
                    activeTab === "chat" ? styles.tabTriggerActive : ""
                  }`}
                  onClick={() => setActiveTab("chat")}
                >
                  チャット
                </button>
                <button
                  className={`${styles.tabTrigger} ${
                    activeTab === "growth" ? styles.tabTriggerActive : ""
                  }`}
                  onClick={() => setActiveTab("growth")}
                >
                  成長記録
                </button>
                <button
                  className={`${styles.tabTrigger} ${
                    activeTab === "customize" ? styles.tabTriggerActive : ""
                  }`}
                  onClick={() => setActiveTab("customize")}
                >
                  カスタマイズ
                </button>
              </div>

              {activeTab === "chat" && (
                <div className={styles.tabContent}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>
                        {plant?.plant_name}とチャット
                      </h2>
                      <p className={styles.cardDescription}>
                        あなたのパートナーと会話しましょう
                      </p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.chatArea} ref={chatAreaRef}>
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`${styles.messageRow} ${
                              message.sender === "user"
                                ? styles.messageRowUser
                                : styles.messageRowPlant
                            }`}
                          >
                            <div
                              className={`${styles.messageBubble} ${
                                message.sender === "user"
                                  ? styles.messageBubbleUser
                                  : styles.messageBubblePlant
                              }`}
                            >
                              <p>{message.text}</p>
                              <p
                                className={`${styles.messageTime} ${
                                  message.sender === "user"
                                    ? styles.messageTimeUser
                                    : styles.messageTimePlant
                                }`}
                              >
                                {message.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.chatInputContainer}>
                        <input
                          type="text"
                          placeholder="メッセージを入力..."
                          className={styles.chatInput}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                        />
                        <button
                          onClick={handleSendMessage}
                          className={`${styles.iconButton} ${styles.sendButton}`}
                        >
                          {/* public/icons/message-square.svg を配置してください */}
                          <FaMessage />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "growth" && (
                <div className={styles.tabContent}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>成長記録</h2>
                      <p className={styles.cardDescription}>
                        あなたのパートナーの成長履歴
                      </p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.calendarList}>
                        {plant?.growth_milestones.logs.map((milestone) => (
                          <div
                            key={milestone.log_id}
                            className={styles.calendarItem}
                          >
                            <div className={styles.growthRecordIconContainer}>
                              <div className={styles.growthPlantIcon}></div>
                            </div>
                            <div>
                              <h3 className={styles.calendarItemTextH3}>
                                {milestone.log_message}
                              </h3>
                              <p className={styles.calendarItemTextP}>
                                {milestone.created_at}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "customize" && (
                <div className={styles.tabContent}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>カスタマイズ</h2>
                      <p className={styles.cardDescription}>
                        あなたのパートナーをカスタマイズ
                      </p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.formSection}>
                        <div className={styles.formField}>
                          <label
                            htmlFor="partnerName-input"
                            className={styles.formLabel}
                          >
                            名前
                          </label>
                          <input
                            id="partnerName-input"
                            className={styles.formInput}
                            value={plant?.plant_name}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label
                            htmlFor="partnerLevel-input"
                            className={styles.formLabel}
                          >
                            レベル
                          </label>
                          <input
                            type="number"
                            id="partnerLevel-input"
                            className={styles.formInput}
                            value={4}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label
                            htmlFor="partnerGrowth-input"
                            className={styles.formLabel}
                          >
                            成長度 (%)
                          </label>
                          <input
                            type="number"
                            id="partnerGrowth-input"
                            className={styles.formInput}
                            max="100"
                            min="0"
                          />
                        </div>
                        <div className={styles.formField}>
                          <label
                            htmlFor="partnerPersonality-select"
                            className={styles.formLabel}
                          >
                            性格
                          </label>
                          <select
                            id="partnerPersonality-select"
                            className={styles.formSelect}
                            value={plant?.mood}
                          >
                            <option value="励まし屋">励まし屋</option>
                            <option value="冷静沈着">冷静沈着</option>
                            <option value="情熱的">情熱的</option>
                            <option value="優しい">優しい</option>
                            <option value="厳しい">厳しい</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardFooter}>
                      <button
                        onClick={handleSaveCustomization}
                        className={styles.formButton}
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
