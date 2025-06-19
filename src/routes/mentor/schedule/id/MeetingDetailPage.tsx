import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // useParamsは不要になったので削除
import styles from "./MeetingDetailPage.module.css";

// --- 型定義 (変更なし) ---
export interface Author {
  name: string;
  rank: "S" | "A" | "B";
  avatar: string;
}

export interface Meeting {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorRank: "S" | "A";
  mentorRating: number;
  mentorReviewCount: number;
  mentorCategories: string[];
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  topic: string;
  description: string;
  status: "upcoming" | "completed" | "cancelled";
  meetingUrl: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  reminders?: { type: string; time: string }[];
  preparation?: string[];
  feedback?: string;
  rating?: number;
  mentorFeedback?: string;
  actionItems?: string[];
  cancellationReason?: string;
}

interface DropdownProps {
    openMenuId: string | null;
    setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
    meeting: Meeting;
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
function formatDate(dateString: string) { const date = new Date(dateString); return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(date); }
function getRelativeTime(dateString: string) { const date = new Date(dateString); const now = new Date(); const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60)); if (diffInHours < 0) return `${Math.abs(diffInHours)}時間前`; if (diffInHours < 24) return `${diffInHours}時間後`; return `${Math.floor(diffInHours / 24)}日後`; }


// --- メインコンポーネント ---
export default function MeetingDetailPage() {
  // useParams を削除し、代わりに単一のモックデータを使用
  const meeting: Meeting = { 
    id: "3", 
    mentorId: "3", 
    mentorName: "鈴木 一郎", 
    mentorAvatar: "/placeholder.svg?height=60&width=60", 
    mentorRank: "S", 
    mentorRating: 4.9, 
    mentorReviewCount: 203, 
    mentorCategories: ["機械学習", "Python", "データサイエンス"], 
    date: "2025-06-12", 
    startTime: "16:00", 
    endTime: "17:00", 
    duration: 60, 
    topic: "機械学習モデルの評価方法", 
    description: "画像認識モデルの精度向上について相談したいです。", 
    status: "completed", 
    meetingUrl: "[https://meet.google.com/xyz-abcd-efg](https://meet.google.com/xyz-abcd-efg)", 
    notes: "テストデータセットの準備", 
    createdAt: "2025-06-08T09:15:00Z", 
    updatedAt: "2025-06-12T17:00:00Z", 
    feedback: "モデルの過学習について良いアドバイスをいただきました。データ拡張の手法や正則化の適用方法について詳しく教えていただき、とても参考になりました。次回はデータ拡張について相談したいです。", 
    rating: 5, 
    mentorFeedback: "とても熱心に学習に取り組まれており、質問も的確でした。次回のデータ拡張についても楽しみにしています。", 
    actionItems: ["データ拡張ライブラリの調査", "正則化パラメータの調整", "バリデーションセットの見直し"], 
  };
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const getStatusBadge = (status: string) => { switch (status) { case "upcoming": return <span className={`${styles.badge} ${styles.statusBadgeUpcoming}`}>予定</span>; case "completed": return <span className={`${styles.badge} ${styles.statusBadgeCompleted}`}>完了</span>; case "cancelled": return <span className={`${styles.badge} ${styles.statusBadgeCancelled}`}>キャンセル</span>; default: return <span className={styles.badge}>不明</span>; } };
  const handleCancel = () => { console.log("Cancel:", { meetingId: meeting.id, cancelReason }); setShowCancelDialog(false); };
  const handleFeedbackSubmit = () => { console.log("Feedback:", { meetingId: meeting.id, feedback, rating }); setShowFeedbackDialog(false); };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.backButtonContainer}><Link to="/mentor/schedule" className={styles.backButton}><img src="/icons/arrow-left.svg" alt="Back" />スケジュール一覧に戻る</Link></div>
          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.meetingCardHeader}>
                    <div>
                      <div className={styles.meetingTitleContainer}><h1 className={styles.meetingTitle}>{meeting.topic}</h1>{getStatusBadge(meeting.status)}</div>
                      <p className={styles.cardDescription}>{formatDate(meeting.date)} {meeting.startTime} - {meeting.endTime}</p>
                    </div>
                    <Dropdown openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} meeting={meeting} setShowCancelDialog={setShowCancelDialog} setShowFeedbackDialog={setShowFeedbackDialog}/>
                  </div>
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.mainCardContent}>
                        <div><h3>面談内容</h3><p>{meeting.description}</p></div>
                        {meeting.notes && <div><h3>メモ</h3><div className={styles.notesBlock}><p>{meeting.notes}</p></div></div>}
                        {meeting.preparation && <div><h3>事前準備</h3><ul className={styles.checklist}>{meeting.preparation.map((item:string, i:number)=><li key={i} className={styles.checklistItem}><span>✓</span><span>{item}</span></li>)}</ul></div>}
                        {meeting.status === 'completed' && meeting.actionItems && <div><h3>アクションアイテム</h3><ul className={styles.checklist}>{meeting.actionItems.map((item:string, i:number)=><li key={i} className={styles.checklistItem}><span>✓</span><span>{item}</span></li>)}</ul></div>}
                    </div>
                </div>
              </div>
              {meeting.status === "completed" && (meeting.feedback || meeting.mentorFeedback) && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}><h2 className={styles.cardTitle}>フィードバック</h2></div>
                    <div className={`${styles.cardContent} ${styles.feedbackCardContent}`}>
                        {meeting.feedback && <div className={styles.feedbackBlock}><p>あなたのフィードバック</p><div className={styles.feedbackText}><p>{meeting.feedback}</p>{meeting.rating && <div className={styles.ratingContainer}>{Array.from({length:5}).map((_,i)=><img key={i} src="/icons/star.svg" alt="" className={i<(meeting.rating || 0) ? styles.starFilled:styles.starEmpty}/>)}</div>}</div></div>}
                        {meeting.mentorFeedback && <div className={styles.feedbackBlock}><p>メンターからのフィードバック</p><div className={styles.feedbackText}><p>{meeting.mentorFeedback}</p></div></div>}
                    </div>
                </div>
              )}
            </div>
            <div className={styles.rightColumn}>
              <div className={styles.card}>
                <div className={styles.cardHeader}><h2 className={styles.cardTitle}>メンター情報</h2></div>
                <div className={styles.mentorCardContent}>
                    <div className={styles.mentorCardHeader}>
                        <div className={styles.avatar}><img src={meeting.mentorAvatar} alt={meeting.mentorName}/></div>
                        <div>
                            <div className={styles.mentorNameContainer}><h3 className={styles.mentorName}>{meeting.mentorName}</h3><span className={`${styles.badge} ${styles.rankBadge} ${meeting.mentorRank === 'S' ? styles.rankBadgeS : styles.rankBadgeA}`}>{meeting.mentorRank}</span></div>
                            <div className={styles.mentorRating}><img src="/icons/star.svg" alt="" className={styles.starFilled}/><span>{meeting.mentorRating}</span><span style={{fontSize:'0.75rem', color:'var(--muted-color)'}}>({meeting.mentorReviewCount}件)</span></div>
                        </div>
                    </div>
                    <div className={styles.mentorButtons}>
                        <Link to={`/mentors/chat/${meeting.mentorId}`} className={styles.mentorButton}><img src="/icons/message-square.svg" alt=""/>メッセージ</Link>
                        <Link to={`/profile/${meeting.mentorId}`} className={styles.mentorButton}>プロフィール</Link>
                    </div>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}><h2 className={styles.cardTitle}>面談詳細</h2></div>
                <div className={styles.cardContent}>
                    <div className={styles.detailsList}>
                        <div className={styles.detailItem}><img src="/icons/calendar.svg" alt=""/><span>{formatDate(meeting.date)}</span></div>
                        <div className={styles.detailItem}><img src="/icons/clock.svg" alt=""/><span>{meeting.startTime} - {meeting.endTime} ({meeting.duration}分)</span></div>
                        {meeting.status === 'upcoming' && meeting.reminders && <div className={styles.detailItem}><img src="/icons/video.svg" alt=""/><span>{getRelativeTime(`${meeting.date}T${meeting.startTime}:00`)}</span></div>}
                    </div>
                </div>
              </div>
              {meeting.status === "upcoming" && <div className={styles.card}><div className={styles.cardContent}><a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer" className={styles.joinButton}><img src="/icons/video.svg" alt=""/>ミーティングに参加</a><p className={styles.joinHelpText}>面談開始時刻の5分前から参加できます</p></div></div>}
              {meeting.status === "upcoming" && <div className={styles.alert}><img src="/icons/calendar.svg" alt=""/><div><h4 className={styles.alertTitle}>リマインダー設定済み</h4><p className={styles.alertDescription}>面談の1日前と1時間前に通知をお送りします。</p></div></div>}
            </div>
          </div>
        </div>
      </main>
      {showCancelDialog && <CancelDialog onCancel={handleCancel} onOpenChange={setShowCancelDialog} cancelReason={cancelReason} setCancelReason={setCancelReason}/>}
      {showFeedbackDialog && <FeedbackDialog onSubmit={handleFeedbackSubmit} onOpenChange={setShowFeedbackDialog} feedback={feedback} setFeedback={setFeedback} rating={rating} setRating={setRating}/>}
    </div>
  );
}

// --- サブコンポーネント ---
const Dropdown: React.FC<DropdownProps> = ({ openMenuId, setOpenMenuId, meeting, setShowCancelDialog, setShowFeedbackDialog }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => { const handleClickOutside = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { setOpenMenuId(null); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [setOpenMenuId]);
    return (<div className={styles.dropdownContainer} ref={dropdownRef}><button className={styles.iconButton} onClick={() => setOpenMenuId(openMenuId === meeting.id ? null : meeting.id)}><img src="/icons/more-horizontal.svg" alt="Menu"/></button>{openMenuId === meeting.id && (<div className={styles.dropdownMenu}><Link to={`/mentors/schedule/${meeting.id}`} className={styles.dropdownMenuItem}>詳細を見る</Link>{meeting.status === "upcoming" && (<><Link to={`/mentors/schedule/${meeting.id}/edit`} className={styles.dropdownMenuItem}><img src="/icons/edit.svg" alt=""/>予約を変更</Link><button onClick={() => setShowCancelDialog(true)} className={`${styles.dropdownMenuItem} ${styles.dropdownMenuItemDanger}`}><img src="/icons/trash-2.svg" alt=""/>キャンセル</button></>)}{meeting.status === "completed" && !meeting.feedback && (<button onClick={() => setShowFeedbackDialog(true)} className={styles.dropdownMenuItem}><img src="/icons/star.svg" alt=""/>フィードバックを送る</button>)}<Link to={`/mentor/schedule/new?mentor=${meeting.mentorId}`} className={styles.dropdownMenuItem}>再予約する</Link></div>)}</div>);
};

const CancelDialog: React.FC<CancelDialogProps> = ({ onCancel, onOpenChange, cancelReason, setCancelReason }) => {
    return (<div className={styles.dialogOverlay} onClick={() => onOpenChange(false)}><div className={styles.dialogContent} onClick={e => e.stopPropagation()}><div className={styles.dialogHeader}><h3 className={styles.dialogTitle}>面談をキャンセルしますか？</h3><p className={styles.dialogDescription}>この操作は取り消せません。メンターにも通知が送信されます。</p></div><div className={styles.dialogBody}><label htmlFor="cancel-reason" className={styles.formLabel}>キャンセル理由（任意）</label><textarea id="cancel-reason" placeholder="理由を入力してください" value={cancelReason} onChange={e => setCancelReason(e.target.value)} className={styles.formTextarea}/></div><div className={styles.dialogFooter}><button className={`${styles.dialogButton} ${styles.dialogButtonOutline}`} onClick={() => onOpenChange(false)}>戻る</button><button className={`${styles.dialogButton} ${styles.dialogButtonDestructive}`} onClick={onCancel}>キャンセルする</button></div></div></div>);
};

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ onSubmit, onOpenChange, feedback, setFeedback, rating, setRating }) => {
    return (<div className={styles.dialogOverlay} onClick={() => onOpenChange(false)}><div className={styles.dialogContent} onClick={e => e.stopPropagation()}><div className={styles.dialogHeader}><h3 className={styles.dialogTitle}>面談のフィードバック</h3><p className={styles.dialogDescription}>面談の感想や評価をお聞かせください。</p></div><div className={styles.dialogBody}><div><label className={styles.formLabel}>評価</label><div className={styles.ratingSelector}>{Array.from({length:5}).map((_,i)=>(<button key={i} onClick={() => setRating(i+1)} className={styles.ratingStarButton}><img src="/icons/star.svg" alt="" className={i<rating ? styles.starFilled : styles.starEmpty}/></button>))}</div></div><div><label htmlFor="feedback-text" className={styles.formLabel}>フィードバック</label><textarea id="feedback-text" placeholder="感想を入力" value={feedback} onChange={e => setFeedback(e.target.value)} className={styles.formTextarea}/></div></div><div className={styles.dialogFooter}><button className={`${styles.dialogButton} ${styles.dialogButtonOutline}`} onClick={() => onOpenChange(false)}>キャンセル</button><button className={`${styles.dialogButton} ${styles.dialogButtonPrimary}`} onClick={onSubmit} disabled={!rating || !feedback}>送信する</button></div></div></div>);
};