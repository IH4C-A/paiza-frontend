import React, { useState } from "react";
// react-router-dom から useParams と Link をインポート
import { useParams, Link } from "react-router-dom";
import styles from "./QuestionDetailPage.module.css";

// --- インターフェース定義 (変更なし) ---
interface Author {
  name: string;
  rank: 'S' | 'A' | 'B';
  avatar: string;
}

interface Answer {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  tags: string[];
  views: number;
  answers: Answer[];
  authorRank: 'A' | 'B';
  answerCount: number;
}


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
  
  const [newAnswer, setNewAnswer] = useState("");

  // --- 質問データのモック (テスト表示用) ---
  const questionData: Question = {
    id: id || '1',
    title: "ReactのuseEffectで無限ループが発生する原因について",
    content: `# 問題の概要\nReactでuseeffectを使っているのですが、無限ループが発生してしまいます。依存配列には空の配列を指定しているのですが、それでも無限ループが発生します。\n\n## コード\n\`\`\`jsx\nimport React, { useState, useEffect } from 'react';\n\nfunction MyComponent() {\n  const [data, setData] = useState(null);\n  \n  useEffect(() => {\n    const fetchData = async () => {\n      const response = await fetch('[https://api.example.com/data](https://api.example.com/data)');\n      const result = await response.json();\n      setData(result);\n    };\n    \n    fetchData();\n  }, []); // 空の依存配列\n  \n  return (\n    <div>\n      {data ? <p>{data.message}</p> : <p>Loading...</p>}\n    </div>\n  );\n}\n\`\`\`\n\n## 試したこと\n- コンポーネントを再マウントしてみる\n- 依存配列を削除してみる\n- fetchDataを外部に移動してみる\n\nどのような原因が考えられるでしょうか？`,
    tags: ['React', 'JavaScript', 'useEffect'],
    author: { name: "田中太郎", rank: 'B', avatar: "/placeholder-avatar.png" },
    authorRank: 'B',
    createdAt: "2時間前",
    answerCount: 2,
    viewCount: 42,
    answers: [
      {
        id: "ans1",
        content: `問題の原因はいくつか考えられます：\n\n1. **Strict Modeの影響**: React 18のStrictモードでは、開発環境でコンポーネントが二回マウントされることがあります。\n\n2. **外部での状態更新**: このコンポーネントの外部で何か状態を更新していて、それによってコンポーネントが再レンダリングされている可能性があります。\n\n\`\`\`jsx\nuseEffect(() => {\n  let isMounted = true;\n  const fetchData = async () => {\n    // ... fetch logic ...\n    if (isMounted) {\n      setData(result);\n    }\n  };\n  fetchData();\n  return () => { isMounted = false; };\n}, []);\n\`\`\``,
        author: { name: "佐藤花子", rank: 'A', avatar: "/placeholder-avatar.png" },
        createdAt: "1時間前",
        likes: 5,
      },
      {
        id: "ans2",
        content: `田中さん、こんにちは。\n私の経験では、このような無限ループは親コンポーネントでの状態更新が原因であることが多いです。React DevToolsのProfilerを使って、どのコンポーネントが再レンダリングされているかを確認するのが有効です。`,
        author: { name: "鈴木一郎", rank: 'S', avatar: "/placeholder-avatar.png" },
        createdAt: "30分前",
        likes: 3,
      },
    ],
  };

  const getRankClass = (rank: 'S' | 'A' | 'B') => {
    if (rank === 'S') return styles.rankS;
    if (rank === 'A') return styles.rankA;
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
            <h1 className={styles.titleTextH1}>{questionData.title}</h1>
            <div className={styles.tagsContainer}>
              {questionData.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Question Card */}
            <div className={styles.card}>
              <div className={`${styles.cardHeader} ${styles.itemHeader}`}>
                <div className={styles.authorInfo}>
                  <div className={styles.avatar}>
                    <img src={questionData.author.avatar} alt={questionData.author.name} />
                  </div>
                  <div className={styles.authorDetails}>
                    <div className={styles.authorRankContainer}>
                      <span className={styles.authorName}>{questionData.author.name}</span>
                      <div className={`${styles.rankBadge} ${getRankClass(questionData.author.rank)}`}>
                        {questionData.author.rank}
                      </div>
                    </div>
                    <p className={styles.timestamp}>{questionData.createdAt}</p>
                  </div>
                </div>
                <div className={styles.itemStats}>
                  <span>閲覧 {questionData.viewCount}回</span>
                  <span>回答 {questionData.answers.length}件</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <SimpleMarkdownDisplay content={questionData.content} />
              </div>
            </div>

            {/* Answers Section */}
            <div className={styles.answersHeader}>
              <h2 className={styles.answersTitle}>回答 {questionData.answers.length}件</h2>
              <button className={styles.sortButton}>並び替え</button>
            </div>

            {questionData.answers.map((answer) => (
              <div key={answer.id} className={styles.card}>
                <div className={`${styles.cardHeader} ${styles.itemHeader}`}>
                  <div className={styles.authorInfo}>
                    <div className={styles.avatar}>
                        <img src={answer.author.avatar} alt={answer.author.name} />
                    </div>
                    <div className={styles.authorDetails}>
                      <div className={styles.authorRankContainer}>
                        <span className={styles.authorName}>{answer.author.name}</span>
                        <div className={`${styles.rankBadge} ${getRankClass(answer.author.rank)}`}>
                          {answer.author.rank}
                        </div>
                      </div>
                      <p className={styles.timestamp}>{answer.createdAt}</p>
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
                      <span>{answer.likes}</span>
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
                <button className={styles.submitButton}>回答を投稿</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}