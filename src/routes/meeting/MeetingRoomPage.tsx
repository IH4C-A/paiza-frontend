"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
// react-icons から必要なアイコンをインポート
import {
  FaArrowLeft,
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaDesktop,
  FaTimes, // PhoneOff の代替
  FaCog, // Settings
  FaUsers,
  FaShareAlt,
  FaCode,
  FaCopy,
  FaDownload,
  FaEllipsisV, // MoreVertical
} from "react-icons/fa"

import styles from './MeetingRoomPage.module.css'; // module.css をインポート

// 面談情報のモックデータ (変更なし)
const meetingData = {
  "1": {
    id: "1",
    title: "Reactのパフォーマンス最適化について",
    mentorId: "1",
    mentorName: "田中 太郎",
    mentorAvatar: "/placeholder.svg?height=40&width=40",
    mentorRank: "S",
    studentName: "山田 花子",
    studentAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-06-17",
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    status: "active",
    roomId: "paiza-nurture-meeting-1",
    participants: [
      {
        id: "mentor-1",
        name: "田中 太郎",
        role: "mentor",
        avatar: "/placeholder.svg?height=32&width=32",
        isOnline: true,
      },
      {
        id: "student-1",
        name: "山田 花子",
        role: "student",
        avatar: "/placeholder.svg?height=32&width=32",
        isOnline: true,
      },
    ],
    sharedCode: `// React パフォーマンス最適化の例
import React, { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  // 重い計算をメモ化
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }));
  }, [data]);

  // コールバック関数をメモ化
  const handleClick = useCallback((id) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}: {item.processed}
        </div>
      ))}
    </div>
  );
});

function expensiveCalculation(item) {
  // 重い計算処理
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += item.value * Math.random();
  }
  return result;
}

export default ExpensiveComponent;`,
    notes: [],
    startedAt: new Date().toISOString(),
  },
}

// Jitsi Meet API の型定義 (変更なし)
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function MeetingRoomPage() {
  const params = useParams()
  const meetingId = params.id as string
  const meeting = meetingData[meetingId as keyof typeof meetingData]

  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const [jitsiApi, setJitsiApi] = useState<any>(null)
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [sharedCode, setSharedCode] = useState(meeting?.sharedCode || "")
  const [notes, setNotes] = useState("")
  const [newNote, setNewNote] = useState("")
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [meetingDuration, setMeetingDuration] = useState(0)
  // ドロップダウンメニューの状態管理
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ミーティング時間の計算 (変更なし)
  useEffect(() => {
    if (!meeting?.startedAt) return

    const interval = setInterval(() => {
      const startTime = new Date(meeting.startedAt).getTime()
      const currentTime = new Date().getTime()
      const duration = Math.floor((currentTime - startTime) / 1000)
      setMeetingDuration(duration)
    }, 1000)

    return () => clearInterval(interval)
  }, [meeting?.startedAt])

  // Jitsi Meet の初期化 (変更なし)
  useEffect(() => {
    if (!meeting || isJitsiLoaded) return

    const script = document.createElement("script")
    script.src = "https://meet.jit.si/external_api.js"
    script.async = true
    script.onload = () => {
      initializeJitsi()
    }
    document.head.appendChild(script)

    return () => {
      if (jitsiApi) {
        jitsiApi.dispose()
      }
      document.head.removeChild(script)
    }
  }, [meeting])

  const initializeJitsi = () => {
    if (!jitsiContainerRef.current || !meeting) return

    const domain = "meet.jit.si"
    const options = {
      roomName: meeting.roomId,
      width: "100%",
      height: "100%",
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        enableClosePage: false,
        prejoinPageEnabled: false,
        disableInviteFunctions: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "closedcaptions",
          "desktop",
          "fullscreen",
          "fodeviceselection",
          "hangup",
          "profile",
          "chat",
          "recording",
          "livestreaming",
          "etherpad",
          "sharedvideo",
          "settings",
          "raisehand",
          "videoquality",
          "filmstrip",
          "invite",
          "feedback",
          "stats",
          "shortcuts",
          "tileview",
          "videobackgroundblur",
          "download",
          "help",
          "mute-everyone",
        ],
        SETTINGS_SECTIONS: ["devices", "language", "moderator", "profile", "calendar"],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
      userInfo: {
        displayName: "あなた", // 実際の実装では現在のユーザー名を使用
      },
    }

    const api = new window.JitsiMeetExternalAPI(domain, options)

    api.addEventListener("ready", () => {
      setIsJitsiLoaded(true)
      console.log("Jitsi Meet is ready")
    })

    api.addEventListener("audioMuteStatusChanged", (event: any) => {
      setIsMuted(event.muted)
    })

    api.addEventListener("videoMuteStatusChanged", (event: any) => {
      setIsVideoOff(event.muted)
    })

    api.addEventListener("screenSharingStatusChanged", (event: any) => {
      setIsScreenSharing(event.on)
    })

    api.addEventListener("participantJoined", (event: any) => {
      console.log("Participant joined:", event)
    })

    api.addEventListener("participantLeft", (event: any) => {
      console.log("Participant left:", event)
    })

    setJitsiApi(api)
  }

  // ドロップダウンメニューの外部クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 音声のミュート/ミュート解除 (変更なし)
  const toggleMute = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleAudio")
    }
  }

  // ビデオのオン/オフ (変更なし)
  const toggleVideo = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleVideo")
    }
  }

  // 画面共有の開始/停止 (変更なし)
  const toggleScreenShare = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleShareScreen")
    }
  }

  // ミーティング終了 (変更なし)
  const endMeeting = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("hangup")
    }
    setShowEndDialog(false)
    // 実際の実装では、面談終了の処理を行う
  }

  // コードをクリップボードにコピー (変更なし)
  const copyCode = () => {
    navigator.clipboard.writeText(sharedCode)
  }

  // ノートを追加 (変更なし)
  const addNote = () => {
    if (newNote.trim()) {
      const timestamp = new Date().toLocaleTimeString()
      setNotes((prev) => prev + `[${timestamp}] ${newNote}\n`)
      setNewNote("")
    }
  }

  // 時間をフォーマット (変更なし)
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  if (!meeting) {
    return (
      <div className={styles.pageContainer}> {/* styles.pageContainer を適用 */}
        <div className={styles.noMeetingFound}> {/* 新しいスタイルクラス */}
          <h1 className={styles.noMeetingTitle}>ミーティングが見つかりません</h1> {/* 新しいスタイルクラス */}
          <p className={styles.noMeetingDescription}>指定されたミーティングは存在しないか、終了しています。</p> {/* 新しいスタイルクラス */}
          <a href="/mentors/schedule" className={`${styles.buttonBase} ${styles.buttonPrimary}`}> {/* styles.buttonPrimary を適用 */}
            <FaArrowLeft className="h-4 w-4 mr-1" /> {/* react-icons に変更 */}
            スケジュール一覧に戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <a href="/mentors/schedule" className={styles.backButton}>
            <FaArrowLeft className="h-4 w-4" /> {/* react-icons に変更 */}
            戻る
          </a>
          <div>
            <h1 className={styles.meetingTitle}>{meeting.title}</h1>
            <p className={styles.meetingTime}>
              {meeting.date} {meeting.startTime} - {meeting.endTime}
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.durationText}>
            <span className={styles.durationLabel}>経過時間:</span> {formatDuration(meetingDuration)}
          </div>
          <div className={styles.participantsListHeader}>
            {meeting.participants.map((participant) => (
              <div key={participant.id} className={styles.participantAvatarContainer}>
                <div className={styles.participantAvatar}>
                  <img src={participant.avatar || "/placeholder.svg"} alt={participant.name} className={styles.avatarImage} />
                  <div className={styles.avatarFallback}>{participant.name.charAt(0)}</div>
                </div>
                {participant.isOnline && <div className={styles.onlineIndicator} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.videoPanel}>
          {/* Jitsi Meet コンテナ */}
          <div ref={jitsiContainerRef} className={styles.jitsiContainer} />
          {!isJitsiLoaded && (
            <div className={styles.jitsiLoadingOverlay}>
              <div className={styles.loadingText}>
                <div className={styles.spinner} />
                <p>ミーティングルームに接続中...</p>
              </div>
            </div>
          )}
        </div>

        {/* コントロールバー */}
        <div className={styles.controlBar}>
          <div className={styles.controlButtons}>
            <button
              className={`${styles.buttonBase} ${isMuted ? styles.buttonDestructive : styles.buttonSecondary}`}
              onClick={toggleMute}
            >
              {isMuted ? <FaMicrophoneSlash className={styles.buttonIcon} /> : <FaMicrophone className={styles.buttonIcon} />}
              <span className={styles.srOnly}>{isMuted ? "ミュート解除" : "ミュート"}</span>
            </button>

            <button
              className={`${styles.buttonBase} ${isVideoOff ? styles.buttonDestructive : styles.buttonSecondary}`}
              onClick={toggleVideo}
            >
              {isVideoOff ? <FaVideoSlash className={styles.buttonIcon} /> : <FaVideo className={styles.buttonIcon} />}
              <span className={styles.srOnly}>{isVideoOff ? "ビデオオン" : "ビデオオフ"}</span>
            </button>

            <button
              className={`${styles.buttonBase} ${isScreenSharing ? styles.buttonDefault : styles.buttonSecondary}`}
              onClick={toggleScreenShare}
            >
              <FaDesktop className={styles.buttonIcon} />
              <span className={styles.srOnly}>{isScreenSharing ? "画面共有停止" : "画面共有"}</span>
            </button>

            <button
              className={`${styles.buttonBase} ${styles.buttonDestructive}`}
              onClick={() => setShowEndDialog(true)}
            >
              <FaTimes className={styles.buttonIcon} /> {/* PhoneOff の代替 */}
              <span className={styles.srOnly}>ミーティング終了</span>
            </button>

            {/* DropdownMenu の置き換え */}
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              <button
                className={`${styles.buttonBase} ${styles.buttonSecondary} ${styles.dropdownTrigger}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaEllipsisV className={styles.buttonIcon} /> {/* MoreVertical の代替 */}
                <span className={styles.srOnly}>その他のオプション</span>
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <button className={styles.dropdownItem} onClick={() => { /* 設定処理 */ setIsDropdownOpen(false); }}>
                    <FaCog className="h-4 w-4 mr-2" />
                    設定
                  </button>
                  <button className={styles.dropdownItem} onClick={() => { /* 参加者一覧処理 */ setIsDropdownOpen(false); }}>
                    <FaUsers className="h-4 w-4 mr-2" />
                    参加者一覧
                  </button>
                  <button className={styles.dropdownItem} onClick={() => { /* 招待リンクコピー処理 */ setIsDropdownOpen(false); }}>
                    <FaShareAlt className="h-4 w-4 mr-2" />
                    招待リンクをコピー
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* サイドパネル */}
        <div className={styles.sidePanel}>
          {/* Tabs の置き換え */}
          <div className={`${styles.sidePanelTabsList}`}>
            <button
              className={`${styles.sidePanelTabTrigger} ${styles.m4} ${styles.mb0} ${styles.grid} ${styles.gridCols2} ${styles.wFull} ${styles.sidePanelTabTriggerActive}`} // デフォルトでcodeタブをアクティブ
              onClick={() => { /* Tab切り替えロジック */ }}
            >コード共有</button>
            <button
              className={`${styles.sidePanelTabTrigger} ${styles.m4} ${styles.mb0} ${styles.grid} ${styles.gridCols2} ${styles.wFull}`}
              onClick={() => { /* Tab切り替えロジック */ }}
            >ノート</button>
          </div>
          {/* TabsContent の置き換え */}
          {/* コード共有タブの内容 */}
          <div className={`${styles.sidePanelTabContent} ${styles.flex1} ${styles.flexCol}`}>
            <div className={`${styles.sidePanelCard} ${styles.flex1} ${styles.flexCol}`}>
              <div className={`${styles.sidePanelCardHeader} ${styles.pb3}`}>
                <div className={styles.sidePanelCardHeaderFlex}>
                  <h3 className={styles.sidePanelCardTitle}>共有コード</h3>
                  <button className={`${styles.buttonBase} ${styles.buttonOutline} ${styles.buttonSm}`} onClick={copyCode}>
                    <FaCopy className="h-4 w-4 mr-1" />
                    コピー
                  </button>
                </div>
              </div>
              <div className={`${styles.sidePanelCardContent} ${styles.flex1} ${styles.flexCol}`}>
                <textarea
                  value={sharedCode}
                  onChange={(e) => setSharedCode(e.target.value)}
                  className={`${styles.textareaBase} ${styles.textareaCode} ${styles.textareaNoResize} ${styles.flex1}`}
                  placeholder="ここにコードを入力してください..."
                />
                <div className={`${styles.flex} ${styles.gap2} ${styles.mt3}`}>
                  <button className={`${styles.buttonBase} ${styles.buttonDefault} ${styles.buttonSm} ${styles.flex1}`}>
                    <FaCode className="h-4 w-4 mr-1" />
                    実行
                  </button>
                  <button className={`${styles.buttonBase} ${styles.buttonOutline} ${styles.buttonSm} ${styles.flex1}`}>
                    <FaDownload className="h-4 w-4 mr-1" />
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ノートタブの内容 (hidden by default, shown by JS logic) */}
          {/* <div className={`${styles.sidePanelTabContent} ${styles.flex1} ${styles.flexCol} hidden`}> */}
          {/* <div className={`${styles.sidePanelCard} ${styles.flex1} ${styles.flexCol}`}> */}
          {/* <div className={`${styles.sidePanelCardHeader} ${styles.pb3}`}> */}
          {/* <h3 className={styles.sidePanelCardTitle}>ミーティングノート</h3> */}
          {/* </div> */}
          {/* <div className={`${styles.sidePanelCardContent} ${styles.flex1} ${styles.flexCol}`}> */}
          {/* <textarea */}
          {/* value={notes} */}
          {/* onChange={(e) => setNotes(e.target.value)} */}
          {/* className={`${styles.textareaBase} ${styles.textareaNoResize} ${styles.mb3} ${styles.flex1}`} */}
          {/* placeholder="ミーティングの内容をメモしてください..." */}
          {/* readOnly */}
          {/* /> */}
          {/* <div className={`${styles.flex} ${styles.gap2}`}> */}
          {/* <input */}
          {/* type="text" */}
          {/* value={newNote} */}
          {/* onChange={(e) => setNewNote(e.target.value)} */}
          {/* placeholder="新しいメモを追加..." */}
          {/* onKeyDown={(e) => { */}
          {/* if (e.key === "Enter" && !e.shiftKey) { */}
          {/* e.preventDefault() */}
          {/* addNote() */}
          {/* } */}
          {/* }} */}
          {/* className={`${styles.inputBase} ${styles.flex1}`} */}
          {/* /> */}
          {/* <button onClick={addNote} disabled={!newNote.trim()} className={`${styles.buttonBase} ${styles.buttonPrimary}`}> */}
          {/* 追加 */}
          {/* </button> */}
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}


          {/* 参加者情報 */}
          <div className={`${styles.participantsSidePanel} ${styles.p4} ${styles.borderT} ${styles.borderGray200}`}>
            <h3 className={styles.participantsHeading}>参加者</h3>
            <div className={styles.participantsGrid}>
              {meeting.participants.map((participant) => (
                <div key={participant.id} className={styles.participantItem}>
                  <div className={styles.participantAvatarRelative}>
                    <div className={styles.participantAvatarSm}>
                      <img src={participant.avatar || "/placeholder.svg"} alt={participant.name} className={styles.avatarImage} />
                      <div className={styles.avatarFallback}>{participant.name.charAt(0)}</div>
                    </div>
                    {participant.isOnline && (
                      <div className={styles.participantOnlineIndicator} />
                    )}
                  </div>
                  <div className={styles.participantDetails}>
                    <div className={styles.participantName}>{participant.name}</div>
                    <div className={styles.participantRole}>
                      {participant.role === "mentor" ? "メンター" : "学習者"}
                    </div>
                  </div>
                  {participant.role === "mentor" && (
                    <span className={styles.participantRoleBadge}>
                      メンター
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ミーティング終了確認ダイアログ */}
      {showEndDialog && (
        <div className={styles.dialogOverlayBase} onClick={() => setShowEndDialog(false)}>
          <div className={styles.dialogContentBase} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeaderBase}>
              <h2 className={styles.dialogTitleBase}>ミーティングを終了しますか？</h2>
              <p className={styles.dialogDescriptionBase}>
                ミーティングを終了すると、すべての参加者が退出し、共有されたコードやノートは保存されます。
              </p>
            </div>
            <div className={styles.dialogFooterBase}>
              <button className={`${styles.buttonBase} ${styles.buttonOutline}`} onClick={() => setShowEndDialog(false)}>
                キャンセル
              </button>
              <button className={`${styles.buttonBase} ${styles.buttonDestructive}`} onClick={endMeeting}>
                ミーティングを終了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}