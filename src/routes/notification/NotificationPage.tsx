import React, { useState, useEffect, useRef } from "react";
// import { ... } from "lucide-react"; // lucide-react のインポートを削除

import styles from "./NotificationPage.module.css";

// SVG Icon Components (Inline)
const BellIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const BellOffIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M8.56 2.9A7 7 0 0 1 18 8v4c0 .55.45 1 1 1s1-.45 1-1V8c0-5.52-4.48-10-10-10-.94 0-1.84.13-2.69.38"/>
    <path d="M2 2l20 20"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    <path d="M18 13v-1"/>
    <path d="M3 9h.17M3 9c0-1.1.1-2.14.33-3.12L3 4s0 2 0 5"/><path d="M4.28 4.28A10 10 0 0 0 3 8v1c0 7 3 9 3 9h10.26"/>
  </svg>
);

const CheckIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CheckCheckIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);

const FilterIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const MessageSquareIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SettingsIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const StarIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Trash2Icon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const UserIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UsersIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BookOpenIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const TrophyIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const HeartIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {/* For a filled heart, you would use fill="currentColor" and a different path. This is Lucide's outline heart. */}
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);


interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  detail: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  avatar: string | null;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "mentor_reply",
      title: "メンターからの返信",
      message: "田中さんがあなたの質問に回答しました",
      detail: "useEffectの依存配列について詳しく説明しました。",
      timestamp: "2分前",
      isRead: false,
      priority: "high",
      avatar: "/placeholder.svg?height=40&width=40", 
      actionUrl: "/mentors/chat/1",
    },
    {
      id: "2",
      type: "group_mention",
      title: "グループチャットでメンション",
      message: "React初心者の会であなたがメンションされました",
      detail: "@あなた この問題についてどう思いますか？",
      timestamp: "15分前",
      isRead: false,
      priority: "medium",
      avatar: "/placeholder.svg?height=40&width=40",
      actionUrl: "/mentors/groups/1",
    },
    {
      id: "3",
      type: "Youtube",
      title: "質問への回答",
      message: "あなたの質問に新しい回答が投稿されました",
      detail: "「Reactのuseeffectで無限ループが発生する原因について」に回答がありました。",
      timestamp: "1時間前",
      isRead: true,
      priority: "medium",
      avatar: "/placeholder.svg?height=40&width=40",
      actionUrl: "/questions/1",
    },
    {
      id: "4",
      type: "achievement",
      title: "学習達成",
      message: "React基礎講座を完了しました！",
      detail: "おめでとうございます！次は中級講座に挑戦してみましょう。",
      timestamp: "3時間前",
      isRead: true,
      priority: "low",
      avatar: null,
      actionUrl: "/learning/react-basics",
    },
    {
      id: "5",
      type: "uchino_ko",
      title: "うちのコからのメッセージ",
      message: "モリモリがレベルアップしました！",
      detail: "今日の学習お疲れ様！一緒に成長できて嬉しいよ♪",
      timestamp: "5時間前",
      isRead: false,
      priority: "low",
      avatar: null,
      actionUrl: "/uchino-ko",
    },
    {
      id: "6",
      type: "system",
      title: "システムお知らせ",
      message: "新しい問題が追加されました",
      detail: "UI/UXカテゴリに「アクセシビリティ対応」の問題が追加されました。",
      timestamp: "1日前",
      isRead: true,
      priority: "low",
      avatar: null,
      actionUrl: "/problems",
    },
    {
      id: "7",
      type: "course_update",
      title: "講座更新",
      message: "受講中の講座が更新されました",
      detail: "「データ構造とアルゴリズム」に新しいレッスンが追加されました。",
      timestamp: "2日前",
      isRead: true,
      priority: "medium",
      avatar: null,
      actionUrl: "/learning/data-structures",
    },
    {
      id: "8",
      type: "mentor_rating",
      title: "メンター評価のお願い",
      message: "田中さんとのチャットの評価をお願いします",
      detail: "より良いサービス提供のため、メンターの評価にご協力ください。",
      timestamp: "3日前",
      isRead: false,
      priority: "low",
      avatar: "/placeholder.svg?height=40&width=40",
      actionUrl: "/mentors/chat/1",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState<string | null>(null);

  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const notificationMenuRefs = useRef<{ [key: string]: HTMLDivElement }>({});


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
      Object.keys(notificationMenuRefs.current).forEach(key => {
        if (notificationMenuRefs.current[key] && !notificationMenuRefs.current[key].contains(event.target as Node)) {
          if (notificationMenuOpen === key) {
            setNotificationMenuOpen(null);
          }
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationMenuOpen]);


  const getNotificationIcon = (type: string) => {
    const iconClassName = `${styles.iconBase}`; // Base class for size
    switch (type) {
      case "mentor_reply":
        return <MessageSquareIcon className={`${iconClassName} ${styles.iconBlue}`} />;
      case "group_mention":
        return <UsersIcon className={`${iconClassName} ${styles.iconPurple}`} />;
      case "Youtube":
        return <MessageSquareIcon className={`${iconClassName} ${styles.iconGreen}`} />;
      case "achievement":
        return <TrophyIcon className={`${iconClassName} ${styles.iconYellow}`} />;
      case "uchino_ko":
        return <HeartIcon className={`${iconClassName} ${styles.iconPink}`} />;
      case "system":
        return <BellIcon className={`${iconClassName} ${styles.iconGray}`} />;
      case "course_update":
        return <BookOpenIcon className={`${iconClassName} ${styles.iconIndigo}`} />;
      case "mentor_rating":
        return <StarIcon className={`${iconClassName} ${styles.iconOrange}`} />;
      default:
        return <BellIcon className={`${iconClassName} ${styles.iconGray}`} />;
    }
  };

  const getPriorityClass = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return styles.priorityLow;
    }
  };
  
  const toggleReadStatus = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
      )
    );
    setNotificationMenuOpen(null);
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    setNotificationMenuOpen(null);
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;
  const unreadNotifications = notifications.filter((notif) => !notif.isRead);
  const readNotifications = notifications.filter((notif) => notif.isRead);

  const displayedNotifications = () => {
    switch (activeTab) {
      case "unread":
        return unreadNotifications;
      case "read":
        return readNotifications;
      case "all":
      default:
        return notifications;
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <div
      key={notification.id}
      className={`${styles.card} ${getPriorityClass(notification.priority)} ${
        !notification.isRead ? styles.cardUnreadBg : ""
      }`}
    >
      <div className={styles.cardContent}>
        <div className={styles.notificationItem}>
          <div className={styles.notificationAvatarContainer}>
            {notification.avatar ? (
              <div className={styles.avatar}>
                <img
                  src={notification.avatar || "/placeholder.svg"} 
                  alt="Avatar"
                  className={styles.avatarImage}
                />
              </div>
            ) : (
              <div className={styles.iconContainer}>
                {getNotificationIcon(notification.type)}
              </div>
            )}
          </div>
          <div className={styles.notificationContent}>
            <div className={styles.notificationHeader}>
              <div className={styles.notificationTitleArea}>
                <div className={styles.notificationTitleInner}>
                  <h3 className={styles.notificationTitle}>
                    {notification.title}
                  </h3>
                  {!notification.isRead && (
                    <div className={styles.notificationUnreadDot} />
                  )}
                </div>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
                <p className={styles.notificationDetail}>
                  {notification.detail}
                </p>
              </div>
              <div className={styles.notificationMeta}>
                <span className={styles.notificationTimestamp}>
                  {notification.timestamp}
                </span>
                <div className={styles.dropdown} ref={el => { if (el) notificationMenuRefs.current[notification.id] = el; }}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonVariantGhost} ${styles.buttonSizeIconSmall}`}
                    onClick={() => setNotificationMenuOpen(notificationMenuOpen === notification.id ? null : notification.id)}
                  >
                    <span className={styles.srOnly}>メニュー</span>
                    <div className={styles.menuButtonDotsContainer}>
                        <div className={styles.menuButtonDot}></div>
                        <div className={styles.menuButtonDot}></div>
                        <div className={styles.menuButtonDot}></div>
                    </div>
                  </button>
                  {notificationMenuOpen === notification.id && (
                    <div className={styles.dropdownContent}>
                      <button
                        type="button"
                        className={styles.dropdownItem}
                        onClick={() => toggleReadStatus(notification.id)}
                      >
                        {notification.isRead ? (
                          <BellOffIcon className={styles.dropdownItemIcon} />
                        ) : (
                          <CheckIcon className={styles.dropdownItemIcon} />
                        )}
                        {notification.isRead ? "未読にする" : "既読にする"}
                      </button>
                      <button
                        type="button"
                        className={styles.dropdownItem}
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2Icon className={styles.dropdownItemIcon} />
                        削除
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {notification.actionUrl && (
              <div className={styles.notificationAction}>
                <a
                  href={notification.actionUrl}
                  className={`${styles.button} ${styles.buttonVariantOutline} ${styles.buttonSizeSm}`}
                >
                  詳細を見る
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <a href="/" className={styles.logoLink}>
              <span className={styles.logoTextPrimary}>Paiza</span> Nurture
            </a>
            <nav className={styles.nav}>
              <a href="/problems" className={styles.navLink}>
                問題
              </a>
              <a href="/mentors" className={styles.navLink}>
                メンター
              </a>
              <a href="/questions" className={styles.navLink}>
                質問掲示板
              </a>
              <a href="/learning" className={styles.navLink}>
                学習
              </a>
              <a href="/ranking" className={styles.navLink}>
                ランキング
              </a>
            </nav>
          </div>
          <div className={styles.headerRight}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonVariantGhost} ${styles.buttonSizeIcon} ${styles.buttonRelative}`}
              aria-label="通知"
            >
              <BellIcon className={styles.iconBase} />
              {unreadCount > 0 && (
                <span className={styles.buttonIconIndicator} />
              )}
              <span className={styles.srOnly}>通知</span>
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonVariantGhost} ${styles.buttonSizeIcon}`}
              aria-label="プロフィール"
            >
              <UserIcon className={styles.iconBase} />
              <span className={styles.srOnly}>プロフィール</span>
            </button>
          </div>
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.mainContainer}>
          <div className={styles.titleSection}>
            <div>
              <h1 className={styles.titleHeading}>通知</h1>
              <p className={styles.titleSubheading}>
                {unreadCount > 0
                  ? `${unreadCount}件の未読通知があります`
                  : "すべての通知を確認済みです"}
              </p>
            </div>
            <div className={styles.actionsContainer}>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonVariantOutline}`}
                  onClick={markAllAsRead}
                >
                  <CheckCheckIcon
                    className={`${styles.buttonIconMargin}`} style={{height: "1rem", width: "1rem"}}
                  />
                  すべて既読
                </button>
              )}
              <div className={styles.dropdown} ref={filterDropdownRef}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonVariantOutline} ${styles.buttonSizeIcon}`}
                  aria-label="フィルター"
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                >
                  <FilterIcon style={{height: "1rem", width: "1rem"}}/>
                  <span className={styles.srOnly}>フィルター</span>
                </button>
                {filterDropdownOpen && (
                    <div className={styles.dropdownContent}>
                        <button type="button" className={styles.dropdownItem} onClick={() => { setFilterDropdownOpen(false); }}>すべて</button>
                        <button type="button" className={styles.dropdownItem} onClick={() => { setFilterDropdownOpen(false); }}>メンター関連</button>
                        <button type="button" className={styles.dropdownItem} onClick={() => { setFilterDropdownOpen(false); }}>学習関連</button>
                        <button type="button" className={styles.dropdownItem} onClick={() => { setFilterDropdownOpen(false); }}>システム</button>
                    </div>
                )}
              </div>
              <a
                href="/notifications/settings"
                className={`${styles.button} ${styles.buttonVariantOutline}`}
              >
                <SettingsIcon className={`${styles.buttonIconMargin}`} style={{height: "1rem", width: "1rem"}}/>
                設定
              </a>
            </div>
          </div>

          <div> {/* Tabs Container */}
            <div className={styles.tabsList}>
              <button
                type="button"
                className={`${styles.tabsTrigger} ${activeTab === "all" ? styles.tabsTriggerActive : ""}`}
                onClick={() => setActiveTab("all")}
              >
                すべて ({notifications.length})
              </button>
              <button
                type="button"
                className={`${styles.tabsTrigger} ${activeTab === "unread" ? styles.tabsTriggerActive : ""}`}
                onClick={() => setActiveTab("unread")}
              >
                未読 ({unreadCount})
              </button>
              <button
                type="button"
                className={`${styles.tabsTrigger} ${activeTab === "read" ? styles.tabsTriggerActive : ""}`}
                onClick={() => setActiveTab("read")}
              >
                既読 ({readNotifications.length})
              </button>
            </div>

            <div className={styles.tabsContent}>
              <div className={styles.spaceY2}>
                {displayedNotifications().map(renderNotificationCard)}
                {activeTab === "unread" && unreadNotifications.length === 0 && (
                  <div className={styles.emptyState}>
                    <CheckCheckIcon className={styles.emptyStateIcon} />
                    <h3 className={styles.emptyStateTitle}>未読通知はありません</h3>
                    <p className={styles.emptyStateMessage}>すべての通知を確認済みです</p>
                  </div>
                )}
                 {activeTab === "all" && notifications.length === 0 && (
                  <div className={styles.emptyState}>
                     <BellOffIcon className={styles.emptyStateIcon} />
                    <h3 className={styles.emptyStateTitle}>通知はありません</h3>
                    <p className={styles.emptyStateMessage}>新しい通知はまだありません。</p>
                  </div>
                )}
                 {activeTab === "read" && readNotifications.length === 0 && (
                  <div className={styles.emptyState}>
                     <BellOffIcon className={styles.emptyStateIcon} />
                    <h3 className={styles.emptyStateTitle}>既読通知はありません</h3>
                    <p className={styles.emptyStateMessage}>まだ既読にした通知はありません。</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}