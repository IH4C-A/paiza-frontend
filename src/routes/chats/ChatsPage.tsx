"use client"

import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineUserGroup } from "react-icons/hi2"; // Heroicons v2
// Import the CSS module
import styles from "./ChatsPage.module.css"
import { useState } from "react"

export default function ChatsPage() {
  const individualChats = [
    {
      id: "1",
      mentor: {
        name: "田中さん",
        rank: "S",
        avatar: "/placeholder.svg?height=40&width=40",
        specialty: "アルゴリズム、React",
      },
      lastMessage: "二分探索の実装について、もう少し詳しく説明しますね。",
      timestamp: "2分前",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      mentor: {
        name: "佐藤さん",
        rank: "A",
        avatar: "/placeholder.svg?height=40&width=40",
        specialty: "UI/UX、Vue.js",
      },
      lastMessage: "レスポンシブデザインの件、理解できましたか？",
      timestamp: "1時間前",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "3",
      mentor: {
        name: "鈴木さん",
        rank: "A",
        avatar: "/placeholder.svg?height=40&width=40",
        specialty: "情報処理試験、DB",
      },
      lastMessage: "データベース正規化の課題、お疲れ様でした！",
      timestamp: "3時間前",
      unreadCount: 1,
      isOnline: true,
    },
  ]

  const groupChats = [
    {
      id: "1",
      name: "React初心者の会",
      description: "React学習者同士で質問・情報共有",
      memberCount: 24,
      lastMessage: "useEffectの依存配列について質問があります",
      timestamp: "5分前",
      unreadCount: 3,
      category: "Webフレームワーク",
    },
    {
      id: "2",
      name: "アルゴリズム勉強会",
      description: "競技プログラミング・アルゴリズム学習",
      memberCount: 18,
      lastMessage: "今度の勉強会の日程を決めましょう",
      timestamp: "30分前",
      unreadCount: 0,
      category: "アルゴリズム",
    },
    {
      id: "3",
      name: "UI/UXデザイン研究室",
      description: "デザインの知見共有とフィードバック",
      memberCount: 31,
      lastMessage: "新しいデザインツールについて教えてください",
      timestamp: "2時間前",
      unreadCount: 5,
      category: "UI/UX",
    },
    {
      id: "4",
      name: "情報処理試験対策",
      description: "基本情報・応用情報技術者試験の対策",
      memberCount: 42,
      lastMessage: "過去問の解説をお願いします",
      timestamp: "4時間前",
      unreadCount: 1,
      category: "情報処理試験",
    },
  ]

  // Tabsの切り替え状態を管理するためのuseState
  // 今回はUIライブラリのTabsコンポーネントを使用しないため、自前で状態を管理します
  const [activeTab, setActiveTab] = useState("individual");

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>チャット</h1>
              <p className={styles.pageDescription}>メンターとの個別相談やグループディスカッションができます</p>
            </div>
            <div className={styles.searchNewChat}>
              <div className={styles.searchInputWrapper}>
                <HiOutlineMagnifyingGlass className={styles.searchIcon} />
                {/* Inputは既存のUIライブラリのInputコンポーネントに依存しないように変更 */}
                <input type="search" placeholder="チャットを検索..." className={styles.searchInput} />
              </div>
              {/* ボタンは既存のUIライブラリのButtonコンポーネントに依存しないように変更 */}
              <button className={styles.primaryButton}>
                <HiOutlinePlus className={styles.buttonIcon} />
                新しいチャット
              </button>
            </div>
          </div>
          {/* Tabsコンポーネントの代わりにdivとbuttonでタブを実装 */}
          <div className={styles.tabsRoot}>
            <div className={styles.tabsList}>
              <button
                className={`${styles.tabsTrigger} ${activeTab === "individual" ? styles.tabsTriggerActive : ""}`}
                onClick={() => setActiveTab("individual")}
              >
                個別チャット
              </button>
              <button
                className={`${styles.tabsTrigger} ${activeTab === "group" ? styles.tabsTriggerActive : ""}`}
                onClick={() => setActiveTab("group")}
              >
                グループチャット
              </button>
            </div>

            {activeTab === "individual" && (
              <div className={styles.tabContent}>
                <div className={styles.chatGrid}>
                  {individualChats.map((chat) => (
                    // Cardコンポーネントの代わりにdivを使用
                    <div key={chat.id} className={styles.chatCard}>
                      <a href={`/chats/${chat.id}`} className={styles.cardLink}>
                        <div className={styles.cardContent}>
                          <div className={styles.chatItem}>
                            <div className={styles.avatarWrapper}>
                              {/* Avatarコンポーネントの代わりにimgとdivを使用 */}
                              <div className={styles.avatar}>
                                <img src={chat.mentor.avatar || "/placeholder.svg"} alt={chat.mentor.name} className={styles.avatarImage} />
                                <div className={styles.avatarFallback}>{chat.mentor.name.charAt(0)}</div>
                              </div>
                              {chat.isOnline && (
                                <div className={styles.onlineIndicator} />
                              )}
                            </div>
                            <div className={styles.chatInfo}>
                              <div className={styles.mentorHeader}>
                                <h3 className={styles.mentorName}>{chat.mentor.name}</h3>
                                <div
                                  className={`${styles.mentorRank} ${chat.mentor.rank === "S" ? styles.rankS : chat.mentor.rank === "A" ? styles.rankA : styles.rankB
                                    }`}
                                >
                                  {chat.mentor.rank}
                                </div>
                              </div>
                              <p className={styles.mentorSpecialty}>{chat.mentor.specialty}</p>
                              <p className={styles.lastMessage}>{chat.lastMessage}</p>
                            </div>
                            <div className={styles.chatMeta}>
                              <span className={styles.timestamp}>{chat.timestamp}</span>
                              {chat.unreadCount > 0 && (
                                <div className={styles.unreadBadge}>
                                  {chat.unreadCount}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "group" && (
              <div className={styles.tabContent}>
                <div className={styles.chatGrid}>
                  {groupChats.map((chat) => (
                    // Cardコンポーネントの代わりにdivを使用
                    <div key={chat.id} className={styles.chatCard}>
                      <a href={`/group/${chat.id}`} className={styles.cardLink}>
                        <div className={styles.cardContent}>
                          <div className={styles.chatItem}>
                            <div className={styles.groupIconWrapper}>
                              <HiOutlineUserGroup className={styles.groupIcon} />
                            </div>
                            <div className={styles.chatInfo}>
                              <div className={styles.groupHeader}>
                                <h3 className={styles.groupName}>{chat.name}</h3>
                                <span className={styles.groupCategory}>
                                  {chat.category}
                                </span>
                              </div>
                              <p className={styles.groupDescription}>{chat.description}</p>
                              <p className={styles.lastMessage}>{chat.lastMessage}</p>
                            </div>
                            <div className={styles.chatMeta}>
                              <div className={styles.memberCount}>
                                <HiOutlineUserGroup className={styles.memberCountIcon} />
                                <span className={styles.memberCountText}>{chat.memberCount}</span>
                              </div>
                              <span className={styles.timestamp}>{chat.timestamp}</span>
                              {chat.unreadCount > 0 && (
                                <div className={styles.unreadBadge}>
                                  {chat.unreadCount}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div> {/* End of Tabs Root */}
        </div>
      </main>
    </div>
  )
}