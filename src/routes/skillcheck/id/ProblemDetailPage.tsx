import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./ProblemDetailPage.module.css";

// --- TypeScriptのインターフェース定義 ---
interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: "A" | "B" | "C" | "S";
  description: string;
  examples: { input: string; output: string }[];
  testCases: { id: number; input: string; expected: string; status: null }[];
  hints: string[];
  tags: string[];
}

interface TestResult {
  id: number;
  status: "passed" | "failed";
  output: string;
  executionTime: number;
}


// --- 簡易Markdown表示コンポーネント ---
const SimpleMarkdownDisplay: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className={styles.markdownDisplay}>
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const code = part.replace(/```(javascript|jsx|ts|tsx|py)?\n?/g, '').replace(/```/g, '');
          return <pre key={index}><code>{code}</code></pre>;
        }
        return part.split('\n').map((line, lineIndex) => (
          <React.Fragment key={`${index}-${lineIndex}`}>
            {line}{lineIndex < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      })}
    </div>
  );
};


// --- メインコンポーネント ---
export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();

  // State管理
  const [code, setCode] = useState(
`function solution(input) {
  // ここにコードを書いてください
  
  return "";
}`);
  const [language, setLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState<TestResult[]>([]); // any[] から TestResult[] に修正
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");

  // 問題データのモック
  const problem: Problem = {
    id: id || "1",
    title: "Reactコンポーネント設計",
    category: "Webフレームワーク",
    difficulty: "B",
    description: `
# 問題概要
Reactを使用して再利用可能なコンポーネントを設計する問題です。
## 要件
以下の要件を満たすUserCardコンポーネントを作成してください：
1. ユーザーの名前、アバター画像、職業を表示する
2. プロフィール詳細を表示/非表示できるトグル機能
3. フォローボタンがあり、クリックでフォロー状態を切り替える
## 入力
コンポーネントは以下のpropsを受け取ります：
\`\`\`javascript
{
  name: string,
  avatar: string,
  occupation: string,
  bio: string,
  isFollowing: boolean
}
\`\`\`
`,
    examples: [
        { input: `{\n  name: "田中太郎",\n  avatar: "...",\n  occupation: "エンジニア", ...\n}`, output: "要件を満たすUserCardコンポーネントが表示される" }
    ],
    testCases: [
        { id: 1, input: `{ name: "佐藤花子", ... }`, expected: "コンポーネントが正しく表示され、フォロー状態が反映される", status: null },
        { id: 2, input: `{ name: "鈴木一郎", ... }`, expected: "空の値でもエラーなく表示される", status: null }
    ],
    hints: [
        "useStateフックを使ってフォロー状態とプロフィール表示状態を管理しましょう",
        "条件分岐を使ってプロフィール詳細の表示/非表示を制御しましょう",
    ],
    tags: ["React", "JavaScript", "コンポーネント"],
  };

  // イベントハンドラ
  const runCode = () => {
    setIsRunning(true);
    setTestResults([]);
    
    setTimeout(() => {
      const results = problem.testCases.map((testCase) => {
        // statusを先に決定
        const currentStatus = Math.random() > 0.3 ? "passed" : "failed";

        // TestResult型のオブジェクトを明示的に作成
        const newResult: TestResult = {
          id: testCase.id,
          status: currentStatus,
          output: currentStatus === "passed" ? testCase.expected : "エラー: 期待される結果と異なります",
          executionTime: Math.floor(Math.random() * 100) + 50,
        };
        return newResult;
      });
      
      setTestResults(results);
      setIsRunning(false);
    }, 2000);
  };

  const submitCode = () => {
    alert("コードを提出しました！ (テスト用)");
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <div className={styles.breadcrumbs}>
              <Link to="/problems">問題</Link>
              <span>/</span>
              <span>{problem.category}</span>
              <span>/</span>
              <span>{problem.title}</span>
            </div>
            <div className={styles.titleHeader}>
              <div>
                <h1 className={styles.titleTextH1}>{problem.title}</h1>
                <div className={styles.titleInfo}>
                  <span className={styles.category}>{problem.category}</span>
                  <span className={styles.difficultyBadge}>{problem.difficulty}</span>
                  <div className={styles.tagsContainer}>
                    {problem.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Left Column: Problem Details */}
            <div>
              <div className={styles.tabsList}>
                <button onClick={() => setActiveTab("problem")} className={`${styles.tabTrigger} ${activeTab === 'problem' ? styles.tabTriggerActive : ''}`}>問題</button>
                <button onClick={() => setActiveTab("examples")} className={`${styles.tabTrigger} ${activeTab === 'examples' ? styles.tabTriggerActive : ''}`}>入出力例</button>
                <button onClick={() => setActiveTab("hints")} className={`${styles.tabTrigger} ${activeTab === 'hints' ? styles.tabTriggerActive : ''}`}>ヒント</button>
              </div>
              
              <div className={styles.tabContent}>
                {activeTab === 'problem' && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}><h2 className={styles.cardTitle}>問題文</h2></div>
                    <div className={styles.cardContent}><SimpleMarkdownDisplay content={problem.description} /></div>
                  </div>
                )}
                {activeTab === 'examples' && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}><h2 className={styles.cardTitle}>入出力例</h2></div>
                    <div className={styles.cardContent}>
                      <div className={styles.exampleContainer}>
                        {problem.examples.map((ex, i) => (
                          <div key={i} className={styles.exampleItem}>
                            <h4>例 {i + 1}</h4>
                            <div><span>入力:</span><pre>{ex.input}</pre></div>
                            <div><span>出力:</span><pre>{ex.output}</pre></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'hints' && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}><h2 className={styles.cardTitle}>ヒント</h2></div>
                    <div className={styles.cardContent}>
                      <div className={styles.hintContainer}>
                        {problem.hints.map((hint, i) => (
                          <div key={i} className={styles.hintItem}>
                            <span className={styles.hintNumber}>{i + 1}.</span>
                            <span>{hint}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column: Code Editor & Results */}
            <div>
              <div className={styles.card}>
                <div className={`${styles.cardHeader} ${styles.cardHeaderFlex}`}>
                  <h2 className={styles.cardTitle}>コードエディタ</h2>
                  <div className={styles.editorHeader}>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className={styles.selectControl}>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="ruby">Ruby</option>
                    </select>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={styles.codeTextarea}
                    placeholder="ここにコードを入力してください..."
                  />
                  <div className={styles.editorActions}>
                    <button onClick={runCode} disabled={isRunning} className={`${styles.editorButton} ${styles.primaryButton}`}>
                      <img src="/icons/play.svg" alt="Run"/>{isRunning ? "実行中..." : "実行"}
                    </button>
                    <button className={`${styles.editorButton} ${styles.outlineButton}`}><img src="/icons/save.svg" alt="Save"/>保存</button>
                    <button className={`${styles.editorButton} ${styles.outlineButton}`}><img src="/icons/rotate-ccw.svg" alt="Reset"/>リセット</button>
                    <button onClick={submitCode} className={`${styles.editorButton} ${styles.primaryButton} ${styles.submitButton}`}>
                      <img src="/icons/send.svg" alt="Submit"/>提出
                    </button>
                  </div>
                </div>
              </div>
              {testResults.length > 0 && (
                <div className={`${styles.card} ${styles.tabContent}`}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>実行結果</h2>
                    <p className={styles.cardDescription}>テストケースの実行結果</p>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.exampleContainer}>
                      {testResults.map((result) => (
                        <div key={result.id} className={`${styles.resultItem} ${result.status === 'passed' ? styles.resultItemPassed : styles.resultItemFailed}`}>
                          <div className={styles.resultHeader}>
                            <span className="font-medium">テストケース {result.id}</span>
                            <div className={styles.editorHeader}>
                              <span className={`${styles.resultStatus} ${result.status === 'passed' ? styles.resultStatusPassed : styles.resultStatusFailed}`}>
                                {result.status === "passed" ? "成功" : "失敗"}
                              </span>
                              <span className={styles.resultTime}>{result.executionTime}ms</span>
                            </div>
                          </div>
                          <div className={styles.resultBody}>
                            <div><span>出力:</span><pre>{result.output}</pre></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}