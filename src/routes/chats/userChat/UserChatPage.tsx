"use client";

import { useMemo, useState, useEffect } from "react"; // useEffectを追加
import {
  HiOutlineArrowLeft,
  HiOutlineCodeBracket,
  HiOutlinePaperClip,
  HiOutlineStar,
  HiOutlineEllipsisVertical,
  HiOutlineDocumentText,
} from "react-icons/hi2"; // Heroicons v2
import { FaPaperPlane, FaStar } from "react-icons/fa"; // Font Awesome
import { useChat } from "../../../hooks/useChat"; // useChatフックをインポート
import { useCurrentUser } from "../../../hooks/useUser"; // useCurrentUserフックをインポート
import styles from "./UserChatPage.module.css"; // CSSモジュールをインポート
import { useParams } from "react-router-dom"; // react-router-domからuseParamsをインポート
import MentorshipFeedbackModal from "../../../components/modal/FeedBackModal";
import { useRegisterMentorshipFeedback } from "../../../hooks/useMentorFeedBack";
import { useMentorshipUser } from "../../../hooks";
import { FaStarHalfStroke } from "react-icons/fa6";

export default function IndividualChatPage() {
  const { id } = useParams();
  const { currentUser } = useCurrentUser();
  const [message, setMessage] = useState("");
  const { registerFeedback } = useRegisterMentorshipFeedback();
  const { usermentors } = useMentorshipUser(id || ""); // メンター情報を取得するフック

  const { chats, sendMessage, allUsers, fetchChatHistory } = useChat();

  const receiverUser = useMemo(() => {
    return allUsers.find((user) => user.user_id === id);
  }, [allUsers, id]);

  useEffect(() => {
    if (id && fetchChatHistory) {
      fetchChatHistory(id);
    }
  }, [id, fetchChatHistory]);

  // ドロップダウンメニューの開閉状態を管理
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // チャットメッセージを整形して表示形式に変換
  const formattedMessages = chats.map((chat) => ({
    id: chat.chat_id,
    // 現在のユーザーIDとメッセージの送信者IDを比較して、senderを"user"または"mentor"に決定
    sender: chat.sender,
    content: chat.message || chat.image || "", // メッセージ内容または画像
    timestamp: new Date(chat.chat_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }), // タイムスタンプを整形
    type: chat.type || "text",
  }));

  // メッセージ送信時の処理
  const handleSendMessage = () => {
    if (message.trim()) {
      // メッセージが空白でない場合
      sendMessage({
        message: message, // 送信するメッセージ
        send_user_id: currentUser?.user_id || "", // 送信者のユーザーID
        receiver_user_id: id, // 受信者のユーザーID
      });
      setMessage(""); // メッセージ入力フィールドをクリア
    }
  };

  // メンター評価
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // ★★★ NEW: メンター評価モーダルを開く関数 ★★★
  const handleOpenFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
    setIsDropdownOpen(false); // モーダルを開くときにドロップダウンを閉じる
  };

  // ★★★ NEW: メンター評価モーダルを閉じる関数 ★★★
  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleSubmitFeedback = (rating: number, comment: string) => {
    // ここで評価を送信する処理を実装
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    const feedback = {
      mentorship_id: usermentors.mentorship_id || "", // メンターシップID（undefinedの場合は空文字列）
      content: comment, // コメント内容
      rating: rating, // 評価
    };
    registerFeedback(feedback)
      .then(() => {
        alert("メンターの評価を送信しました！");
        handleCloseFeedbackModal(); // モーダルを閉じる
      })
      .catch((error: unknown) => {
        console.error("評価の送信に失敗しました:", error);
        alert("評価の送信に失敗しました。");
      });
  };

  const renderStarRating = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) {
      return (
        <span className={styles.noRatingText}>評価なし</span> // 評価がない場合の表示
      );
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0; // 小数点以下があるか (例: 4.5 -> 0.5)

    const stars = [];

    // 塗りつぶされた星
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={styles.starIcon} />);
    }

    // 半分の星
    if (hasHalfStar) {
      stars.push(<FaStarHalfStroke key="half" className={styles.starIcon} />);
    }

    // 残りの空の星（合計5つになるように）
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar
          key={`empty-${i}`}
          className={`${styles.starIcon} ${styles.emptyStar}`}
        />
      );
    }

    return <>{stars}</>;
  };

  return (
    <div className={styles.container}>
      {/* メインコンテンツ */}
      <main className={styles.main}>
        {/* チャットヘッダー */}
        <div className={styles.chatHeaderWrapper}>
          <div className={styles.chatHeaderContent}>
            <div className={styles.chatHeaderLeft}>
              <a href="/chats" className={styles.iconButton}>
                <HiOutlineArrowLeft className={styles.iconSmall} />{" "}
                {/* 戻るアイコン */}
              </a>
              <div className={styles.mentorInfoInHeader}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarSmall}>
                    <img
                      src={receiverUser?.profile_image || "/placeholder.svg"}
                      alt={receiverUser?.first_name}
                      className={styles.avatarImage}
                    />
                    <div className={styles.avatarFallback}>
                      {receiverUser?.first_name?.charAt(0)}{" "}
                      {/* プロフィール画像のフォールバック */}
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.mentorRankRow}>
                    <h1 className={styles.mentorNameHeader}>
                      {receiverUser?.first_name} {/* 相手のユーザー名 */}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            {/* ドロップダウンメニュー */}
            <div className={styles.dropdownMenu}>
              <button
                className={styles.iconButton}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // ドロップダウンの開閉
              >
                <HiOutlineEllipsisVertical className={styles.iconSmall} />{" "}
                {/* 縦三点リーダーアイコン */}
              </button>
              {isDropdownOpen && ( // ドロップダウンが開いている場合のみ表示
                <div className={styles.dropdownMenuContent}>
                  <button
                    className={styles.dropdownMenuItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <HiOutlineStar className={styles.dropdownMenuItemIcon} />
                    メンターを評価 {/* メニューアイテム */}
                  </button>
                  <button
                    className={styles.dropdownMenuItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <HiOutlineDocumentText
                      className={styles.dropdownMenuItemIcon}
                    />
                    チャット履歴をエクスポート {/* メニューアイテム */}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* チャットとサイドバーのコンテナ */}
        <div className={styles.chatAndSidebarContainer}>
          {/* チャットメッセージエリア */}
          <div className={styles.chatArea}>
            <div className={styles.messagesContainer}>
              {formattedMessages.map(
                (
                  msg // 整形されたメッセージをマップ
                ) => (
                  <div
                    key={msg.id}
                    className={`${styles.messageWrapper} ${
                      msg.sender === currentUser?.first_name // 送信者によってスタイルを切り替え
                        ? styles.messageUser
                        : styles.messageMentor
                    }`}
                  >
                    <div
                      className={`${styles.messageBubbleContainer} ${
                        msg.sender === currentUser?.first_name
                          ? styles.messageBubbleUserOrder
                          : styles.messageBubbleMentorOrder
                      }`}
                    >
                      {msg.sender === receiverUser?.first_name && ( // 相手のメッセージの場合のみアバターと名前を表示
                        <div className={styles.mentorAvatarInMessage}>
                          <div className={styles.avatarMini}>
                            <img
                              src={
                                receiverUser?.profile_image ||
                                "/placeholder.svg"
                              }
                              alt={receiverUser?.first_name}
                              className={styles.avatarImage}
                            />
                            <div className={styles.avatarFallbackMini}>
                              {receiverUser?.first_name}
                            </div>
                          </div>
                          <span className={styles.mentorNameMini}>
                            {receiverUser?.first_name}
                          </span>
                        </div>
                      )}
                      <div
                        className={`${styles.messageBubble} ${
                          msg.sender === "user" // 送信者とタイプによってバブルのスタイルを切り替え
                            ? styles.messageBubblePrimary
                            : msg.type === "code"
                            ? styles.messageBubbleCode
                            : styles.messageBubbleMuted
                        }`}
                      >
                        {msg.type === "code" ? ( // コードメッセージの場合
                          <div>
                            <div className={styles.codeHeader}>
                              <HiOutlineCodeBracket
                                className={styles.codeIcon}
                              />
                              <span className={styles.codeLanguage}></span>
                            </div>
                            <pre className={styles.codeBlock}>
                              <code>{msg.content}</code>
                            </pre>
                          </div>
                        ) : (
                          // テキストメッセージの場合
                          <p className={styles.messageText}>{msg.content}</p>
                        )}
                      </div>
                      <div
                        className={`${styles.messageTimestamp} ${
                          msg.sender === "user"
                            ? styles.messageTimestampUser
                            : ""
                        }`}
                      >
                        {msg.timestamp} {/* タイムスタンプ */}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* メッセージ入力エリア */}
            <div className={styles.messageInputArea}>
              <div className={styles.messageInputWrapper}>
                <button className={styles.outlineIconButton}>
                  <HiOutlinePaperClip className={styles.iconSmall} />{" "}
                  {/* クリップアイコン */}
                </button>
                <button className={styles.outlineIconButton}>
                  <HiOutlineCodeBracket className={styles.iconSmall} />{" "}
                  {/* コードブラケットアイコン */}
                </button>
                {/* メッセージ入力用のtextarea */}
                <textarea
                  placeholder="メッセージを入力..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)} // 入力値の更新
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      // Enterキーが押され、Shiftキーが押されていない場合
                      e.preventDefault(); // デフォルトの改行動作を防止
                      handleSendMessage(); // メッセージを送信
                    }
                  }}
                  className={styles.messageTextarea}
                  rows={1} // 初期行数
                />
                <button
                  onClick={handleSendMessage} // クリックでメッセージ送信
                  disabled={!message.trim()} // メッセージが空白の場合は無効化
                  className={styles.primaryButton}
                >
                  <FaPaperPlane className={styles.iconSmall} />{" "}
                  {/* 送信アイコン */}
                </button>
              </div>
            </div>
          </div>

          {/* 右サイドバー (メンター情報) */}
          <div className={styles.sidebar}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>メンター情報</h2>{" "}
                {/* サイドバーのタイトル */}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.mentorInfoBlock}>
                  <div className={styles.avatarLarge}>
                    <img
                      src={receiverUser?.profile_image || "/placeholder.svg"}
                      alt={receiverUser?.first_name}
                      className={styles.avatarImage}
                    />
                    <div className={styles.avatarFallbackLarge}>
                      {receiverUser?.first_name?.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className={styles.mentorRankRow}>
                      <h3 className={styles.mentorNameSidebar}>
                        {receiverUser?.first_name}
                      </h3>
                      <div
                        className={`${styles.mentorRank} ${
                          receiverUser?.ranks?.[0].rank_name === "S"
                            ? styles.rankS
                            : receiverUser?.ranks?.[0].rank_name === "A"
                            ? styles.rankA
                            : styles.rankB
                        }`}
                      >
                        {receiverUser?.ranks?.[0].rank_name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.mentorDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>評価:</span>
                    <div className={styles.detailValue}>
                      {renderStarRating(receiverUser?.average_rating)}{" "}
                      {/* ★ ここを修正 ★ */}
                      <span className={styles.ratingText}>
                        {receiverUser?.average_rating !== undefined &&
                        receiverUser?.average_rating !== null
                          ? receiverUser.average_rating.toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>返信時間:{receiverUser?.response_time}</span>
                    {/* 返信時間のプレースホルダー */}
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>ステータス</span>
                    <div className={styles.detailValue}>
                      <div className={styles.onlineIndicatorMini} />
                      <span className={styles.detailTextMuted}>オンライン</span>
                    </div>
                  </div>
                </div>
                <button
                  className={`${styles.outlineButton} ${styles.fullWidthButton}`}
                  onClick={handleOpenFeedbackModal} // メンター評価モーダルを開く
                >
                  <HiOutlineStar className={styles.buttonIcon} />
                  メンターを評価 {/* メンター評価ボタン */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* ★★★ NEW: MentorshipFeedbackModal コンポーネントをレンダリング ★★★ */}
      <MentorshipFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        onSubmit={handleSubmitFeedback}
        mentorName={receiverUser?.first_name || "メンター"} // メンターの名前を渡す
      />
    </div>
  );
}
