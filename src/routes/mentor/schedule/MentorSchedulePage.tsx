"use client";

import React, { useState, useMemo, useRef, useEffect, type JSX } from "react";
import { Link } from "react-router-dom";
import styles from "./MentorSchedulePage.module.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendar,
  FaClock,
  FaEdit,
  FaList,
  FaPlus,
  FaSearch,
  FaStar,
  FaTrash,
  FaVideo,
  FaEllipsisH,
} from "react-icons/fa";

import { useMentorshipSchedules } from "../../../hooks/useMentorSchedule";
import type { MentorSchedule } from "../../../types/mentorSchedule";

// ... (interface 定義は変更なし) ...
export interface MeetingCardProps {
  meeting: MentorSchedule;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  getStatusBadge: (status: string) => JSX.Element;
  setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFeedbackDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DropdownProps {
  menuId: string;
  meeting: MentorSchedule;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
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
// formatDate, getDayOfWeek, today, currentMonth, currentYear は変更なし
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[date.getDay()];
}
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// ★修正点: generateCalendarDays が schedules を引数として受け取るようにする★
function generateCalendarDays(
  year: number,
  month: number,
  schedules: MentorSchedule[]
) {
  // schedules 引数を追加
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
      hasMeeting: false,
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateString = date.toISOString().split("T")[0];
    // ★修正点: 引数で渡された schedules を使用する★
    const hasMeeting = schedules.some(
      (meeting) =>
        meeting.start_time.split("T")[0] === dateString &&
        meeting.status === "scheduled" // start_time から日付部分を抽出
    );
    days.push({
      date,
      isCurrentMonth: true,
      hasMeeting,
      isToday:
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear(),
    });
  }
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      hasMeeting: false,
    });
  }
  return days;
}

// --- メインコンポーネント ---
export default function MentorSchedulePage() {
  // ... (state, useMentorshipSchedules は変更なし) ...
  const [view, setView] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [activeListTab, setActiveListTab] = useState("scheduled");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const { schedules } = useMentorshipSchedules();

  const changeMonth = (increment: number) => {
    let newMonth = calendarMonth + increment;
    let newYear = calendarYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  // ★修正点: generateCalendarDays を呼び出す際に schedules を渡す★
  const calendarDays = useMemo(
    () => generateCalendarDays(calendarYear, calendarMonth, schedules), // schedules を引数として渡す
    [calendarYear, calendarMonth, schedules] // 依存配列に追加
  );

  const filteredMeetings = useMemo(
    () =>
      schedules.filter((meeting) => {
        const matchesSearch =
          meeting.mentorship_id?.mentor?.first_name // mentor オブジェクトに first_name があると仮定
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          meeting.topic.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || meeting.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [schedules, searchQuery, statusFilter] // 依存配列に schedules を追加
  );

  const sortedMeetings = useMemo(
    () =>
      [...filteredMeetings].sort((a, b) => {
        // start_time が ISO 形式文字列であることを前提
        const dateA = new Date(a.start_time).getTime();
        const dateB = new Date(b.start_time).getTime();
        return dateA - dateB;
      }),
    [filteredMeetings]
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className={`${styles.badge} ${styles.statusBadgeUpcoming}`}>
            予定
          </span>
        );
      case "completed":
        return (
          <span className={`${styles.badge} ${styles.statusBadgeCompleted}`}>
            完了
          </span>
        );
      case "canceled":
        return (
          <span className={`${styles.badge} ${styles.statusBadgeCancelled}`}>
            キャンセル
          </span>
        );
      default:
        return <span className={styles.badge}>不明</span>;
    }
  };
  const handleCancel = () => {
    console.log("Cancel:", { openMenuId, cancelReason });
    setShowCancelDialog(false);
  };
  const handleFeedbackSubmit = () => {
    console.log("Feedback:", { openMenuId, feedback, rating });
    setShowFeedbackDialog(false);
  };


  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.topSection}>
            <div>
              <h1 className={styles.titleTextH1}>メンター面談スケジュール</h1>
              <p className={styles.titleTextP}>
                メンターとの個人面談の予約と管理
              </p>
            </div>
            <div className={styles.actionsContainer}>
              <Link to="/mentor/schedule/new" className={styles.primaryButton}>
                <FaPlus /> 面談を予約
              </Link>
              <div className={styles.viewToggleContainer}>
                <button
                  className={`${styles.viewToggleButton} ${
                    view === "list" ? styles.viewToggleButtonActive : ""
                  }`}
                  onClick={() => setView("list")}
                >
                  <FaList />
                  <span className={styles.srOnly}>リスト表示</span>
                </button>
                <button
                  className={`${styles.viewToggleButton} ${
                    view === "calendar" ? styles.viewToggleButtonActive : ""
                  }`}
                  onClick={() => setView("calendar")}
                >
                  <FaCalendar />
                  <span className={styles.srOnly}>カレンダー表示</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.filtersSection}>
            <div className={styles.searchInputContainer}>
              <FaSearch className={styles.searchInputIcon} />
              <input
                type="search"
                placeholder="メンター名、トピックで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectControl}
            >
              <option value="all">すべてのステータス</option>
              <option value="scheduled">予定</option>
              <option value="completed">完了</option>
              <option value="canceled">キャンセル</option>
            </select>
          </div>

          {view === "list" ? (
            <div>
              <div className={styles.tabsList}>
                <button
                  onClick={() => setActiveListTab("scheduled")}
                  className={`${styles.tabTrigger} ${
                    activeListTab === "scheduled" ? styles.tabTriggerActive : ""
                  }`}
                >
                  予定の面談
                </button>
                <button
                  onClick={() => setActiveListTab("past")}
                  className={`${styles.tabTrigger} ${
                    activeListTab === "past" ? styles.tabTriggerActive : ""
                  }`}
                >
                  過去の面談
                </button>
              </div>
              <div className={styles.tabContent}>
                {activeListTab === "scheduled" && (
                  <div className={styles.meetingsList}>
                    {sortedMeetings
                      .filter((m) => m.status === "scheduled")
                      .map((meeting) => (
                        <MeetingCard
                          key={meeting.schedule_id}
                          meeting={meeting}
                          openMenuId={openMenuId}
                          setOpenMenuId={setOpenMenuId}
                          getStatusBadge={getStatusBadge}
                          setShowCancelDialog={setShowCancelDialog}
                          setShowFeedbackDialog={setShowFeedbackDialog}
                        />
                      ))}
                    {sortedMeetings.filter((m) => m.status === "scheduled")
                      .length === 0 && (
                      <div className={styles.emptyState}>
                        <FaCalendar />
                        <h3>予定の面談はありません</h3>
                        <p>メンターとの面談を予約しましょう</p>
                        <Link
                          to="/mentor/schedule/new"
                          className={styles.primaryButton}
                        >
                          <FaPlus />
                          面談を予約
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                {activeListTab === "past" && (
                  <div className={styles.meetingsList}>
                    {sortedMeetings
                      .filter(
                        (m) =>
                          m.status === "completed" || m.status === "canceled"
                      )
                      .map((meeting) => (
                        <MeetingCard
                          key={meeting.schedule_id}
                          meeting={meeting}
                          openMenuId={openMenuId}
                          setOpenMenuId={setOpenMenuId}
                          getStatusBadge={getStatusBadge}
                          setShowCancelDialog={setShowCancelDialog}
                          setShowFeedbackDialog={setShowFeedbackDialog}
                        />
                      ))}
                    {sortedMeetings.filter(
                      (m) =>
                        m.status === "completed" || m.status === "canceled"
                    ).length === 0 && (
                      <div className={styles.emptyState}>
                        <FaCalendar />
                        <h3>過去の面談はありません</h3>
                        <p>履歴に面談がありません。</p> {/* 文言を調整 */}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.tabContent}>
              <div className={styles.calendarHeader}>
                <h2 className={styles.calendarTitle}>
                  {new Intl.DateTimeFormat("ja-JP", {
                    year: "numeric",
                    month: "long",
                  }).format(new Date(calendarYear, calendarMonth))}
                </h2>
                <div className={styles.calendarNav}>
                  <button
                    className={`${styles.calendarNavButton} ${styles.calendarNavButtonIcon}`}
                    onClick={() => changeMonth(-1)}
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    className={styles.calendarNavButton}
                    onClick={() => {
                      setCalendarMonth(currentMonth);
                      setCalendarYear(currentYear);
                    }}
                  >
                    今月
                  </button>
                  <button
                    className={`${styles.calendarNavButton} ${styles.calendarNavButtonIcon}`}
                    onClick={() => changeMonth(1)}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
              <div className={styles.calendarGrid}>
                {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                  <div key={day} className={styles.calendarGridHeader}>
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  const dateString = day.date.toISOString().split("T")[0];
                  // 当日以降の予定のみを対象とする
                  const isPastDay =
                    day.date.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0); // 今日より過去の日付かチェック

                  // その日の予定を取得（時間を考慮せず日付のみでマッチ）
                  const meetingsOnDay = schedules.filter(
                    (m) =>
                      m.start_time.split("T")[0] === dateString &&
                      m.status === "scheduled"
                  );

                  console.log(meetingsOnDay)

                  return (
                    <div
                      key={index}
                      className={`${styles.dayCell} ${
                        !day.isCurrentMonth ? styles.dayCellNotInMonth : ""
                      } ${day.isToday ? styles.dayCellToday : ""} ${
                        isPastDay ? styles.dayCellPast : "" // 過去の日付用スタイル
                      } ${
                        meetingsOnDay.length > 0 ? styles.dayCellHasMeeting : "" // 予定がある日のスタイル
                      }`}
                    >
                      <div className={styles.dayCellHeader}>
                        <span
                          className={`${styles.dayNumber} ${
                            day.date.getDay() === 0 ? styles.dayNumberSun : ""
                          } ${
                            day.date.getDay() === 6 ? styles.dayNumberSat : ""
                          }`}
                        >
                          {day.date.getDate()}
                        </span>
                        {meetingsOnDay.length > 0 && (
                          <span className={styles.meetingIndicator}></span>
                        )}
                      </div>
                      <div className={styles.meetingsInDay}>
                        {meetingsOnDay.slice(0, 2).map((m) => (
                          <Link
                            key={m.schedule_id}
                            to={`/mentor/schedule/${m.schedule_id}`}
                            className={styles.meetingLink}
                          >
                            {m.start_time.split("T")[1].substring(0, 5)}
                            {m.mentorship_id ? (
                              <p>{m.mentorship_id.mentor?.first_name}</p> // メンターの名前を表示
                            ) : (
                              <p>{m.group?.group_name}</p>
                            )}
                          </Link>
                        ))}
                        {meetingsOnDay.length > 2 && (
                          <div className={styles.moreMeetings}>
                            +{meetingsOnDay.length - 2}件
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      {showCancelDialog && (
        <CancelDialog
          onCancel={handleCancel}
          onOpenChange={setShowCancelDialog}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
        />
      )}
      {showFeedbackDialog && (
        <FeedbackDialog
          onSubmit={handleFeedbackSubmit}
          onOpenChange={setShowFeedbackDialog}
          feedback={feedback}
          setFeedback={setFeedback}
          rating={rating}
          setRating={setRating}
        />
      )}
    </div>
  );
}

// --- サブコンポーネント定義 (anyを具体的な型に修正) ---
const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  openMenuId,
  setOpenMenuId,
  getStatusBadge,
  setShowCancelDialog,
  setShowFeedbackDialog,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderTop}>
          <div className={styles.cardHeaderInfo}>
            <div className={styles.avatar}>
              <img
                src={
                  meeting.mentorship_id?.mentor?.profile_image ||
                  "/placeholder.svg"
                }
                alt={meeting.mentorship_id?.mentor?.first_name}
              />
            </div>
            <div className={styles.mentorInfo}>
              <h3 className={styles.cardTitle}><a href={`/mentor/schedule/${meeting.schedule_id}`} style={{color: "black", textDecoration: "none"}}>{meeting.topic}</a></h3>
              <div className={styles.mentorSubtitle}>
                <span className={styles.mentorName}>
                  {meeting.mentorship_id ? (
                    <p>{meeting.mentorship_id?.mentor?.first_name}</p>
                  ) : (
                    <p>{meeting.group?.group_name}</p>
                  )}
                </span>
                {/* ランク表示ロジックを修正: メンターのランク配列からrank_nameを取得 */}
                {meeting.mentorship_id?.mentor?.ranks &&
                  meeting.mentorship_id?.mentor?.ranks.length > 0 && (
                    <span
                      className={`${styles.badge} ${styles.rankBadge} ${
                        meeting.mentorship_id?.mentor?.ranks[0].rank_name === "S" // 最初のランクを使用
                          ? styles.rankBadgeS
                          : styles.rankBadgeA
                      }`}
                    >
                      {meeting.mentorship_id?.mentor?.ranks[0].rank_name}
                    </span>
                  )}
              </div>
            </div>
          {getStatusBadge(meeting.status)}
          </div>
          <Dropdown
            menuId={meeting.schedule_id}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            meeting={meeting}
            setShowCancelDialog={setShowCancelDialog}
            setShowFeedbackDialog={setShowFeedbackDialog}
          />
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardContentInner}>
          <div className={styles.cardContentRow}>
            <FaCalendar />
            <span>
              {formatDate(meeting.start_time)} (
              {getDayOfWeek(meeting.start_time)})
            </span>
          </div>
          <div className={styles.cardContentRow}>
            <FaClock />
            <span>
              {/* start_time から時刻部分を抽出し、end_time と組み合わせる */}
              {meeting.start_time.split("T")[1].substring(0, 5)} -{" "}
              {meeting.end_time.split("T")[1].substring(0, 5)}
            </span>
          </div>
          <p className={styles.cardContentRow}>{meeting.description}</p>
          {meeting.notes && (
            <div className={styles.notesBlock}>
              <p>メモ:</p>
              <p>{meeting.notes.content}</p>
            </div>
          )}
          {meeting.feedback && (
            <div className={styles.notesBlock}>
              <p>フィードバック:</p>
              <p>{meeting.feedback.comment}</p>
            </div>
          )}
          {meeting.cancel_reason && (
            <div
              className={`${styles.notesBlock} ${styles.statusBadgeCancelled}`}
            >
              <p>キャンセル理由:</p>
              <p>{meeting.cancel_reason}</p>
            </div>
          )}
        </div>
      </div>
      {meeting.status === "scheduled" && (
        <div className={styles.cardFooter}>
          <div className={styles.cardFooterInner}>
            <Link
              to={`/chats/${meeting.mentorship_id?.mentor?.user_id}`}
              className={styles.outlineButton}
            >
              メッセージを送る
            </Link>
            <a
              href={meeting?.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.joinButton}
            >
              <FaVideo />
              ミーティングに参加
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  menuId,
  openMenuId,
  setOpenMenuId,
  meeting,
  setShowCancelDialog,
  setShowFeedbackDialog,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenMenuId]);
  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={styles.iconButton}
        onClick={() => setOpenMenuId(openMenuId === menuId ? null : menuId)}
      >
        <FaEllipsisH />
      </button>
      {openMenuId === menuId && (
        <div className={styles.dropdownMenu}>
          <Link
            to={`/mentor/schedule/${meeting.schedule_id}`}
            className={styles.dropdownMenuItem}
          >
            詳細を見る
          </Link>
          {meeting.status === "scheduled" && (
            <>
              <Link
                to={`/mentor/schedule/${meeting.schedule_id}/edit`}
                className={styles.dropdownMenuItem}
              >
                <FaEdit />
                予約を変更
              </Link>
              <button
                onClick={() => {
                  setShowCancelDialog(true);
                  setOpenMenuId(null);
                }} // ダイアログ表示後ドロップダウンを閉じる
                className={`${styles.dropdownMenuItem} ${styles.dropdownMenuItemDanger}`}
              >
                <FaTrash />
                キャンセル
              </button>
            </>
          )}
          {meeting.status === "completed" && !meeting.feedback && (
            <button
              onClick={() => {
                setShowFeedbackDialog(true);
                setOpenMenuId(null);
              }} // ダイアログ表示後ドロップダウンを閉じる
              className={styles.dropdownMenuItem}
            >
              <FaStar style={{ color: "gold" }} />{" "}
              {/* 色をstylesで管理しても良い */}
              フィードバックを送る
            </button>
          )}
          <Link
            to={`/mentor/schedule/new?mentor=${meeting.mentorship_id.mentor.user_id}`}
            className={styles.dropdownMenuItem}
          >
            再予約する
          </Link>
        </div>
      )}
    </div>
  );
};

const CancelDialog: React.FC<CancelDialogProps> = ({
  onCancel,
  onOpenChange,
  cancelReason,
  setCancelReason,
}) => {
  return (
    <div className={styles.dialogOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.dialogContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <h3 className={styles.dialogTitle}>面談をキャンセルしますか？</h3>
          <p className={styles.dialogDescription}>
            この操作は取り消せません。メンターにも通知が送信されます。
          </p>
        </div>
        <div className={styles.dialogBody}>
          <label htmlFor="cancel-reason" className={styles.formLabel}>
            キャンセル理由（任意）
          </label>
          <textarea
            id="cancel-reason"
            placeholder="理由を入力してください"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className={styles.formTextarea}
          />
        </div>
        <div className={styles.dialogFooter}>
          <button
            className={`${styles.dialogButton} ${styles.dialogButtonOutline}`}
            onClick={() => onOpenChange(false)}
          >
            戻る
          </button>
          <button
            className={`${styles.dialogButton} ${styles.dialogButtonDestructive}`}
            onClick={onCancel}
          >
            キャンセルする
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  onSubmit,
  onOpenChange,
  feedback,
  setFeedback,
  rating,
  setRating,
}) => {
  return (
    <div className={styles.dialogOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.dialogContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <h3 className={styles.dialogTitle}>面談のフィードバック</h3>
          <p className={styles.dialogDescription}>
            面談の感想や評価をお聞かせください。
          </p>
        </div>
        <div className={styles.dialogBody}>
          <div>
            <label className={styles.formLabel}>評価</label>
            <div className={styles.ratingSelector}>
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className={styles.ratingStarButton}
                >
                  <FaStar
                    className={
                      i < rating ? styles.starFilled : styles.starEmpty
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="feedback-text" className={styles.formLabel}>
              フィードバック
            </label>
            <textarea
              id="feedback-text"
              placeholder="感想を入力"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={styles.formTextarea}
            />
          </div>
        </div>
        <div className={styles.dialogFooter}>
          <button
            className={`${styles.dialogButton} ${styles.dialogButtonOutline}`}
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </button>
          <button
            className={`${styles.dialogButton} ${styles.dialogButtonPrimary}`}
            onClick={onSubmit}
            disabled={!rating || !feedback}
          >
            送信する
          </button>
        </div>
      </div>
    </div>
  );
};
