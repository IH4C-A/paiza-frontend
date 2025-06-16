"use client"

import { useState } from "react"
import { FaCheck, FaTimes, FaRegClock, FaRegCommentDots, FaRegCalendarAlt, FaFilter } from "react-icons/fa"
import { useReceivedMentorRequests, useApproveMentorshipRequest } from "../../../hooks";

import styles from './MentorApplicationsPage.module.css';

// useToastのモック（UIライブラリのToastを使わないため）
const useToast = () => {
  return {
    toast: ({ title, description }: { title: string; description: string; variant?: string }) => {
      // 素のHTMLでToastを実装する場合の例
      // 実際にはもっと複雑な実装（Portal, CSSアニメーションなど）が必要
      alert(`${title}: ${description}`);
    },
  };
};

export default function MentorApplicationsPage() {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("pending")
  const [sortBy, setSortBy] = useState("newest")
  const [replyMessage, setReplyMessage] = useState("")
  // ダイアログの状態管理
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const { requests } = useReceivedMentorRequests();
  const { approveRequest } = useApproveMentorshipRequest();

  console.log(requests)

  const filteredApplications = requests.filter((app) => {
    if (selectedTab === "all") return true
    return app.status === selectedTab
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
      case "oldest":
        return new Date(a.requested_at).getTime() - new Date(b.requested_at).getTime()
      default:
        return 0
    }
  })

  const handleApprove = (request_id: string) => {
    approveRequest(request_id);
    toast({
      title: "申請を承認しました",
      description: "申請者に通知が送信されました。メンタリングを開始してください。",
    })
    setIsDialogOpen(false);
    setReplyMessage(""); 
  }

  const handleReject = () => {
    // ここで実際にAPIコールを行う
    toast({
      title: "申請を拒否しました",
      description: "申請者に通知が送信されました。",
    })
    // applications の状態を更新してUIに反映させるロジックも追加
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    let badgeClass = styles.statusBadge;
    let badgeText = status;

    switch (status) {
      case "pending":
        badgeClass += ` ${styles.statusBadgePending}`;
        badgeText = "審査中";
        break;
      case "approved":
        badgeClass += ` ${styles.statusBadgeApproved}`;
        badgeText = "承認済み";
        break;
      case "rejected":
        badgeClass += ` ${styles.statusBadgeRejected}`;
        badgeText = "拒否";
        break;
      default:
        break;
    }
    return (
      <span className={badgeClass}>
        {badgeText}
      </span>
    );
  };

  return (
    <div className={styles.pageContainer}>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>メンター申請管理</h1>
            <p className={styles.sectionDescription}>あなたに送られたメンタリング申請を確認・管理できます</p>
          </div>

          <div className={styles.filterSortContainer}>
            {/* Tabs コンポーネントの置き換え */}
            <div className={styles.tabsList}>
              <button
                className={`${styles.tabTrigger} ${selectedTab === "pending" ? styles.tabTriggerActive : ''}`}
                onClick={() => setSelectedTab("pending")}
              >
                審査中
                <span className={styles.tabBadge}>
                  {requests.filter((app) => app.status === "pending").length}
                </span>
              </button>
              <button
                className={`${styles.tabTrigger} ${selectedTab === "approved" ? styles.tabTriggerActive : ''}`}
                onClick={() => setSelectedTab("approved")}
              >承認済み</button>
              <button
                className={`${styles.tabTrigger} ${selectedTab === "rejected" ? styles.tabTriggerActive : ''}`}
                onClick={() => setSelectedTab("rejected")}
              >拒否</button>
              <button
                className={`${styles.tabTrigger} ${selectedTab === "all" ? styles.tabTriggerActive : ''}`}
                onClick={() => setSelectedTab("all")}
              >すべて</button>
            </div>

           {/* ★Select コンポーネントを <select> タグに置き換え★ */}
            <div className={styles.selectWrapper}>
              <FaFilter className={styles.selectIcon} />
              <select
                className={styles.selectControl}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">新しい順</option>
                <option value="oldest">古い順</option>
                <option value="urgency">緊急度順</option>
              </select>
            </div>
          </div>

          <div className={styles.cardSpaceY}>
            {sortedApplications.map((application) => (
              <div key={application.request_id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.flexBetweenStart}> {/* flex items-start justify-between */}
                    <div className={styles.applicantInfo}>
                      <div className={styles.avatar}>
                        <img
                          src={application.mentee.profile_image || "/placeholder.svg"}
                          alt={application.mentee.first_name}
                          className={styles.avatarImage}
                        />
                        {/* AvatarFallback の簡易実装 */}
                        {!application.mentee.profile_image && (
                          <div className={styles.avatarFallback}>
                            {application.mentee.first_name}
                          </div>
                        )}
                      </div>
                      <div className={styles.applicantDetails}>
                        <h3 className={styles.cardTitle}>
                          {application.mentee.first_name}
                          <span className={styles.applicantRankBadge}>
                            {application.mentee.ranks?.[0].rank_name}ランク
                          </span>
                        </h3>
                        <div className={styles.appliedAtInfo}>
                          <FaRegCalendarAlt className={styles.iconSmall} />
                          <span className={styles.appliedAtText}>{formatDate(String(application.requested_at))}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.statusBadgeWrapper}>{getStatusBadge(application.status)}</div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.dialogSpaceY}>
                    <div>
                      <h4 className={styles.sectionHeadingSm}>希望分野</h4>
                      <div className={styles.categoryBadgeContainer}>
                        {application.mentee.categories.map((category) => (
                          <span key={category.category_id} className={styles.categoryBadge}>
                            {category.category_name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={styles.sectionHeadingSm}>申請メッセージ</h4>
                      <p className={styles.messageContainer}>{application.message}</p>
                    </div>

                    {application.status === "pending" && (
                      <div className={styles.actionButtonsContainer}>
                        {/* Dialog の置き換え */}
                        <button
                          className={`${styles.button} ${styles.buttonOutline} flex-1`} // flex-1 はTailwind
                          onClick={() => {
                            setIsDialogOpen(true);
                            setCurrentApplicationId(application.request_id);
                          }}
                        >
                          <FaRegCommentDots className="h-4 w-4 mr-2" />
                          返信して承認
                        </button>
                        <button
                          className={`${styles.button} ${styles.buttonOutline} flex-1`} // flex-1 はTailwind
                          onClick={() => handleReject()}
                        >
                          <FaTimes className="h-4 w-4 mr-2" />
                          拒否
                        </button>
                      </div>
                    )}

                    {application.status === "approved" && (
                      <div className={styles.actionButtonsContainer}>
                        <a href={`/chats/${application.mentee.user_id}`} className={`${styles.button} ${styles.buttonPrimary} flex-1`}> {/* flex-1 はTailwind */}
                          <FaRegCommentDots className="h-4 w-4 mr-2" />
                          チャットを開始
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedApplications.length === 0 && (
            <div className={styles.noApplications}>
              <FaRegClock className={styles.noApplicationsIcon} />
              <h3 className={styles.noApplicationsTitle}>申請がありません</h3>
              <p className={styles.noApplicationsDescription}>
                {selectedTab === "pending" ? "現在審査中の申請はありません。" : "該当する申請がありません。"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ダイアログの表示ロジック */}
      {isDialogOpen && (
        <div className={styles.dialogOverlay} onClick={() => setIsDialogOpen(false)}>
          <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}> {/* クリックイベントの伝播停止 */}
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>申請を承認</h2>
              <p className={styles.dialogDescription}>
                {requests.find(app => app.request_id === currentApplicationId)?.mentee.first_name}さんの申請を承認し、メンタリングを開始します。
              </p>
            </div>
            <div className={styles.dialogSpaceY}>
              <div>
                <label htmlFor="reply" className={styles.formLabel}>承認メッセージ（任意）</label>
                <textarea
                  id="reply"
                  placeholder="承認の挨拶や今後の進め方について記載してください..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.dialogFooter}>
              <button className={`${styles.button} ${styles.buttonOutline}`} onClick={() => { setReplyMessage(""); setIsDialogOpen(false); }}>
                キャンセル
              </button>
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={() => currentApplicationId && handleApprove(currentApplicationId)}
              >
                <FaCheck className="h-4 w-4 mr-2" />
                承認する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}