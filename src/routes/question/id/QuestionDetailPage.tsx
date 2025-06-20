import React, { useState } from "react";
// react-router-dom から useParams と Link をインポート
import { useParams, Link } from "react-router-dom";
import styles from "./QuestionDetailPage.module.css";
import { useBoard } from "../../../hooks/useBoard";
import type { Rank } from "../../../types/rankType";
import { useComments , useCreateComment } from "../../../hooks/useComment";


// --- Markdown表示の簡易代替コンポーネント (変更なし) ---
const SimpleMarkdownDisplay: React.FC<{ content: string }> = ({ content }) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
        <div className={styles.markdownDisplay}>
            {parts.map((part, index) => {
                if (part.startsWith("```")) {
                    const code = part.replace(/```(jsx|js|html|css|py)?\n?/g, '').replace(/```/g, '');
                    return <pre key={index}><code>{code}</code></pre>;
                }
                return part.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={`${index}-${lineIndex}`}>
                        {line}
                        {lineIndex < part.split('\n').length - 1 && <br />}
                    </React.Fragment>
                ));
            })}
        </div>
    );
};


// --- メインコンポーネント ---
export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  // useNavigateは不要になったので削除

  const { board } = useBoard(id ?? "");

  const { comments, refetch } = useComments(board?.board_id ?? "");
  
  const [newAnswer, setNewAnswer] = useState("");

  const { createComment } = useCreateComment();

  console.log(board)

  const handleCommentClick = () => {
    const commentData = {
      content: newAnswer,
      boardId: board?.board_id ?? null
    };
    createComment(commentData)
      .then(() => {
        alert('回答しました')
        setNewAnswer("");
        refetch()
      })
      .catch((error) => {
        console.error("回答の投稿に失敗しました:",error);
        alert("回答の投稿に失敗しました")
      })
  }

  const getRankClass = (rank: Rank | undefined) => {
    if (!rank) return styles.rankB;
    if (rank.rank_name === 'S') return styles.rankS;
    if (rank.rank_name === 'A') return styles.rankA;
    return styles.rankB;
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <div className={styles.breadcrumbs}>
              <Link to="/question">質問掲示板</Link>
              <span>/</span>
              <span>質問詳細</span>
            </div>
            <h1 className={styles.titleTextH1}>{board?.title}</h1>
            <div className={styles.tagsContainer}>
              {Array.isArray(board?.categories) && board?.categories.map((tag) => (
                <span key={tag.category_id} className={styles.tag}>{tag.category_name}</span>
              ))}
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Question Card */}
            <div className={styles.card}>
              <div className={`${styles.cardHeader} ${styles.itemHeader}`}>
                <div className={styles.authorInfo}>
                  <div className={styles.avatar}>
                    <img src={board?.user_id.profile_image ?? undefined} alt={board?.user_id.username ?? ""} />
                  </div>
                  <div className={styles.authorDetails}>
                    <div className={styles.authorRankContainer}>
                      <span className={styles.authorName}>{board?.user_id.username}</span>
                      <div className={`${styles.rankBadge} ${getRankClass(board?.user_id.ranks?.[0])}`}>
                        {board?.user_id.ranks?.[0].rank_name}
                      </div>
                    </div>
                    <p className={styles.timestamp}>{board?.created_at ? board.created_at.toLocaleString() : ""}</p>
                  </div>
                </div>
                <div className={styles.itemStats}>
                  <span>閲覧 0回</span>
                  <span>回答 {board?.comment_count}件</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <SimpleMarkdownDisplay content={board?.content ?? ""} />
              </div>
            </div>

            {/* Answers Section */}
            <div className={styles.answersHeader}>
              <h2 className={styles.answersTitle}>回答 {board?.comment_count}件</h2>
              <button className={styles.sortButton}>並び替え</button>
            </div>

            {comments.map((answer) => (
              <div key={answer.comment_id} className={styles.card}>
                <div className={`${styles.cardHeader} ${styles.itemHeader}`}>
                  <div className={styles.authorInfo}>
                    <div className={styles.avatar}>
                        <img src={answer.user_id.profile_image ?? ""} alt={answer.user_id.username ?? ""} />
                    </div>
                    <div className={styles.authorDetails}>
                      <div className={styles.authorRankContainer}>
                        <span className={styles.authorName}>{answer.user_id.username}</span>
                        <div className={`${styles.rankBadge} ${getRankClass(answer.user_id.ranks?.[0])}`}>
                          {answer.user_id.ranks?.[0]?.rank_name}
                        </div>
                      </div>
                      <p className={styles.timestamp}>{answer.created_at}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <SimpleMarkdownDisplay content={answer.content} />
                </div>
                <div className={`${styles.cardFooter} ${styles.answerActions}`}>
                  <div className={styles.feedbackButtons}>
                    <button className={styles.feedbackButton}>
                      <img src="/icons/thumbs-up.svg" alt="Like" />
                      {/* <span>{answer.likes}</span> */}
                    </button>
                    <button className={styles.feedbackButton}>
                      <img src="/icons/message-square.svg" alt="Reply" />
                      <span>返信</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* New Answer Form */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.answerFormCardTitle}>回答を投稿</h2>
                <p className={styles.cardDescription}>マークダウン形式で回答を入力できます</p>
              </div>
              <div className={styles.cardContent}>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="回答を入力してください..."
                  className={styles.formTextarea}
                />
              </div>
              <div className={`${styles.cardFooter} ${styles.submitButtonContainer}`}>
                <button className={styles.submitButton} onClick={handleCommentClick}>回答を投稿</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}