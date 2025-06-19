import React, { useState, useEffect, useRef } from "react";
// import { ... } from "lucide-react"; // lucide-react のインポートを削除

import styles from "./NotificationPage.module.css";
import { useNotifications } from "../../hooks";
import type { Notification } from "../../types/notificationType";
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


export default function NotificationsPage() {
  const [notification, setNotifications] = useState<Notification[]>([]);
  const { notifications } = useNotifications();
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
        notif.notification_id === id ? { ...notif, isRead: !notif.is_read } : notif
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
    setNotifications(notifications.filter((notif) => notif.notification_id !== id));
    setNotificationMenuOpen(null);
  };

  const unreadCount = notifications.filter((notif) => !notif.is_read).length;
  const unreadNotifications = notifications.filter((notif) => !notif.is_read);
  const readNotifications = notifications.filter((notif) => notif.is_read);

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
      key={notification.notification_id}
      className={`${styles.card} ${getPriorityClass(notification.priority)} ${
        !notification.is_read ? styles.cardUnreadBg : ""
      }`}
    >
      <div className={styles.cardContent}>
        <div className={styles.notificationItem}>
          <div className={styles.notificationAvatarContainer}>
            {notification.user_id.profile_image ? (
              <div className={styles.avatar}>
                <img
                  src={notification.user_id.profile_image || "/placeholder.svg"} 
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
                  {!notification.is_read && (
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
                  {notification.created_at instanceof Date
                    ? notification.created_at.toLocaleString()
                    : notification.created_at}
                </span>
                <div className={styles.dropdown} ref={el => { if (el) notificationMenuRefs.current[notification.notification_id] = el; }}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonVariantGhost} ${styles.buttonSizeIconSmall}`}
                    onClick={() => setNotificationMenuOpen(notificationMenuOpen === notification.notification_id ? null : notification.notification_id)}
                  >
                    <span className={styles.srOnly}>メニュー</span>
                    <div className={styles.menuButtonDotsContainer}>
                        <div className={styles.menuButtonDot}></div>
                        <div className={styles.menuButtonDot}></div>
                        <div className={styles.menuButtonDot}></div>
                    </div>
                  </button>
                  {notificationMenuOpen === notification.notification_id && (
                    <div className={styles.dropdownContent}>
                      <button
                        type="button"
                        className={styles.dropdownItem}
                        onClick={() => toggleReadStatus(notification.notification_id)}
                      >
                        {notification.is_read ? (
                          <BellOffIcon className={styles.dropdownItemIcon} />
                        ) : (
                          <CheckIcon className={styles.dropdownItemIcon} />
                        )}
                        {notification.is_read ? "未読にする" : "既読にする"}
                      </button>
                      <button
                        type="button"
                        className={styles.dropdownItem}
                        onClick={() => deleteNotification(notification.notification_id)}
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
                すべて ({notification.length})
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