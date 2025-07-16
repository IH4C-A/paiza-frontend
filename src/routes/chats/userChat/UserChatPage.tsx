"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineCodeBracket,
  HiOutlinePaperClip,
  HiOutlineStar,
  HiOutlineEllipsisVertical,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { FaPaperPlane, FaStar } from "react-icons/fa";
import { useChat } from "../../../hooks/useChat";
import { useCurrentUser } from "../../../hooks/useUser";
import styles from "./UserChatPage.module.css";
import { useParams } from "react-router-dom";
import MentorshipFeedbackModal from "../../../components/modal/FeedBackModal";
import CodeInputModal from "../../../components/modal/CodeInputModal";
import { useRegisterMentorshipFeedback } from "../../../hooks/useMentorFeedBack";
import { useMentorshipUser } from "../../../hooks";
import { FaStarHalfStroke } from "react-icons/fa6";

export default function IndividualChatPage() {
  const { id } = useParams();
  const { currentUser } = useCurrentUser();
  const [message, setMessage] = useState("");
  const { registerFeedback } = useRegisterMentorshipFeedback();
  const { usermentors } = useMentorshipUser(id || "");
  // このステートは削除またはコメントアウトしてください:
  const [uploadedImage, setUploadedImage] = useState<{ filename: string; data: string; } | undefined>(undefined);

  const { chats, sendMessage, allUsers, fetchChatHistory } = useChat();

  const receiverUser = useMemo(() => {
    return allUsers.find((user) => user.user_id === id);
  }, [allUsers, id]);

  useEffect(() => {
    if (id && fetchChatHistory) {
      fetchChatHistory(id);
    }
  }, [id, fetchChatHistory]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCodeInputModalOpen, setIsCodeInputModalOpen] = useState(false);

  const formattedMessages = chats.map((chat) => ({
    id: chat.chat_id,
    sender: chat.sender,
    content: chat.message || "", // テキストやコードメッセージのコンテンツ
    image: chat.image, // 画像メッセージのファイル名
    timestamp: new Date(chat.chat_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: chat.type || "text",
  }));

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage({
        message: message,
        send_user_id: currentUser?.user_id || "",
        receiver_user_id: id,
        type: "text",
      });
      setMessage("");
    }
  };

  const handleImageSend = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      setUploadedImage({ filename: file.name, data: reader.result as string }); // 非同期性を避けるため削除
      reader.onloadend = () => {
        if (reader.result) {
          console.log(uploadedImage)
          sendMessage({
            // NEW: Base64データとファイル名を直接 sendMessage に渡す
            image: uploadedImage, // Base64データ
            send_user_id: currentUser?.user_id || ""
            ,
            receiver_user_id: id,
            message: "", // オプション: 画像のキャプション
            type: "image",
          });
          // ファイル入力フィールドをクリアして、同じファイルを再度アップロードできるようにする
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  

  const handleCodeSend = (codeContent: string) => {
    if (codeContent.trim()) {
      sendMessage({
        message: codeContent, // コードをメッセージとして送信
        send_user_id: currentUser?.user_id || "",
        receiver_user_id: id,
        type: "code",
      });
      setIsCodeInputModalOpen(false);
    }
  };

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleOpenFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleSubmitFeedback = (rating: number, comment: string) => {
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    const feedback = {
      mentorship_id: usermentors.mentorship_id || "",
      content: comment,
      rating: rating,
    };
    registerFeedback(feedback)
      .then(() => {
        alert("メンターの評価を送信しました！");
        handleCloseFeedbackModal();
      })
      .catch((error) => {
        console.error("評価の送信に失敗しました:", error);
        alert("評価の送信に失敗しました。");
      });
  };

  const renderStarRating = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) {
      return <span className={styles.noRatingText}>評価なし</span>;
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={styles.starIcon} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfStroke key="half" className={styles.starIcon} />);
    }

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
      <main className={styles.main}>
        <div className={styles.chatHeaderWrapper}>
          <div className={styles.chatHeaderContent}>
            <div className={styles.chatHeaderLeft}>
              <a href="/chats" className={styles.iconButton}>
                <HiOutlineArrowLeft className={styles.iconSmall} />
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
                      {receiverUser?.first_name?.charAt(0)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.mentorRankRow}>
                    <h1 className={styles.mentorNameHeader}>
                      {receiverUser?.first_name}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.dropdownMenu}>
              <button
                className={styles.iconButton}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <HiOutlineEllipsisVertical className={styles.iconSmall} />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenuContent}>
                  <button
                    className={styles.dropdownMenuItem}
                    onClick={handleOpenFeedbackModal}
                  >
                    <HiOutlineStar className={styles.dropdownMenuItemIcon} />
                    メンターを評価
                  </button>
                  <button
                    className={styles.dropdownMenuItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <HiOutlineDocumentText
                      className={styles.dropdownMenuItemIcon}
                    />
                    チャット履歴をエクスポート
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.chatAndSidebarContainer}>
          <div className={styles.chatArea}>
            <div className={styles.messagesContainer}>
              {formattedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.messageWrapper} ${
                    msg.sender === currentUser?.first_name
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
                    {msg.sender === receiverUser?.first_name && (
                      <div className={styles.mentorAvatarInMessage}>
                        <div className={styles.avatarMini}>
                          <img
                            src={
                              receiverUser?.profile_image || "/placeholder.svg"
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
                        msg.sender === currentUser?.first_name
                          ? styles.messageBubblePrimary
                          : msg.type === "code"
                          ? styles.messageBubbleCode
                          : styles.messageBubbleMuted
                      }`}
                    >
                      {msg.type === "code" ? (
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
                      ) : msg.type === "image" ? (
                        <img
                          src={`http://127.0.0.1:5000/chat_image/${msg.image}`}
                          alt="添付画像"
                          className={styles.chatImage}
                        />
                      ) : (
                        <p className={styles.messageText}>{msg.content}</p>
                      )}
                    </div>
                    <div
                      className={`${styles.messageTimestamp} ${
                        msg.sender === currentUser?.first_name
                          ? styles.messageTimestampUser
                          : ""
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.messageInputArea}>
              <div className={styles.messageInputWrapper}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageSend}
                  accept="image/*"
                />
                <button
                  className={styles.outlineIconButton}
                  onClick={() => fileInputRef?.current?.click()}
                >
                  <HiOutlinePaperClip className={styles.iconSmall} />
                </button>
                <button
                  className={styles.outlineIconButton}
                  onClick={() => setIsCodeInputModalOpen(true)}
                >
                  <HiOutlineCodeBracket className={styles.iconSmall} />
                </button>
                <textarea
                  placeholder="メッセージを入力..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className={styles.messageTextarea}
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={styles.primaryButton}
                >
                  <FaPaperPlane className={styles.iconSmall} />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>メンター情報</h2>
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
                      <span className={styles.ratingText}>
                        {receiverUser?.average_rating !== undefined &&
                        receiverUser?.average_rating !== null
                          ? receiverUser.average_rating.toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      返信時間:{receiverUser?.response_time}
                    </span>
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
                  onClick={handleOpenFeedbackModal}
                >
                  <HiOutlineStar className={styles.buttonIcon} />
                  メンターを評価
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MentorshipFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        onSubmit={handleSubmitFeedback}
        mentorName={receiverUser?.first_name || "メンター"}
      />

      <CodeInputModal
        isOpen={isCodeInputModalOpen}
        onClose={() => setIsCodeInputModalOpen(false)}
        onSubmit={handleCodeSend}
      />
    </div>
  );
}