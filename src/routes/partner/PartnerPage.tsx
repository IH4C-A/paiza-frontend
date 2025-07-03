import React, { useState } from "react";
import styles from "./PartnerPage.module.css";
import { usePlant } from "../../hooks/usePlant";
import { plantTypes, personalities } from "../../types/plantType";
import { FaCalendar, FaChevronCircleRight, FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa";
import { useMentorshipSchedules } from "../../hooks/useMentorSchedule";
import type { MentorSchedule } from "../../types/mentorSchedule";
import { useNavigate } from "react-router-dom";
import { useSubmissions } from "../../hooks/useRunSubmission";
import { fetchPlantResponse } from "../../hooks/useSpeerch";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

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
  const [isListening, setIsListening] = useState(false);
  // const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const { schedules } = useMentorshipSchedules();
  const { submissions } = useSubmissions(plant?.user_id ?? "");
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =useSpeechRecognition();

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const planttype = plantTypes.find(
      (type) => type.id === plant?.growth_stage
  );
  const personalitieType = personalities.find(
      (type) => type.id === plant?.mood
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log(audioChunks,audioURL)

  if (!browserSupportsSpeechRecognition) {
    return <div>ブラウザが音声認識をサポートしていません。</div>;
  }
  const handleListen = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      mediaRecorder?.stop();
      setIsListening(false);
    } else {
      resetTranscript();
      setAudioChunks([]);
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        const chunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          setAudioChunks(chunks);
          setAudioURL(URL.createObjectURL(blob));
          fetchPlantResponse(transcript, planttype?.speaker ?? 0, personalitieType?.description ?? "");
        };

        recorder.start();
      });
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
                    {submissions.map((item) => (
                      <div
                        key={item.submission_id}
                        className={styles.progressItem}
                      >
                        <div className={styles.statLabelContainer}>
                          <span className={styles.statLabel}>
                            {item?.language}
                          </span>
                          <span className={styles.statValue}>
                            {item?.passed === true ? (
                              <p>正解</p>
                            ) : (
                              <p>不正解</p>
                            )}
                          </span>
                        </div>
                        {item?.problem?.problem_title}
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
                      <div key={topic} className={styles.calendarItem}>
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
                <div className={styles.callContainer}>
                  <div className={styles.callHeader}>
                    {getPlantPreview()}
                    <div>
                      <h2 className={styles.callName}>{plant?.plant_name}</h2>
                      <p className={styles.callStatus}>通話中 • 音声のみ</p>
                    </div>
                  </div>

                  <div className={styles.waveformArea}>
                    <p>🎙️ あなたの声を聞いています...</p>
                    {/* ※ 再生アニメーション・波形などをここに表示可能 */}
                  </div>

                  <div className={styles.callControls}>
                    <button
                      className={styles.controlButton}
                      onClick={handleListen}
                    >
                      {isListening ? <FaMicrophone /> : <FaMicrophoneAltSlash />}
                    </button>
                    <button
                      className={styles.controlButton}
                      onClick={() => {
                        SpeechRecognition.stopListening();
                        mediaRecorder?.stop();
                        setIsListening(false);
                      }}
                    >
                      ❌ 通話終了
                    </button>
                  </div>
                  <div className={styles.transcriptArea}>
                    <p className={styles.transcriptLabel}>📝 認識結果：</p>
                    <p className={styles.transcript}>
                      {transcript || "（まだ話していません）"}
                    </p>
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
