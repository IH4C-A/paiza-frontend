"use client"

import { useEffect, useMemo, useState } from "react"
// react-iconsからのインポートに置き換え
import { HiOutlineArrowLeft, HiOutlineCog6Tooth, HiOutlineEllipsisVertical, HiOutlineUsers, HiOutlineMapPin } from "react-icons/hi2"; // Heroicons v2
import { FaPaperPlane } from "react-icons/fa"; // Font Awesome
import styles from "./GroupChatPage.module.css"
import { useChat } from "../../../hooks/useChat";
import { useCurrentUser } from "../../../hooks/useUser";
import { useParams } from "react-router-dom";
import { useMyGroupChats, useGroupChatMembers } from "../../../hooks/useGroupChat";

export default function GroupChatPage() {
  const { id } = useParams();
  const [message, setMessage] = useState("")
  const { groupchat, sendMessage, fetchGroupChatHistory  } = useChat();
  const { myGroupChats } = useMyGroupChats();
  const { members } = useGroupChatMembers(id ?? ""); // 一時的な変数名
  const member = members || [];
  const { currentUser } = useCurrentUser();

  const currentGroup = useMemo(() => {
    const groupData = myGroupChats.find((group) => group.group_id === id);
    return groupData;
}, [myGroupChats, id]);

console.log(member)
  useEffect(() => {
  if (id && fetchGroupChatHistory) {
    fetchGroupChatHistory(id); // group_id を渡してグループチャット履歴を取得
  }
}, [id, fetchGroupChatHistory]);
  // ドロップダウンメニューの開閉状態を管理するためのuseState
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formattedMessages = groupchat.map((chat) => {
  const senderUser = members.find((user) => user.id === chat.send_user_id); 
  return {
    id: chat.chat_id,
    sender: senderUser?.name,
    content: chat.message,
    timestamp: new Date(chat.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: chat.type || "text"
  };
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage({
        message: message,
        send_user_id: currentUser?.user_id || "",
        group_id: id || "",
      });
      setMessage("") // メッセージ送信後に入力フィールドをクリア
    }
  };

  console.log(formattedMessages);

  // メッセージタイプに応じたスタイルクラスを返す関数
  const getMessageTypeClass = (type: string) => {
    switch (type) {
      case "announcement":
        return styles.messageAnnouncement;
      case "question":
        return styles.messageQuestion;
      case "answer":
        return styles.messageAnswer;
      default:
        return styles.messageDefault;
    }
  };

  // メッセージタイプに応じたラベルを返す関数
  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case "announcement":
        return "お知らせ";
      case "question":
        return "質問";
      case "answer":
        return "回答";
      default:
        return "";
    }
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
                <HiOutlineArrowLeft className={styles.iconSmall} />
              </a>
              <div className={styles.groupInfoInHeader}>
                <div className={styles.groupIconInHeaderWrapper}>
                  <HiOutlineUsers className={styles.groupIconInHeader} />
                </div>
                <div>
                  <h1 className={styles.groupNameHeader}>{currentGroup?.group_name ?? "グループ名未設定"}</h1>
                  <p className={styles.groupMemberCountHeader}>{currentGroup?.member_count ?? 0}人のメンバー</p>
                </div>
              </div>
            </div>
            {/* ドロップダウンメニューの代わりに純粋なHTMLとCSSで実装 */}
            <div className={styles.dropdownMenu}>
              <button className={styles.iconButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <HiOutlineEllipsisVertical className={styles.iconSmall} />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenuContent}>
                  <button className={styles.dropdownMenuItem} onClick={() => setIsDropdownOpen(false)}>
                    <HiOutlineCog6Tooth className={styles.dropdownMenuItemIcon} />
                    グループ設定
                  </button>
                  <button className={styles.dropdownMenuItem} onClick={() => setIsDropdownOpen(false)}>
                    <HiOutlineMapPin className={styles.dropdownMenuItemIcon} />
                    ピン留めメッセージ
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
              {formattedMessages.map((msg) => (
                <div key={msg.id} className={`${styles.messageBubbleContainer} ${getMessageTypeClass(msg.type)}`}>
                  <div className={styles.messageSenderInfo}>
                    {/* Avatarコンポーネントの代わりにdivとimgを使用 */}
                    <div className={styles.avatarMessageSender}>
                      <img src={msg.sender || "/placeholder.svg"} alt={msg.sender} className={styles.avatarImage} />
                      <div className={styles.avatarFallbackMessageSender}>{msg.sender}</div>
                    </div>
                    <div className={styles.messageContentWrapper}>
                      <div className={styles.messageSenderDetails}>
                        <span className={styles.messageSenderName}>{msg.sender}</span>
                        {getMessageTypeLabel(msg.type) && (
                          <span className={styles.messageTypeLabel}>
                            {getMessageTypeLabel(msg.type)}
                          </span>
                        )}
                        <span className={styles.messageTimestamp}>{msg.timestamp}</span>
                      </div>
                      <p className={styles.messageText}>{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* メッセージ入力エリア */}
            <div className={styles.messageInputArea}>
              <div className={styles.messageInputWrapper}>
                {/* Textareaコンポーネントの代わりにtextareaタグを使用 */}
                <textarea
                  placeholder="メッセージを入力..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                    }
                  }}
                  className={styles.messageTextarea}
                  rows={1}
                />
                <button onClick={handleSendMessage} disabled={!message.trim()} className={styles.primaryButton}>
                  <FaPaperPlane className={styles.iconSmall} />
                </button>
              </div>
            </div>
          </div>

          {/* 右サイドバー (グループ情報とメンバー) */}
          <div className={styles.sidebar}>
            {/* グループ情報カード */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>グループ情報</h2>
                <p className={styles.cardDescription}>{currentGroup?.description}</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>カテゴリ</span>
                  <span className={styles.groupCategoryChip}>{currentGroup?.category?.category_name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>メンバー数</span>
                  <span className={styles.detailTextMuted}>{currentGroup?.member_count}人</span>
                </div>
              </div>
            </div>

            {/* メンバーリストカード */}
            <div className={`${styles.card} ${styles.cardMarginTop}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>メンバー</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.memberList}>
                  {member.map((member, index) => (
                    <div key={index} className={styles.memberItem}>
                      <div className={styles.avatarWrapperMember}>
                        <div className={styles.avatarMember}>
                          <img src={member.prof_image || "/placeholder.svg"} alt={member.name} className={styles.avatarImage} />
                          <div className={styles.avatarFallbackMember}>{member.name}</div>
                        </div>
                        {/* {member.isOnline && (
                          <div className={styles.onlineIndicatorMember} />
                        )} */}
                      </div>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberDetails}>
                          <span className={styles.memberName}>{member.name}</span>
                          <div
                            className={`${styles.senderRank} ${
                              member.rank?.[0]?.rank_name === "S"
                                ? styles.rankS
                                : member.rank?.[0]?.rank_name === "A"
                                ? styles.rankA
                                : member.rank?.[0]?.rank_name === "B"
                                ? styles.rankB
                                : styles.rankC
                            }`}
                          >
                            {member.rank?.[0]?.rank_name}
                          </div>
                          {/* {member.role === "moderator" && (
                            <FaCrown className={styles.moderatorIconSmall} title="モデレーター" />
                          )} */}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className={`${styles.outlineButton} ${styles.fullWidthButton} ${styles.marginTopLarge}`}>
                    すべてのメンバーを見る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}