"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
// lucide-reactの代わりにreact-icons/faからアイコンをインポート
import { FaArrowLeft, FaStar, FaUsers, FaMessage, FaPaperPlane, FaUser } from "react-icons/fa6" // FaMessage, FaPaperPlaneはFa6（新しいバージョン）にあります。必要に応じてfaやmdなど他のアイコンセットを選択してください。

// CSSモジュールをインポート
import styles from "./MentorApplyPage.module.css"
import { useMentorRequest, useUser } from "../../../hooks"

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


export default function MentorApplyPage() {
  const { id } = useParams()
  const router = useNavigate()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { requestMentor } = useMentorRequest();
  const { user } = useUser(id || "");


  console.log(user)
  if (!user) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <h1 className={styles.notFoundTitle}>メンターが見つかりません</h1>
          <p className={styles.notFoundDescription}>指定されたメンターは存在しないか、削除されています。</p>
          <a href="/mentor" className={`${styles.buttonBase} ${styles.buttonPrimary} ${styles.notFoundButton}`}>
            メンター一覧に戻る
          </a>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast({
        title: "エラー",
        description: "メッセージを入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const request = {
      mentor_id: user.user_id,
      message,
    }

    // 実際はAPIに送信
    await requestMentor(request);

    toast({
      title: "申請を送信しました",
      description: "メンターからの返信をお待ちください。通知でお知らせします。",
    })

    setIsSubmitting(false)
    router("/mentor")
  }

  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <div className={styles.pageContainer}>
          <div className={styles.pageHeader}>
            <a href="/mentor" className={`${styles.buttonBase} ${styles.buttonGhost} ${styles.buttonSm} ${styles.backButton}`}>
              <FaArrowLeft className={styles.backIcon} /> {/* ArrowLeftアイコンをFaArrowLeftに変更 */}
              メンター一覧に戻る
            </a>
            <h1 className={styles.pageTitle}>メンター申請</h1>
            <p className={styles.pageDescription}>
              メンターに指導を申請します。申請理由や学習目標を詳しく記載してください。
            </p>
          </div>

          <div className={styles.grid}>
            {/* メンター情報 */}
            <div className={styles.mentorInfoColumn}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.mentorHeader}>
                    <div className={styles.avatarWrapper}>
                      <div className={styles.avatar}>
                        {user.profile_image ? (
                        <img src={user.profile_image || "/placeholder.svg"} alt={user.first_name} className={styles.avatarImage} />
                        ) : (
                        <FaUser className={styles.avatarFallback}></FaUser>
                        )}
                      </div>
                      <div className={styles.badgeAbsolute}>
                        <span
                          className={`${styles.badgeBase} ${user.ranks?.[1]?.rank_name === "S" ? styles.badgeDestructive : styles.badgeSecondary} ${styles.rankBadge}`}
                        >
                          {user.ranks?.[1].rank_name}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className={styles.mentorName}>{user.first_name}</h3>
                      <div className={styles.ratingSection}>
                        <div className={styles.ratingStars}>
                          <FaStar className={styles.starIcon} /> {/* StarアイコンをFaStarに変更 */}
                          {/* <span className={styles.ratingText}>{mentor.rating}</span> */}
                        </div>
                        {/* <span className={styles.reviewCount}>({mentor.reviewCount}件)</span> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.cardContentSpaceY}>
                  <div>
                    <h4 className={styles.subHeading}>得意分野</h4>
                    <div className={styles.categoryBadges}>
                      {user.categories.map((category) => (
                        <span key={category.category_id} className={`${styles.badgeBase} ${styles.badgeOutline} ${styles.categoryBadge}`}>
                          {category.category_name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.separator} />

                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <FaUsers className={styles.detailIcon} /> {/* UsersアイコンをFaUsersに変更 */}
                      <span className={styles.detailLabel}>指導中:</span>
                      {/* <span className={styles.detailValue}>{mentor.menteeCount}人</span> */}
                    </div>
                    <div className={styles.detailItem}>
                      <FaMessage className={styles.detailIcon} /> {/* MessageCircleアイコンをFaMessageに変更 */}
                      <span className={styles.detailLabel}>返信:</span>
                      {/* <span className={styles.detailValue}>{mentor.responseTime}</span> */}
                    </div>
                  </div>

                  <div className={styles.separator} />

                  <div>
                    <h4 className={styles.subHeading}>指導内容</h4>
                    <ul className={styles.specialtiesList}>
                      {/* {mentor.specialties.map((specialty, index) => (
                        <li key={index} className={styles.specialtyItem}>
                          <span className={styles.specialtyBullet}>•</span>
                          <span>{specialty}</span>
                        </li>
                      ))} */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 申請フォーム */}
            <div className={styles.applicationFormColumn}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>申請メッセージ</h3>
                  <p className={styles.cardDescription}>
                    メンターに向けて、学習目標や申請理由を詳しく記載してください。
                    具体的な内容ほど、メンターからの承認を得やすくなります。
                  </p>
                </div>
                <div className={styles.cardContent}>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label htmlFor="message" className={styles.label}>申請メッセージ *</label>
                      <textarea
                        id="message"
                        placeholder="例：
React初心者です。基礎から実践的なアプリ開発まで学びたいと考えています。
現在の学習状況：HTML/CSS/JavaScriptの基礎は理解済み
学習目標：3ヶ月でReactを使ったWebアプリを作れるようになりたい
質問頻度：週2-3回程度を想定
その他：平日夜と週末に学習時間を確保できます"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={styles.textarea}
                        required
                        rows={10}
                      />
                      <p className={styles.textCounter}>{message.length}/1000文字</p>
                    </div>

                    <div className={styles.hintBox}>
                      <h4 className={styles.hintTitle}>💡 申請のコツ</h4>
                      <ul className={styles.hintList}>
                        <li>• 現在の学習レベルと経験を具体的に記載</li>
                        <li>• 学習目標と期間を明確に設定</li>
                        <li>• 質問頻度や学習時間の目安を記載</li>
                        <li>• 特に学びたい技術や分野があれば詳しく記載</li>
                        <li>• 丁寧で誠実な文章を心がける</li>
                      </ul>
                    </div>

                    <div className={styles.buttonContainer}>
                      <button type="button" className={`${styles.buttonBase} ${styles.buttonOutline} ${styles.buttonFlex1}`} onClick={() => router("/mentor")}>
                        キャンセル
                      </button>
                      <button type="submit" className={`${styles.buttonBase} ${styles.buttonPrimary} ${styles.buttonFlex1}`} disabled={isSubmitting || !message.trim()}>
                        {isSubmitting ? (
                          "送信中..."
                        ) : (
                          <>
                            <FaPaperPlane className={styles.buttonIcon} /> {/* SendアイコンをFaPaperPlaneに変更 */}
                            申請を送信
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}