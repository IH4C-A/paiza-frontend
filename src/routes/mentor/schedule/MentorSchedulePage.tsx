import React, { useState, useMemo, useRef, useEffect } from "react"; // ★★★ 'React' をインポート
import { Link } from "react-router-dom"; // ★★★ 'useSearchParams' を削除
import styles from "./MentorSchedulePage.module.css";

// --- TypeScriptのインターフェース定義 ---
export interface Meeting {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorRank: "S" | "A";
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  description: string;
  status: "upcoming" | "completed" | "cancelled";
  meetingUrl: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  cancellationReason?: string;
}

export interface MeetingCardProps {
  meeting: Meeting;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  getStatusBadge: (status: string) => JSX.Element;
  setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFeedbackDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DropdownProps {
    menuId: string;
    openMenuId: string | null;
    setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
    meeting: Meeting;
    setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setShowFeedbackDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CancelDialogProps {
    onCancel: () => void;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    cancelReason: string;
    setCancelReason: React.Dispatch<React.SetStateAction<string>>;
}

export interface FeedbackDialogProps {
    onSubmit: () => void;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    feedback: string;
    setFeedback: React.Dispatch<React.SetStateAction<string>>;
    rating: number;
    setRating: React.Dispatch<React.SetStateAction<number>>;
}

// --- モックデータとヘルパー関数 ---
const scheduledMeetings: Meeting[] = [ { id: "1", mentorId: "1", mentorName: "田中 太郎", mentorAvatar: "/placeholder.svg?height=40&width=40", mentorRank: "S", date: "2025-06-15", startTime: "14:00", endTime: "15:00", topic: "Reactのパフォーマンス最適化について", description: "Reactアプリケーションのレンダリング最適化とメモ化について相談したいです。", status: "upcoming", meetingUrl: "https://meet.google.com/abc-defg-hij", notes: "コードサンプルを事前に準備しておく" }, { id: "2", mentorId: "2", mentorName: "佐藤 花子", mentorAvatar: "/placeholder.svg?height=40&width=40", mentorRank: "A", date: "2025-06-18", startTime: "10:30", endTime: "11:30", topic: "UIデザインのレビュー", description: "ポートフォリオサイトのUIデザインについてフィードバックをいただきたいです。", status: "upcoming", meetingUrl: "https://zoom.us/j/1234567890", notes: "デザインモックアップを共有する" }, { id: "3", mentorId: "3", mentorName: "鈴木 一郎", mentorAvatar: "/placeholder.svg?height=40&width=40", mentorRank: "S", date: "2025-06-12", startTime: "16:00", endTime: "17:00", topic: "機械学習モデルの評価方法", description: "画像認識モデルの精度向上について相談したいです。", status: "completed", meetingUrl: "https://meet.google.com/xyz-abcd-efg", notes: "テストデータセットの準備", feedback: "モデルの過学習について良いアドバイスをいただきました。次回はデータ拡張について相談したいです。", rating: 5 }, { id: "4", mentorId: "4", mentorName: "高橋 美咲", mentorAvatar: "/placeholder.svg?height=40&width=40", mentorRank: "A", date: "2025-06-10", startTime: "13:00", endTime: "14:00", topic: "AWSアーキテクチャの設計", description: "スケーラブルなバックエンドシステムの設計について相談したいです。", status: "completed", meetingUrl: "https://zoom.us/j/0987654321", notes: "システム要件書を共有する", feedback: "サーバーレスアーキテクチャについて詳しく教えていただき、とても参考になりました。", rating: 4 }, { id: "5", mentorId: "1", mentorName: "田中 太郎", mentorAvatar: "/placeholder.svg?height=40&width=40", mentorRank: "S", date: "2025-06-08", startTime: "11:00", endTime: "12:00", topic: "キャリア相談", description: "フロントエンドエンジニアとしてのキャリアパスについて相談したいです。", status: "cancelled", meetingUrl: "https://meet.google.com/lmn-opqr-stu", notes: "職務経歴書を準備する", cancellationReason: "メンターの都合により" }, ];
function formatDate(dateString: string) { const date = new Date(dateString); return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(date); }
function getDayOfWeek(dateString: string) { const date = new Date(dateString); const days = ["日", "月", "火", "水", "木", "金", "土"]; return days[date.getDay()]; }
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
function generateCalendarDays(year: number, month: number) { const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate(); const days = []; const prevMonthDays = new Date(year, month, 0).getDate(); for (let i = firstDay - 1; i >= 0; i--) { days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false, hasMeeting: false }); } for (let i = 1; i <= daysInMonth; i++) { const date = new Date(year, month, i); const dateString = date.toISOString().split("T")[0]; const hasMeeting = scheduledMeetings.some((meeting) => meeting.date === dateString && meeting.status === "upcoming"); days.push({ date, isCurrentMonth: true, hasMeeting, isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear() }); } const remainingDays = 42 - days.length; for (let i = 1; i <= remainingDays; i++) { days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false, hasMeeting: false }); } return days; }

// --- メインコンポーネント ---
export default function MentorSchedulePage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [activeListTab, setActiveListTab] = useState("upcoming");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const changeMonth = (increment: number) => { let newMonth = calendarMonth + increment; let newYear = calendarYear; if (newMonth > 11) { newMonth = 0; newYear += 1; } else if (newMonth < 0) { newMonth = 11; newYear -= 1; } setCalendarMonth(newMonth); setCalendarYear(newYear); };
  const calendarDays = generateCalendarDays(calendarYear, calendarMonth);
  const filteredMeetings = useMemo(() => scheduledMeetings.filter((meeting) => { const matchesSearch = meeting.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) || meeting.topic.toLowerCase().includes(searchQuery.toLowerCase()); const matchesStatus = statusFilter === "all" || meeting.status === statusFilter; return matchesSearch && matchesStatus; }), [searchQuery, statusFilter]);
  const sortedMeetings = useMemo(() => [...filteredMeetings].sort((a, b) => { const dateA = new Date(`${a.date}T${a.startTime}`); const dateB = new Date(`${b.date}T${b.startTime}`); return dateA.getTime() - dateB.getTime(); }), [filteredMeetings]);
  
  const getStatusBadge = (status: string) => { switch (status) { case "upcoming": return <span className={`${styles.badge} ${styles.statusBadgeUpcoming}`}>予定</span>; case "completed": return <span className={`${styles.badge} ${styles.statusBadgeCompleted}`}>完了</span>; case "cancelled": return <span className={`${styles.badge} ${styles.statusBadgeCancelled}`}>キャンセル</span>; default: return <span className={styles.badge}>不明</span>; } };
  const handleCancel = () => { console.log("Cancel:", { openMenuId, cancelReason }); setShowCancelDialog(false); };
  const handleFeedbackSubmit = () => { console.log("Feedback:", { openMenuId, feedback, rating }); setShowFeedbackDialog(false); };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.topSection}>
            <div>
              <h1 className={styles.titleTextH1}>メンター面談スケジュール</h1>
              <p className={styles.titleTextP}>メンターとの個人面談の予約と管理</p>
            </div>
            <div className={styles.actionsContainer}>
              <Link to="/mentor/schedule/new" className={styles.primaryButton}>
                <img src="/icons/plus.svg" alt="" /> 面談を予約
              </Link>
              <div className={styles.viewToggleContainer}>
                <button className={`${styles.viewToggleButton} ${view === "list" ? styles.viewToggleButtonActive : ''}`} onClick={() => setView("list")}>
                  <img src="/icons/filter.svg" alt="List view" /><span className={styles.srOnly}>リスト表示</span>
                </button>
                <button className={`${styles.viewToggleButton} ${view === "calendar" ? styles.viewToggleButtonActive : ''}`} onClick={() => setView("calendar")}>
                  <img src="/icons/calendar.svg" alt="Calendar view" /><span className={styles.srOnly}>カレンダー表示</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.filtersSection}>
            <div className={styles.searchInputContainer}>
              <img src="/icons/search.svg" alt="" className={styles.searchInputIcon} />
              <input type="search" placeholder="メンター名、トピックで検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput}/>
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.selectControl}>
              <option value="all">すべてのステータス</option>
              <option value="upcoming">予定</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>

          {view === "list" ? (
            <div>
              <div className={styles.tabsList}>
                <button onClick={() => setActiveListTab("upcoming")} className={`${styles.tabTrigger} ${activeListTab === "upcoming" ? styles.tabTriggerActive : ''}`}>予定の面談</button>
                <button onClick={() => setActiveListTab("past")} className={`${styles.tabTrigger} ${activeListTab === "past" ? styles.tabTriggerActive : ''}`}>過去の面談</button>
              </div>
              <div className={styles.tabContent}>
                {activeListTab === 'upcoming' && (
                  <div className={styles.meetingsList}>
                    {sortedMeetings.filter(m => m.status === 'upcoming').map(meeting => (
                      <MeetingCard key={meeting.id} meeting={meeting} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} getStatusBadge={getStatusBadge} setShowCancelDialog={setShowCancelDialog} setShowFeedbackDialog={setShowFeedbackDialog} />
                    ))}
                    {sortedMeetings.filter(m => m.status === 'upcoming').length === 0 && (
                      <div className={styles.emptyState}>
                        <img src="/icons/calendar.svg" alt="" /><h3>予定の面談はありません</h3><p>メンターとの面談を予約しましょう</p>
                        <Link to="/mentor/schedule/new" className={styles.primaryButton}><img src="/icons/plus.svg" alt="" />面談を予約</Link>
                      </div>
                    )}
                  </div>
                )}
                {activeListTab === 'past' && (
                  <div className={styles.meetingsList}>
                    {sortedMeetings.filter(m => m.status === "completed" || m.status === "cancelled").map(meeting => (
                       <MeetingCard key={meeting.id} meeting={meeting} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} getStatusBadge={getStatusBadge} setShowCancelDialog={setShowCancelDialog} setShowFeedbackDialog={setShowFeedbackDialog} />
                    ))}
                    {sortedMeetings.filter(m => m.status === "completed" || m.status === "cancelled").length === 0 && (
                      <div className={styles.emptyState}>
                        <img src="/icons/calendar.svg" alt="" /><h3>過去の面談はありません</h3>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.tabContent}>
              <div className={styles.calendarHeader}>
                <h2 className={styles.calendarTitle}>{new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long" }).format(new Date(calendarYear, calendarMonth))}</h2>
                <div className={styles.calendarNav}>
                  <button className={`${styles.calendarNavButton} ${styles.calendarNavButtonIcon}`} onClick={() => changeMonth(-1)}><img src="/icons/chevron-left.svg" alt="前月" /></button>
                  <button className={styles.calendarNavButton} onClick={() => { setCalendarMonth(currentMonth); setCalendarYear(currentYear); }}>今月</button>
                  <button className={`${styles.calendarNavButton} ${styles.calendarNavButtonIcon}`} onClick={() => changeMonth(1)}><img src="/icons/chevron-right.svg" alt="翌月" /></button>
                </div>
              </div>
              <div className={styles.calendarGrid}>
                {["日", "月", "火", "水", "木", "金", "土"].map(day => <div key={day} className={styles.calendarGridHeader}>{day}</div>)}
                {calendarDays.map((day, index) => {
                  const dateString = day.date.toISOString().split("T")[0];
                  const dayMeetings = scheduledMeetings.filter(m => m.date === dateString && m.status === "upcoming");
                  return (
                    <div key={index} className={`${styles.dayCell} ${!day.isCurrentMonth ? styles.dayCellNotInMonth : ''} ${day.isToday ? styles.dayCellToday : ''}`}>
                      <div className={styles.dayCellHeader}>
                        <span className={`${styles.dayNumber} ${day.date.getDay() === 0 ? styles.dayNumberSun : ''} ${day.date.getDay() === 6 ? styles.dayNumberSat : ''}`}>{day.date.getDate()}</span>
                        {day.hasMeeting && <span className={styles.meetingIndicator}></span>}
                      </div>
                      <div className={styles.meetingsInDay}>
                        {dayMeetings.slice(0, 2).map(m => <Link key={m.id} to={`/mentor/schedule/${m.id}`} className={styles.meetingLink}>{m.startTime} {m.mentorName}</Link>)}
                        {dayMeetings.length > 2 && <div className={styles.moreMeetings}>+{dayMeetings.length - 2}件</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      {showCancelDialog && <CancelDialog onCancel={handleCancel} onOpenChange={setShowCancelDialog} cancelReason={cancelReason} setCancelReason={setCancelReason}/>}
      {showFeedbackDialog && <FeedbackDialog onSubmit={handleFeedbackSubmit} onOpenChange={setShowFeedbackDialog} feedback={feedback} setFeedback={setFeedback} rating={rating} setRating={setRating}/>}
    </div>
  );
}

// --- サブコンポーネント定義 (anyを具体的な型に修正) ---
const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, openMenuId, setOpenMenuId, getStatusBadge, setShowCancelDialog, setShowFeedbackDialog }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardHeaderTop}>
                    <div className={styles.cardHeaderInfo}>
                        <div className={styles.avatar}><img src={meeting.mentorAvatar || "/placeholder.svg"} alt={meeting.mentorName} /></div>
                        <div className={styles.mentorInfo}>
                            <h3 className={styles.cardTitle}>{meeting.topic}</h3>
                            <div className={styles.mentorSubtitle}>
                                <span className={styles.mentorName}>{meeting.mentorName}</span>
                                <span className={`${styles.badge} ${styles.rankBadge} ${meeting.mentorRank === 'S' ? styles.rankBadgeS : styles.rankBadgeA}`}>{meeting.mentorRank}</span>
                            </div>
                        </div>
                    </div>
                    {getStatusBadge(meeting.status)}
                    <Dropdown menuId={meeting.id} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} meeting={meeting} setShowCancelDialog={setShowCancelDialog} setShowFeedbackDialog={setShowFeedbackDialog}/>
                </div>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.cardContentInner}>
                    <div className={styles.cardContentRow}><img src="/icons/calendar.svg" alt="" /><span>{formatDate(meeting.date)} ({getDayOfWeek(meeting.date)})</span></div>
                    <div className={styles.cardContentRow}><img src="/icons/clock.svg" alt="" /><span>{meeting.startTime} - {meeting.endTime}</span></div>
                    <p className={styles.cardContentRow}>{meeting.description}</p>
                    {meeting.notes && <div className={styles.notesBlock}><p>メモ:</p><p>{meeting.notes}</p></div>}
                    {meeting.feedback && <div className={styles.notesBlock}><p>フィードバック:</p><p>{meeting.feedback}</p></div>}
                    {meeting.cancellationReason && <div className={`${styles.notesBlock} ${styles.statusBadgeCancelled}`}><p>キャンセル理由:</p><p>{meeting.cancellationReason}</p></div>}
                </div>
            </div>
            {meeting.status === 'upcoming' && (
                <div className={styles.cardFooter}>
                    <div className={styles.cardFooterInner}>
                        <Link to={`/mentor/chat/${meeting.mentorId}`} className={styles.outlineButton}>メッセージを送る</Link>
                        <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer" className={styles.joinButton}>
                            <img src="/icons/video.svg" alt=""/>ミーティングに参加
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

const Dropdown: React.FC<DropdownProps> = ({ menuId, openMenuId, setOpenMenuId, meeting, setShowCancelDialog, setShowFeedbackDialog }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => { const handleClickOutside = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { setOpenMenuId(null); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [setOpenMenuId]);
    return (<div className={styles.dropdownContainer} ref={dropdownRef}><button className={styles.iconButton} onClick={() => setOpenMenuId(openMenuId === menuId ? null : menuId)}><img src="/icons/more-horizontal.svg" alt="Menu"/></button>{openMenuId === menuId && (<div className={styles.dropdownMenu}><Link to={`/mentor/schedule/${meeting.id}`} className={styles.dropdownMenuItem}>詳細を見る</Link>{meeting.status === "upcoming" && (<><Link to={`/mentor/schedule/${meeting.id}/edit`} className={styles.dropdownMenuItem}><img src="/icons/edit.svg" alt=""/>予約を変更</Link><button onClick={() => setShowCancelDialog(true)} className={`${styles.dropdownMenuItem} ${styles.dropdownMenuItemDanger}`}><img src="/icons/trash-2.svg" alt=""/>キャンセル</button></>)}{meeting.status === "completed" && !meeting.feedback && (<button onClick={() => setShowFeedbackDialog(true)} className={styles.dropdownMenuItem}><img src="/icons/star.svg" alt=""/>フィードバックを送る</button>)}<Link to={`/mentor/schedule/new?mentor=${meeting.mentorId}`} className={styles.dropdownMenuItem}>再予約する</Link></div>)}</div>);
};

const CancelDialog: React.FC<CancelDialogProps> = ({ onCancel, onOpenChange, cancelReason, setCancelReason }) => {
    return (<div className={styles.dialogOverlay} onClick={() => onOpenChange(false)}><div className={styles.dialogContent} onClick={e => e.stopPropagation()}><div className={styles.dialogHeader}><h3 className={styles.dialogTitle}>面談をキャンセルしますか？</h3><p className={styles.dialogDescription}>この操作は取り消せません。メンターにも通知が送信されます。</p></div><div className={styles.dialogBody}><label htmlFor="cancel-reason" className={styles.formLabel}>キャンセル理由（任意）</label><textarea id="cancel-reason" placeholder="理由を入力してください" value={cancelReason} onChange={e => setCancelReason(e.target.value)} className={styles.formTextarea}/></div><div className={styles.dialogFooter}><button className={`${styles.dialogButton} ${styles.dialogButtonOutline}`} onClick={() => onOpenChange(false)}>戻る</button><button className={`${styles.dialogButton} ${styles.dialogButtonDestructive}`} onClick={onCancel}>キャンセルする</button></div></div></div>);
};

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ onSubmit, onOpenChange, feedback, setFeedback, rating, setRating }) => {
    return (<div className={styles.dialogOverlay} onClick={() => onOpenChange(false)}><div className={styles.dialogContent} onClick={e => e.stopPropagation()}><div className={styles.dialogHeader}><h3 className={styles.dialogTitle}>面談のフィードバック</h3><p className={styles.dialogDescription}>面談の感想や評価をお聞かせください。</p></div><div className={styles.dialogBody}><div><label className={styles.formLabel}>評価</label><div className={styles.ratingSelector}>{Array.from({length:5}).map((_,i)=>(<button key={i} onClick={() => setRating(i+1)} className={styles.ratingStarButton}><img src="/icons/star.svg" alt="" className={i<rating ? styles.starFilled : styles.starEmpty}/></button>))}</div></div><div><label htmlFor="feedback-text" className={styles.formLabel}>フィードバック</label><textarea id="feedback-text" placeholder="感想を入力" value={feedback} onChange={e => setFeedback(e.target.value)} className={styles.formTextarea}/></div></div><div className={styles.dialogFooter}><button className={`${styles.dialogButton} ${styles.dialogButtonOutline}`} onClick={() => onOpenChange(false)}>キャンセル</button><button className={`${styles.dialogButton} ${styles.dialogButtonPrimary}`} onClick={onSubmit} disabled={!rating || !feedback}>送信する</button></div></div></div>);
};