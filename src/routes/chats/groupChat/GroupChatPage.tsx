"use client"

import { useState } from "react"
// react-iconsからのインポートに置き換え
import { HiOutlineArrowLeft, HiOutlineCog6Tooth, HiOutlineEllipsisVertical, HiOutlineUsers, HiOutlineMapPin } from "react-icons/hi2"; // Heroicons v2
import { FaCrown, FaPaperPlane } from "react-icons/fa"; // Font Awesome
import styles from "./GroupChatPage.module.css"

export default function GroupChatPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: {
        name: "田中さん",
        rank: "S",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "moderator",
      },
      content: "React初心者の会へようこそ！質問や情報共有、お気軽にどうぞ。",
      timestamp: "10:00",
      type: "announcement",
      isPinned: true,
    },
    {
      id: "2",
      sender: {
        name: "佐藤さん",
        rank: "B",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
      },
      content: "useEffectの依存配列について質問があります。空の配列を渡しているのに、無限ループが発生してしまいます。",
      timestamp: "14:30",
      type: "question",
    },
    {
      id: "3",
      sender: {
        name: "鈴木さん",
        rank: "A",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
      },
      content: "それはよくある問題ですね。コンポーネントの外部で状態が更新されている可能性があります。",
      timestamp: "14:32",
      type: "answer",
    },
    {
      id: "4",
      sender: {
        name: "高橋さん",
        rank: "B",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
      },
      content: "私も同じ問題に遭遇しました。React DevToolsのProfilerを使って確認するのがおすすめです。",
      timestamp: "14:35",
      type: "discussion",
    },
    {
      id: "5",
      sender: {
        name: "田中さん",
        rank: "S",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "moderator",
      },
      content: `useEffectの無限ループの主な原因をまとめておきますね：

1. Strict Modeの影響（開発環境）
2. 依存配列の設定ミス
3. 外部での状態更新
4. オブジェクトや配列の参照の変更

詳しくは公式ドキュメントも参考にしてください。`,
      timestamp: "14:40",
      type: "answer",
    },
    {
      id: "6",
      sender: {
        name: "佐藤さん",
        rank: "B",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
      },
      content: "ありがとうございます！とても参考になりました。React DevToolsで確認してみます。",
      timestamp: "14:42",
      type: "discussion",
    },
  ])

  // ドロップダウンメニューの開閉状態を管理するためのuseState
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const group = {
    id: params.id,
    name: "React初心者の会",
    description: "React学習者同士で質問・情報共有",
    memberCount: 24,
    category: "Webフレームワーク",
    members: [
      {
        name: "田中さん",
        rank: "S",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "moderator",
        isOnline: true,
      },
      {
        name: "佐藤さん",
        rank: "B",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
        isOnline: true,
      },
      {
        name: "鈴木さん",
        rank: "A",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
        isOnline: false,
      },
      {
        name: "高橋さん",
        rank: "B",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
        isOnline: true,
      },
      {
        name: "山田さん",
        rank: "C",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
        isOnline: false,
      },
    ],
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: {
          name: "あなた", // 仮のユーザー名
          rank: "B" as const, // 仮のランク
          avatar: "/placeholder.svg?height=32&width=32", // 仮のアバター
          role: "member" as const, // 仮のロール
        },
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "discussion" as const,
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

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
                  <h1 className={styles.groupNameHeader}>{group.name}</h1>
                  <p className={styles.groupMemberCountHeader}>{group.memberCount}人のメンバー</p>
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
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.messageBubbleContainer} ${getMessageTypeClass(msg.type)}`}>
                  <div className={styles.messageSenderInfo}>
                    {/* Avatarコンポーネントの代わりにdivとimgを使用 */}
                    <div className={styles.avatarMessageSender}>
                      <img src={msg.sender.avatar || "/placeholder.svg"} alt={msg.sender.name} className={styles.avatarImage} />
                      <div className={styles.avatarFallbackMessageSender}>{msg.sender.name.charAt(0)}</div>
                    </div>
                    <div className={styles.messageContentWrapper}>
                      <div className={styles.messageSenderDetails}>
                        <span className={styles.messageSenderName}>{msg.sender.name}</span>
                        <div
                          className={`${styles.senderRank} ${
                            msg.sender.rank === "S"
                              ? styles.rankS
                              : msg.sender.rank === "A"
                              ? styles.rankA
                              : msg.sender.rank === "B"
                              ? styles.rankB
                              : styles.rankC
                          }`}
                        >
                          {msg.sender.rank}
                        </div>
                        {msg.sender.role === "moderator" && (
                          <FaCrown className={styles.moderatorIcon} title="モデレーター" />
                        )}
                        {getMessageTypeLabel(msg.type) && (
                          <span className={styles.messageTypeLabel}>
                            {getMessageTypeLabel(msg.type)}
                          </span>
                        )}
                        {msg.isPinned && <HiOutlineMapPin className={styles.pinnedIcon} title="ピン留め" />}
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
                      sendMessage()
                    }
                  }}
                  className={styles.messageTextarea}
                  rows={1}
                />
                <button onClick={sendMessage} disabled={!message.trim()} className={styles.primaryButton}>
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
                <p className={styles.cardDescription}>{group.description}</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>カテゴリ</span>
                  <span className={styles.groupCategoryChip}>{group.category}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>メンバー数</span>
                  <span className={styles.detailTextMuted}>{group.memberCount}人</span>
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
                  {group.members.map((member, index) => (
                    <div key={index} className={styles.memberItem}>
                      <div className={styles.avatarWrapperMember}>
                        <div className={styles.avatarMember}>
                          <img src={member.avatar || "/placeholder.svg"} alt={member.name} className={styles.avatarImage} />
                          <div className={styles.avatarFallbackMember}>{member.name.charAt(0)}</div>
                        </div>
                        {member.isOnline && (
                          <div className={styles.onlineIndicatorMember} />
                        )}
                      </div>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberDetails}>
                          <span className={styles.memberName}>{member.name}</span>
                          <div
                            className={`${styles.senderRank} ${
                              member.rank === "S"
                                ? styles.rankS
                                : member.rank === "A"
                                ? styles.rankA
                                : member.rank === "B"
                                ? styles.rankB
                                : styles.rankC
                            }`}
                          >
                            {member.rank}
                          </div>
                          {member.role === "moderator" && (
                            <FaCrown className={styles.moderatorIconSmall} title="モデレーター" />
                          )}
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