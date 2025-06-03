"use client"

import { useState } from "react"
import { HiOutlineArrowLeft,  HiOutlineCodeBracket, HiOutlinePaperClip, HiOutlineStar, HiOutlineEllipsisVertical, HiOutlineDocumentText } from "react-icons/hi2"; // Heroicons v2
import {  FaPaperPlane } from "react-icons/fa"; // Font Awesome

import styles from "./UserChatPage.module.css"

export default function IndividualChatPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "mentor",
      content: "こんにちは！React の学習でお困りのことがあるとお聞きしました。どのような点でお悩みでしょうか？",
      timestamp: "14:30",
      type: "text",
    },
    {
      id: "2",
      sender: "user",
      content: "useEffect の依存配列について理解できていません。無限ループが発生してしまうことがあります。",
      timestamp: "14:32",
      type: "text",
    },
    {
      id: "3",
      sender: "mentor",
      content: "useEffect の依存配列は重要なポイントですね。具体的にどのようなコードで問題が発生していますか？",
      timestamp: "14:33",
      type: "text",
    },
    {
      id: "4",
      sender: "user",
      content: `useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const result = await response.json();
    setData(result);
  };
  fetchData();
}, []);`,
      timestamp: "14:35",
      type: "code",
      language: "javascript",
    },
    {
      id: "5",
      sender: "mentor",
      content:
        "コードを見せていただき、ありがとうございます。このコード自体は問題ないように見えますが、無限ループが発生する原因はいくつか考えられます。",
      timestamp: "14:37",
      type: "text",
    },
    {
      id: "6",
      sender: "mentor",
      content: `無限ループの主な原因：

1. **Strict Mode の影響**: React 18 の開発環境では、コンポーネントが二回マウントされることがあります。

2. **外部での状態更新**: コンポーネントの外部で何かが状態を更新している可能性があります。

3. **依存配列の設定ミス**: 依存配列に含めるべき値が漏れている場合があります。

まずは以下を確認してみてください：`,
      timestamp: "14:38",
      type: "text",
    },
    {
      id: "7",
      sender: "mentor",
      content: `useEffect(() => {
  let isMounted = true;
 
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      if (isMounted) {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  fetchData();
 
  return () => {
    isMounted = false;
  };
}, []);`,
      timestamp: "14:40",
      type: "code",
      language: "javascript",
    },
  ])

  // ドロップダウンメニューの開閉状態を管理するためのuseState
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const mentor = {
    id: params.id,
    name: "田中さん",
    rank: "S",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "アルゴリズム、React専門",
    isOnline: true,
    rating: 4.8,
    responseTime: "平均15分",
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "user" as const,
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text" as const,
      }
      setMessages([...messages, newMessage])
      setMessage("")

      // メンターからの自動返信をシミュレート
      setTimeout(() => {
        const mentorReply = {
          id: (Date.now() + 1).toString(),
          sender: "mentor" as const,
          content: "ありがとうございます。確認させていただきますね。",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text" as const,
        }
        setMessages((prev) => [...prev, mentorReply])
      }, 1000)
    }
  }

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
              <div className={styles.mentorInfoInHeader}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarSmall}>
                    <img src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} className={styles.avatarImage} />
                    <div className={styles.avatarFallback}>{mentor.name.charAt(0)}</div>
                  </div>
                  {mentor.isOnline && (
                    <div className={styles.onlineIndicatorSmall} />
                  )}
                </div>
                <div>
                  <div className={styles.mentorRankRow}>
                    <h1 className={styles.mentorNameHeader}>{mentor.name}</h1>
                    <div
                      className={`${styles.mentorRank} ${
                        mentor.rank === "S" ? styles.rankS : mentor.rank === "A" ? styles.rankA : styles.rankB
                      }`}
                    >
                      {mentor.rank}
                    </div>
                  </div>
                  <p className={styles.mentorSpecialtyHeader}>{mentor.specialty}</p>
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
                    <HiOutlineStar className={styles.dropdownMenuItemIcon} />
                    メンターを評価
                  </button>
                  <button className={styles.dropdownMenuItem} onClick={() => setIsDropdownOpen(false)}>
                    <HiOutlineDocumentText className={styles.dropdownMenuItemIcon} />
                    チャット履歴をエクスポート
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
                <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === "user" ? styles.messageUser : styles.messageMentor}`}>
                  <div className={`${styles.messageBubbleContainer} ${msg.sender === "user" ? styles.messageBubbleUserOrder : styles.messageBubbleMentorOrder}`}>
                    {msg.sender === "mentor" && (
                      <div className={styles.mentorAvatarInMessage}>
                        <div className={styles.avatarMini}>
                          <img src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} className={styles.avatarImage} />
                          <div className={styles.avatarFallbackMini}>{mentor.name.charAt(0)}</div>
                        </div>
                        <span className={styles.mentorNameMini}>{mentor.name}</span>
                      </div>
                    )}
                    <div
                      className={`${styles.messageBubble} ${
                        msg.sender === "user"
                          ? styles.messageBubblePrimary
                          : msg.type === "code"
                          ? styles.messageBubbleCode
                          : styles.messageBubbleMuted
                      }`}
                    >
                      {msg.type === "code" ? (
                        <div>
                          <div className={styles.codeHeader}>
                            <HiOutlineCodeBracket className={styles.codeIcon} />
                            <span className={styles.codeLanguage}>{msg.language}</span>
                          </div>
                          <pre className={styles.codeBlock}>
                            <code>{msg.content}</code>
                          </pre>
                        </div>
                      ) : (
                        <p className={styles.messageText}>{msg.content}</p>
                      )}
                    </div>
                    <div className={`${styles.messageTimestamp} ${msg.sender === "user" ? styles.messageTimestampUser : ""}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* メッセージ入力エリア */}
            <div className={styles.messageInputArea}>
              <div className={styles.messageInputWrapper}>
                <button className={styles.outlineIconButton}>
                  <HiOutlinePaperClip className={styles.iconSmall} />
                </button>
                <button className={styles.outlineIconButton}>
                  <HiOutlineCodeBracket className={styles.iconSmall} />
                </button>
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
                  rows={1} // 初期行数を設定
                />
                <button onClick={sendMessage} disabled={!message.trim()} className={styles.primaryButton}>
                  <FaPaperPlane className={styles.iconSmall} />
                </button>
              </div>
            </div>
          </div>

          {/* 右サイドバー (メンター情報) */}
          <div className={styles.sidebar}>
            {/* Cardコンポーネントの代わりにdivを使用 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>メンター情報</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.mentorInfoBlock}>
                  <div className={styles.avatarLarge}>
                    <img src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} className={styles.avatarImage} />
                    <div className={styles.avatarFallbackLarge}>{mentor.name.charAt(0)}</div>
                  </div>
                  <div>
                    <div className={styles.mentorRankRow}>
                      <h3 className={styles.mentorNameSidebar}>{mentor.name}</h3>
                      <div
                        className={`${styles.mentorRank} ${
                          mentor.rank === "S" ? styles.rankS : mentor.rank === "A" ? styles.rankA : styles.rankB
                        }`}
                      >
                        {mentor.rank}
                      </div>
                    </div>
                    <p className={styles.mentorSpecialtySidebar}>{mentor.specialty}</p>
                  </div>
                </div>
                <div className={styles.mentorDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>評価</span>
                    <div className={styles.detailValue}>
                      <HiOutlineStar className={styles.starIcon} />
                      <span className={styles.detailText}>{mentor.rating}</span>
                    </div>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>返信時間</span>
                    <span className={styles.detailTextMuted}>{mentor.responseTime}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>ステータス</span>
                    <div className={styles.detailValue}>
                      <div className={styles.onlineIndicatorMini} />
                      <span className={styles.detailTextMuted}>オンライン</span>
                    </div>
                  </div>
                </div>
                <button className={`${styles.outlineButton} ${styles.fullWidthButton}`}>
                  <HiOutlineStar className={styles.buttonIcon} />
                  メンターを評価
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}