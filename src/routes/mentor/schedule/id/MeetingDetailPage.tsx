import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom"; // useParamsは不要になったので削除
import styles from "./MeetingDetailPage.module.css";
import type { MentorSchedule } from "../../../../types/mentorSchedule";
import { useMentorshipSchedule } from "../../../../hooks/useMentorSchedule";
import { useRegisterMentorshipFeedback } from "../../../../hooks/useMentorFeedBack";
import { FaArrowLeft, FaCalendar, FaClock, FaEdit, FaEllipsisH, FaStar, FaTrash, FaVideo } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { useUpdateSchedule } from "../../../../hooks/useMentorSchedule";
// --- 型定義 (変更なし) ---

interface DropdownProps {
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  meeting: MentorSchedule;
  setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFeedbackDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CancelDialogProps {
  onCancel: () => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  cancelReason: string;
  setCancelReason: React.Dispatch<React.SetStateAction<string>>;
}

interface FeedbackDialogProps {
  onSubmit: () => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  feedback: string;
  setFeedback: React.Dispatch<React.SetStateAction<string>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}

// ヘルパー関数 (変更なし)
function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("無効な日付:", dateString);
    return "不明な日付";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60)
  );
  if (diffInHours < 0) return `${Math.abs(diffInHours)}時間前`;
  if (diffInHours < 24) return `${diffInHours}時間後`;
  return `${Math.floor(diffInHours / 24)}日後`;
}

// --- メインコンポーネント ---
export default function MeetingDetailPage() {
  const { id } = useParams();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const { schedule } = useMentorshipSchedule(id || "");
  const { registerFeedback } = useRegisterMentorshipFeedback();
  const { updateSchedule } = useUpdateSchedule();
  console.log("Schedule Data:", schedule);

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
    updateSchedule(id || "", {
      status: "canceled",
      cancel_reason: cancelReason,
    })
      .then(() => {
        setShowCancelDialog(false);
        setCancelReason("");
      })
      .catch((error) => {
        console.error("キャンセルの更新に失敗:", error);
      });
    setShowCancelDialog(false);
  };
  const handleFeedbackSubmit = () => {
    console.log("Feedback:", { meetingId: id, feedback, rating });
    registerFeedback({
      mentorship_id: id || "",
      content: feedback,
      rating: rating,
    })
      .then(() => {
        setShowFeedbackDialog(false);
        setFeedback("");
        setRating(0);
      });
    setShowFeedbackDialog(false);
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.backButtonContainer}>
            <Link to="/mentor/schedule" className={styles.backButton}>
              <FaArrowLeft />
              スケジュール一覧に戻る
            </Link>
          </div>
          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.meetingCardHeader}>
                    <div>
                      <div className={styles.meetingTitleContainer}>
                        <h1 className={styles.meetingTitle}>
                          {schedule?.topic}
                        </h1>
                        {getStatusBadge(schedule?.status || "")}
                      </div>
                      <p className={styles.cardDescription}>
                        {" "}
                        {schedule?.start_time} - {schedule?.end_time}
                      </p>
                    </div>
                    {schedule && (
                      <Dropdown
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                        meeting={schedule}
                        setShowCancelDialog={setShowCancelDialog}
                        setShowFeedbackDialog={setShowFeedbackDialog}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.mainCardContent}>
                    <div>
                      <h3>面談内容</h3>
                      <p>{schedule?.description}</p>
                    </div>
                    {schedule?.notes && (
                      <div>
                        <h3>メモ</h3>
                        <div className={styles.notesBlock}>
                          <p>{schedule?.notes.content}</p>
                        </div>
                      </div>
                    )}
                    {/* {meeting.preparation && <div><h3>事前準備</h3><ul className={styles.checklist}>{meeting.preparation.map((item:string, i:number)=><li key={i} className={styles.checklistItem}><span>✓</span><span>{item}</span></li>)}</ul></div>} */}
                    {/* {meeting.status === 'completed' && meeting.actionItems && <div><h3>アクションアイテム</h3><ul className={styles.checklist}>{meeting.actionItems.map((item:string, i:number)=><li key={i} className={styles.checklistItem}><span>✓</span><span>{item}</span></li>)}</ul></div>} */}
                  </div>
                </div>
              </div>
              {schedule?.status === "completed" &&
                (schedule?.feedback || "") && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>フィードバック</h2>
                    </div>
                    <div
                      className={`${styles.cardContent} ${styles.feedbackCardContent}`}
                    >
                      {schedule?.feedback && (
                        <div className={styles.feedbackBlock}>
                          <p>あなたのフィードバック</p>
                          <div className={styles.feedbackText}>
                            <p>{schedule?.feedback.comment}</p>
                          </div>
                        </div>
                      )}
                      {/* {meeting.mentorFeedback && <div className={styles.feedbackBlock}><p>メンターからのフィードバック</p><div className={styles.feedbackText}><p>{meeting.mentorFeedback}</p></div></div>} */}
                    </div>
                  </div>
                )}
            </div>
            <div className={styles.rightColumn}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>メンター情報</h2>
                </div>
                <div className={styles.mentorCardContent}>
                  <div className={styles.mentorCardHeader}>
                    <div className={styles.avatar}>
                      <img
                        src={schedule?.mentorship_id?.mentor?.profile_image ?? ""}
                        alt={schedule?.mentorship_id?.mentor?.first_name}
                      />
                    </div>
                    <div>
                      <div className={styles.mentorNameContainer}>
                        <h3 className={styles.mentorName}>
                          {schedule?.mentorship_id?.mentor?.first_name}
                        </h3>
                        <span
                          className={`${styles.badge} ${styles.rankBadge} ${
                            schedule?.mentorship_id?.mentor?.ranks?.[1]?.rank_name === "S"
                              ? styles.rankBadgeS
                              : styles.rankBadgeA
                          }`}
                        >
                          {schedule?.mentorship_id?.mentor?.ranks?.[1]?.rank_name}
                        </span>
                      </div>
                      <div className={styles.mentorRating}>
                        <FaStar
                          className={styles.starFilled}
                        />
                        <span>{schedule?.mentorship_id.mentor?.average_rating}</span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--muted-color)",
                          }}
                        >
                          {/* ({meeting.mentorReviewCount}件) */}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.mentorButtons}>
                    <Link
                      to={`/chat/${schedule?.mentorship_id?.mentor?.user_id}`}
                      className={styles.mentorButton}
                    >
                      <FaMessage />
                      メッセージ
                    </Link>
                    <Link
                      to={`/profile/${schedule?.mentorship_id?.mentor?.user_id}`}
                      className={styles.mentorButton}
                    >
                      プロフィール
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>面談詳細</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <FaCalendar />
                      <span>{formatDate(schedule?.start_time || "")}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <FaClock />
                      <span>
                        {schedule?.start_time.split("T")[1]} - {schedule?.end_time.split("T")[1]}
                        {/* {meeting.duration}分) */}
                      </span>
                    </div>
                    {schedule?.status === "scheduled" ? (
                      <div className={styles.detailItem}>
                        <FaVideo />
                        <span>
                          {getRelativeTime(
                            `${schedule?.start_time || ""}`
                          )}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {schedule?.status === "scheduled" && (
                <div className={styles.card}>
                  <div className={styles.cardContent}>
                    <a
                      href={`/meeting/${schedule?.schedule_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.joinButton}
                    >
                      <FaVideo />
                      ミーティングに参加
                    </a>
                    <p className={styles.joinHelpText}>
                      面談開始時刻の5分前から参加できます
                    </p>
                  </div>
                </div>
              )}
              {schedule?.status === "scheduled" && (
                <div className={styles.alert}>
                  <FaCalendar />
                  <div>
                    <h4 className={styles.alertTitle}>リマインダー設定済み</h4>
                    <p className={styles.alertDescription}>
                      面談の1日前と1時間前に通知をお送りします。
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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

// --- サブコンポーネント ---
const Dropdown: React.FC<DropdownProps> = ({
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
        onClick={() =>
          setOpenMenuId(openMenuId === meeting.schedule_id ? null : meeting.schedule_id)
        }
      >
      <FaEllipsisH />
      </button>
      {openMenuId === meeting.schedule_id && (
        <div className={styles.dropdownMenu}>
          <a
            href={`/mentor/schedule/${meeting.schedule_id}`}
            className={styles.dropdownMenuItem}
          >
            詳細を見る
          </a>
          {meeting.status === "scheduled" && (
            <>
              <a
                href={`/mentor/schedule/${meeting.schedule_id}/edit`}
                className={styles.dropdownMenuItem}
              >
                <FaEdit />
                予約を変更
              </a>
              <button
                onClick={() => setShowCancelDialog(true)}
                className={`${styles.dropdownMenuItem} ${styles.dropdownMenuItemDanger}`}
              >
                <FaTrash />
                キャンセル
              </button>
            </>
          )}
          {meeting.status === "completed" && !meeting.feedback && (
            <button
              onClick={() => setShowFeedbackDialog(true)}
              className={styles.dropdownMenuItem}
            >
              <FaStar />
              フィードバックを送る
            </button>
          )}
          <Link
            to={`/mentor/schedule/new?mentor=${meeting.schedule_id}`}
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
                  <img
                    src="/icons/star.svg"
                    alt=""
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
