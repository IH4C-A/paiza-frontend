"use client"

import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineUserGroup, HiOutlineArrowLeft, HiOutlineUser, HiOutlineUsers } from "react-icons/hi2"; // Heroicons v2
// Import the CSS module
import styles from "./ChatsPage.module.css"
import { useMemo, useState } from "react"
import { useUsers } from "../../hooks/useUser";
import { useChatHistory } from "../../hooks/useChat";
import { useMyGroupChats } from "../../hooks/useGroupChat";
import type { ChatUsers } from "../../types/chatsType";
import type { User } from "../../types/userTypes";
import { useCreateGroupChat } from "../../hooks/useGroupChat";
import { useMyMentors } from "../../hooks";

export default function ChatsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'main' | 'selectIndividual' | 'createGroup'>('main');
  const { users } = useUsers();
  const { chatHistory } = useChatHistory();
  const { myGroupChats } = useMyGroupChats();
  const { createGroupChat } = useCreateGroupChat();
  const { mymentors } = useMyMentors();

  console.log(mymentors)


  // チャット検索
  const [searchQuery, setSearchQuery] = useState('');

    // 個別チャット履歴を検索クエリでフィルタリング
  const filteredIndividualChats = useMemo(() => {
    if (!searchQuery) {
      return chatHistory;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return chatHistory.filter(chat =>
      chat.user_name.toLowerCase().includes(lowerCaseQuery) ||
      (chat.last_message && chat.last_message.toLowerCase().includes(lowerCaseQuery))
    );
  }, [chatHistory, searchQuery]);

  // グループチャット履歴を検索クエリでフィルタリング
  const filteredGroupChats = useMemo(() => {
    if (!searchQuery) {
      return myGroupChats;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return myGroupChats.filter(chat =>
      chat.group_name.toLowerCase().includes(lowerCaseQuery) ||
      (chat.description && chat.description.toLowerCase().includes(lowerCaseQuery)) ||
      (chat.last_message && chat.last_message.toLowerCase().includes(lowerCaseQuery))
    );
  }, [myGroupChats, searchQuery]);


  // Tabsの切り替え状態を管理するためのuseState
  // 今回はUIライブラリのTabsコンポーネントを使用しないため、自前で状態を管理します
  const [activeTab, setActiveTab] = useState("individual");

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    // setModalView('main'); // モーダルを閉じるときにビューをリセットしても良いが、今回は開くときにリセット
  }


  // グループ作成フォームのState (簡易版)
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

    // 新しいstate: グループに追加するメンバーのIDを管理
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  // メンバー選択のハンドラー
  const handleMemberSelect = (userId: string) => {
    setSelectedGroupMembers((prevSelectedMembers) =>
      prevSelectedMembers.includes(userId)
        ? prevSelectedMembers.filter((id) => id !== userId) // 既に選択されていれば削除
        : [...prevSelectedMembers, userId] // 選択されていなければ追加
    );
  };

  // 選択されたメンバーの名前を取得
  const getSelectedMemberNames = () => {
    return selectedGroupMembers.map(memberId => {
      const user = users.find(u => u.user_id === memberId);
      return user ? user.first_name : '';
    }).filter(Boolean).join(', '); // 存在しないユーザー名をフィルタリングして結合
  };
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
                <input type="search" placeholder="チャットを検索..." className={styles.searchInput} value={searchQuery} // ★ ここに value プロパティを追加
                  onChange={(e) => setSearchQuery(e.target.value)}  />
              </div>
              {/* ボタンは既存のUIライブラリのButtonコンポーネントに依存しないように変更 */}
              <button className={styles.primaryButton} onClick={() => setIsModalOpen(true)}>
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
                  {filteredIndividualChats.map((chat: ChatUsers) => (
                    // Cardコンポーネントの代わりにdivを使用
                    <div key={chat.user_id} className={styles.chatCard}>
                      <a href={`/chats/${chat.user_id}`} className={styles.cardLink}>
                        <div className={styles.cardContent}>
                          <div className={styles.chatItem}>
                            <div className={styles.avatarWrapper}>
                              {/* Avatarコンポーネントの代わりにimgとdivを使用 */}
                              <div className={styles.avatar}>
                                <img src={chat.profile_image || "/placeholder.svg"} alt={chat.user_name} className={styles.avatarImage} />
                                <div className={styles.avatarFallback}>{chat.user_name}</div>
                              </div>
                              {/* {chat.isOnline && (
                                <div className={styles.onlineIndicator} />
                              )} */}
                            </div>
                            <div className={styles.chatInfo}>
                              <div className={styles.mentorHeader}>
                                <h3 className={styles.mentorName}>{chat.user_name}</h3>
                                {/* <div
                                  className={`${styles.mentorRank} ${chat.mentor.rank === "S" ? styles.rankS : chat.mentor.rank === "A" ? styles.rankA : styles.rankB
                                    }`}
                                >
                                  {chat.mentor.rank}
                                </div> */}
                              </div>
                              {/* <p className={styles.mentorSpecialty}>{chat.mentor.specialty}</p> */}
                              <p className={styles.lastMessage}>{chat.last_message}</p>
                            </div>
                            <div className={styles.chatMeta}>
                              <span className={styles.timestamp}>{chat.last_chat_at instanceof Date ? chat.last_chat_at.toLocaleString() : chat.last_chat_at}</span>
                              {chat.unread_count > 0 && (
                                <div className={styles.unreadBadge}>
                                  {chat.unread_count}
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
                  {filteredGroupChats.map((chat) => (
                    // Cardコンポーネントの代わりにdivを使用
                    <div key={chat.group_id} className={styles.chatCard}>
                      <a href={`/group/${chat.group_id}`} className={styles.cardLink}>
                        <div className={styles.cardContent}>
                          <div className={styles.chatItem}>
                            <div className={styles.groupIconWrapper}>
                              <HiOutlineUserGroup className={styles.groupIcon} />
                            </div>
                            <div className={styles.chatInfo}>
                              <div className={styles.groupHeader}>
                                <h3 className={styles.groupName}>{chat.group_name}</h3>
                                <span className={styles.groupCategory}>
                                  {chat.category?.category_name}
                                </span>
                              </div>
                              <p className={styles.groupDescription}>{chat.description}</p>
                              <p className={styles.lastMessage}>{chat.last_message}</p>
                            </div>
                            <div className={styles.chatMeta}>
                              <div className={styles.memberCount}>
                                <HiOutlineUserGroup className={styles.memberCountIcon} />
                                <span className={styles.memberCountText}>{chat.member_count}</span>
                              </div>
                              <span className={styles.timestamp}>{chat.created_at instanceof Date ? chat.created_at.toLocaleString() : chat.created_at}</span>
                              {chat.unread_count > 0 && (
                                <div className={styles.unreadBadge}>
                                  {chat.unread_count}
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

      {/* モーダルウィンドウ */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* メインビュー */}
            {modalView === 'main' && (
              <>
                <h2 className={styles.modalTitle}>新しいチャットを作成</h2>
                <p className={styles.modalDescription}>作成したいチャットの種類を選択してください。</p>

                <div className={styles.modalOptions}>
                  <button className={styles.modalOptionButton} onClick={() => setModalView('selectIndividual')}>
                    <div className={styles.modalOptionIconWrapper}>
                      <HiOutlineUser className={styles.modalOptionIcon} />
                    </div>
                    <h3 className={styles.modalOptionTitle}>個人チャット</h3>
                    <p className={styles.modalOptionDescription}>特定のメンターとの個別相談を開始します。</p>
                  </button>
                  <button className={styles.modalOptionButton} onClick={() => setModalView('createGroup')}>
                    <div className={styles.modalOptionIconWrapper}>
                      <HiOutlineUsers className={styles.modalOptionIcon} />
                    </div>
                    <h3 className={styles.modalOptionTitle}>グループチャット</h3>
                    <p className={styles.modalOptionDescription}>複数の学習者やメンターと共同で議論します。</p>
                  </button>
                </div>

                <button className={styles.modalCloseButton} onClick={closeModal}>
                  閉じる
                </button>
              </>
            )}

            {/* 個人チャット - メンバー選択画面 */}
            {modalView === 'selectIndividual' && (
              <>
                <div className={styles.modalHeaderWithBack}>
                  <button className={styles.modalBackButton} onClick={() => setModalView('main')}>
                    <HiOutlineArrowLeft className={styles.iconSmall} />
                  </button>
                  <h2 className={styles.modalTitle}>メンターを選択</h2>
                </div>
                <p className={styles.modalDescription}>相談したいメンターを選択してください。</p>
                <div className={styles.mentorSelectionList}>
                  {mymentors?.mentorships.map(mentor => (
                    <a href={`/chats/${mentor.user.user_id}`} key={mentor.user.user_id} className={styles.mentorSelectionItem} onClick={closeModal}>
                      <div className={styles.avatarWrapper}>
                        <div className={styles.avatarMini}>
                          <img src={mentor.user?.profile_image || ""} alt={mentor.user?.first_name} className={styles.avatarImage} />
                          <div className={styles.avatarFallbackMini}>{mentor.user?.first_name.charAt(0)}</div>
                        </div>
                        {/* {mentor.isOnline && <div className={styles.onlineIndicatorMini} />} */}
                      </div>
                      <div className={styles.mentorSelectionInfo}>
                        <span className={styles.mentorSelectionName}>{mentor.user?.first_name}</span>
                        {/* <span className={styles.mentorSelectionSpecialty}>{mentor.specialty}</span> */}
                      </div>
                    </a>
                  ))}
                </div>
                <button className={styles.modalCloseButton} onClick={closeModal}>
                  キャンセル
                </button>
              </>
            )}

           {/* グループチャット - グループ作成画面 */}
            {modalView === 'createGroup' && (
              <form encType="multipart/form-data">
                <div className={styles.modalHeaderWithBack}>
                  <button className={styles.modalBackButton} onClick={() => setModalView('main')}>
                    <HiOutlineArrowLeft className={styles.iconSmall} />
                  </button>
                  <h2 className={styles.modalTitle}>グループチャットを作成</h2>
                </div>
                <p className={styles.modalDescription}>新しいグループの情報を入力し、メンバーを選択してください。</p>
                <div className={styles.formGroup}>
                  <label htmlFor="groupName" className={styles.formLabel}>グループ名</label>
                  <input
                    type="text"
                    id="groupName"
                    className={styles.formInput}
                    placeholder="例: React学習会"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="groupDescription" className={styles.formLabel}>説明</label>
                  <textarea
                    id="groupDescription"
                    className={styles.formTextarea}
                    placeholder="グループの目的や内容を記述してください"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* メンバー選択セクションの追加 */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>メンバーを選択</label>
                  <div className={styles.memberSelectionList}>
                    {users.map((user: User) => (
                      <div key={user.user_id} className={styles.memberSelectionItem}>
                        <input
                          type="checkbox"
                          id={`user-${user.user_id}`}
                          checked={selectedGroupMembers.includes(user.user_id)}
                          onChange={() => handleMemberSelect(user.user_id)}
                          className={styles.checkbox}
                        />
                        <label htmlFor={`user-${user.user_id}`} className={styles.memberLabel}>
                          <div className={styles.avatarMini}>
                            <img src={user.profile_image || ""} alt={user.first_name} className={styles.avatarImage} />
                            <div className={styles.avatarFallbackMini}>{user.first_name.charAt(0)}</div>
                          </div>
                          <span className={styles.memberSelectionName}>{user.first_name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedGroupMembers.length > 0 && (
                    <p className={styles.selectedMembersText}>
                      選択中のメンバー: {getSelectedMemberNames()}
                    </p>
                  )}
                </div>


                <button
                  className={styles.primaryButton}
                  onClick={() => {
                    if (!newGroupName.trim()) {
                      alert("グループ名を入力してください。");
                      return;
                    }
                    if (selectedGroupMembers.length === 0) {
                      alert("グループにメンバーを一人以上選択してください。");
                      return;
                    }
                    alert(`グループ「${newGroupName}」を作成します。\n説明: ${newGroupDescription}\nメンバー: ${getSelectedMemberNames()}`);
                    // TODO: 実際のグループ作成API呼び出しロジック
                    // ここで newGroupName, newGroupDescription, selectedGroupMembers をAPIに送信
                    createGroupChat(newGroupName,newGroupDescription,selectedGroupMembers);
                    closeModal();
                  }}
                  disabled={!newGroupName.trim() || selectedGroupMembers.length === 0} // グループ名とメンバーが選択されていないとボタンを無効化
                >
                  グループを作成
                </button>
                <button className={styles.modalCloseButton} onClick={closeModal}>
                  キャンセル
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}