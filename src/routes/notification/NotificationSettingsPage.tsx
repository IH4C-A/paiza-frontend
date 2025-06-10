import React, { useState } from "react";
import styles from "./NotificationSettingsPage.module.css";

// Inline SVG Icon Components
const ArrowLeftIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const BellIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
const ClockIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const MailIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);
const MessageSquareIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const SmartphoneIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

interface Settings {
  mentorReply: boolean;
  groupMention: boolean;
  questionAnswer: boolean;
  achievement: boolean;
  uchinoKo: boolean;
  system: boolean;
  courseUpdate: boolean;
  mentorRating: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
  frequency: string;
  [key: string]: boolean | string; // Index signature
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    mentorReply: true,
    groupMention: true,
    questionAnswer: true,
    achievement: true,
    uchinoKo: true,
    system: false,
    courseUpdate: true,
    mentorRating: false,
    emailNotifications: true,
    pushNotifications: true,
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00",
    frequency: "immediate",
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const notificationTypes = [
    {
      key: "mentorReply",
      title: "メンターからの返信",
      description: "個別チャットでメンターから返信があった時",
      icon: <MessageSquareIcon className={`${styles.iconBase} ${styles.iconBlue}`} />,
    },
    {
      key: "groupMention",
      title: "グループチャットでのメンション",
      description: "グループチャットであなたがメンションされた時",
      icon: <MessageSquareIcon className={`${styles.iconBase} ${styles.iconPurple}`} />,
    },
    {
      key: "questionAnswer",
      title: "質問への回答",
      description: "あなたの質問に新しい回答が投稿された時",
      icon: <MessageSquareIcon className={`${styles.iconBase} ${styles.iconGreen}`} />,
    },
    {
      key: "achievement",
      title: "学習達成",
      description: "講座完了やレベルアップなどの達成時",
      icon: <BellIcon className={`${styles.iconBase} ${styles.iconYellow}`} />,
    },
    {
      key: "uchinoKo",
      title: "うちのコからのメッセージ",
      description: "パートナーからの励ましやレベルアップ通知",
      icon: <BellIcon className={`${styles.iconBase} ${styles.iconPink}`} />,
    },
    {
      key: "system",
      title: "システムお知らせ",
      description: "メンテナンス情報や重要なお知らせ",
      icon: <BellIcon className={`${styles.iconBase} ${styles.iconGray}`} />,
    },
    {
      key: "courseUpdate",
      title: "講座更新",
      description: "受講中の講座に新しいコンテンツが追加された時",
      icon: <BellIcon className={`${styles.iconBase} ${styles.iconIndigo}`} />,
    },
    {
      key: "mentorRating",
      title: "メンター評価のお願い",
      description: "チャット終了後の評価依頼",
      icon: <BellIcon className={`${styles.iconBase} ${styles.iconOrange}`} />,
    },
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  return (
    <div className={styles.pageWrapper}>

      <main className={styles.mainContent}>
        <div className={styles.mainContainer}>
          <div className={styles.breadcrumbs}>
            <a href="/notifications" className={styles.breadcrumbLink}>通知</a>
            <span>/</span>
            <span>設定</span>
          </div>

          <div className={styles.pageTitleSection}>
            <a href="/notifications" className={`${styles.button} ${styles.buttonVariantGhost} ${styles.buttonSizeIcon}`} aria-label="戻る">
              <ArrowLeftIcon className={styles.iconArrow} />
              <span className={styles.srOnly}>戻る</span>
            </a>
            <div>
              <h1 className={styles.pageTitle}>通知設定</h1>
              <p className={styles.pageSubtitle}>受け取りたい通知の種類と方法を設定できます</p>
            </div>
          </div>

          <div className={styles.settingsGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>通知の種類</h2>
                <p className={styles.cardDescription}>受け取りたい通知の種類を選択してください</p>
              </div>
              <div className={`${styles.cardContent} ${styles.spaceY6}`}>
                {notificationTypes.map((type) => (
                  <div key={type.key} className={styles.settingItem}>
                    <div className={styles.settingItemInfo}>
                      {type.icon}
                      <div className={styles.settingItemTextContainer}>
                        <label htmlFor={type.key} className={styles.label}>
                          {type.title}
                        </label>
                        <p className={styles.labelTextMuted}>{type.description}</p>
                      </div>
                    </div>
                    <label htmlFor={type.key} className={styles.switchContainer}>
                      <input
                        type="checkbox"
                        id={type.key}
                        className={styles.switchInput}
                        checked={settings[type.key] as boolean}
                        onChange={(e) => updateSetting(type.key, e.target.checked)}
                      />
                      <span className={styles.switchSlider}></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>通知方法</h2>
                <p className={styles.cardDescription}>通知を受け取る方法を選択してください</p>
              </div>
              <div className={`${styles.cardContent} ${styles.spaceY6}`}>
                <div className={styles.settingItem}>
                  <div className={styles.settingItemInfo}>
                    <MailIcon className={`${styles.iconBase} ${styles.iconBlue}`} />
                    <div className={styles.settingItemTextContainer}>
                      <label htmlFor="emailNotifications" className={styles.label}>メール通知</label>
                      <p className={styles.labelTextMuted}>重要な通知をメールで受け取る</p>
                    </div>
                  </div>
                  <label htmlFor="emailNotifications" className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      className={styles.switchInput}
                      checked={settings.emailNotifications}
                      onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>
                <div className={styles.settingItem}>
                  <div className={styles.settingItemInfo}>
                    <SmartphoneIcon className={`${styles.iconBase} ${styles.iconGreen}`} />
                    <div className={styles.settingItemTextContainer}>
                      <label htmlFor="pushNotifications" className={styles.label}>プッシュ通知</label>
                      <p className={styles.labelTextMuted}>ブラウザでプッシュ通知を受け取る</p>
                    </div>
                  </div>
                   <label htmlFor="pushNotifications" className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      id="pushNotifications"
                      className={styles.switchInput}
                      checked={settings.pushNotifications}
                      onChange={(e) => updateSetting("pushNotifications", e.target.checked)}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>通知頻度</h2>
                <p className={styles.cardDescription}>通知を受け取る頻度を設定してください</p>
              </div>
              <div className={`${styles.cardContent} ${styles.spaceY4}`}>
                <div className={styles.spaceY2}>
                  <label htmlFor="frequency" className={styles.label}>通知頻度</label>
                  <div className={styles.selectContainer}>
                    <select
                      id="frequency"
                      className={styles.selectElement}
                      value={settings.frequency}
                      onChange={(e) => updateSetting("frequency", e.target.value)}
                    >
                      <option value="immediate">即座に通知</option>
                      <option value="hourly">1時間ごとにまとめて</option>
                      <option value="daily">1日1回まとめて</option>
                      <option value="weekly">週1回まとめて</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>サイレント時間</h2>
                <p className={styles.cardDescription}>通知を受け取らない時間帯を設定できます</p>
              </div>
              <div className={`${styles.cardContent} ${styles.spaceY4}`}>
                <div className={styles.settingItem}>
                  <div className={styles.settingItemInfo}>
                    <ClockIcon className={`${styles.iconBase} ${styles.iconPurple}`} />
                    <div className={styles.settingItemTextContainer}>
                      <label htmlFor="quietHours" className={styles.label}>サイレント時間を有効にする</label>
                      <p className={styles.labelTextMuted}>指定した時間帯は通知を受け取りません</p>
                    </div>
                  </div>
                  <label htmlFor="quietHours" className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      id="quietHours"
                      className={styles.switchInput}
                      checked={settings.quietHours}
                      onChange={(e) => updateSetting("quietHours", e.target.checked)}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>
                {settings.quietHours && (
                  <div className={styles.quietHoursGrid}>
                    <div className={styles.spaceY2}>
                      <label htmlFor="quietStart" className={styles.label}>開始時刻</label>
                       <div className={styles.selectContainer}>
                        <select
                          id="quietStart"
                          className={styles.selectElement}
                          value={settings.quietStart}
                          onChange={(e) => updateSetting("quietStart", e.target.value)}
                        >
                          {timeOptions.map(option => (
                            <option key={`start-${option.value}`} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={styles.spaceY2}>
                      <label htmlFor="quietEnd" className={styles.label}>終了時刻</label>
                      <div className={styles.selectContainer}>
                        <select
                          id="quietEnd"
                          className={styles.selectElement}
                          value={settings.quietEnd}
                          onChange={(e) => updateSetting("quietEnd", e.target.value)}
                        >
                          {timeOptions.map(option => (
                            <option key={`end-${option.value}`} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.actionsFooter}>
              <a href="/notifications" className={`${styles.button} ${styles.buttonVariantOutline}`}>キャンセル</a>
              <button type="button" className={styles.button} onClick={() => console.log("Settings saved:", settings)}>
                設定を保存
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}