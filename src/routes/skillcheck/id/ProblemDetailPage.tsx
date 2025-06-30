import React, { useState, useEffect } from "react"; // useEffectを追加
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import styles from "./ProblemDetailPage.module.css";
import { FaPaperPlane, FaPlay, FaSave } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { useProblem } from "../../../hooks";
import type { TestCase } from "../../../types/testCaseType";
import { getDefaultCode } from "../../../types/skillData";

// --- 簡易Markdown表示コンポーネント (変更なし) ---
const SimpleMarkdownDisplay: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className={styles.markdownDisplay}>
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(
            /```(javascript|jsx|ts|tsx|py|python|java|ruby|html|css)?\n?([\s\S]*?)```/
          ); // HTML/CSSもマッチするように更新
          const code = match
            ? match[2].trim()
            : part.replace(/```/g, "").trim();
          const lang = match ? (match[1] === "py" ? "python" : match[1]) : "";
          return (
            <pre key={index}>
              <code className={`language-${lang}`}>{code}</code>
            </pre>
          );
        }
        return part.split("\n").map((line, lineIndex) => (
          <React.Fragment key={`${index}-${lineIndex}`}>
            {line}
            {lineIndex < part.split("\n").length - 1 && <br />}
          </React.Fragment>
        ));
      })}
    </div>
  );
};

// --- メインコンポーネント ---
export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { problem } = useProblem(id ?? "");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(getDefaultCode(language));
  console.log(problem);
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("problem"); // 'problem', 'examples', 'hints'

  // ★★★ NEW: プレビュー表示/結果表示の切り替えタブ用State ★★★
  const [rightColumnTab, setRightColumnTab] = useState<
    "preview" | "results" | "none"
  >(
    language === "html" || language === "css" ? "preview" : "none" // 初期表示はプレビュー
  );

  const runCode = () => {
    setIsRunning(true);
    setTestResults([]);
    // ★★★ コード実行時に結果タブに切り替える ★★★
    setRightColumnTab("results");

    setTimeout(() => {
      const results = problem?.test_cases.map((testCase) => {
        const currentStatus = Math.random() > 0.3 ? "passed" : "failed";

        const newResult = {
          test_case_id: testCase.test_case_id,
          problem_id: id ?? "",
          input_text: testCase.input_text,
          expected_output: testCase.expected_output,
          status: currentStatus,
          is_public:
            currentStatus === "passed"
              ? testCase.is_public
              : "エラー: 期待される結果と異なります",
          executionTime: Math.floor(Math.random() * 100) + 50,
        };
        return newResult;
      });

      setTestResults(results ?? []);
      setIsRunning(false);
    }, 2000);
  };

  const submitCode = () => {
    alert("コードを提出しました！ (テスト用)");
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  useEffect(() => {
    if (problem?.category?.category_name) {
      const detectedLang = problem.category.category_name.toLowerCase();
      setLanguage(detectedLang);
      setCode(getDefaultCode(detectedLang));

      // プレビュー表示設定
      if (detectedLang === "html" || detectedLang === "css") {
        setRightColumnTab("preview");
      } else {
        setRightColumnTab("none");
      }
    }
  }, [problem]);

  // ★★★ NEW: プレビュー更新のuseEffect ★★★
  useEffect(() => {
    if (language === "html" || language === "css") {
      const iframe = document.getElementById(
        "preview-iframe"
      ) as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        if (language === "html") {
          iframeDoc.write(code); // HTMLコードを直接書き込む
        } else if (language === "css") {
          // CSSの場合、既存のHTMLにスタイルを適用する（例として簡単なHTMLを生成）
          iframeDoc.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>CSSプレビュー</title>
                <style>${code}</style>
              </head>
              <body>
                <h1>CSSプレビュー</h1>
                <p>ここにCSSが適用されます。</p>
                <div class="box">箱の要素</div>
                <button>ボタン</button>
              </body>
              </html>
            `);
        }
        iframeDoc.close();
      }
    }
  }, [code, language]); // code または language が変更されるたびに実行

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <div className={styles.breadcrumbs}>
              <Link to="/problems">問題</Link>
              <span>/</span>
              <span>{problem?.category.category_name}</span>
              <span>/</span>
              <span>{problem?.problem_title}</span>
            </div>
            <div className={styles.titleHeader}>
              <div>
                <h1 className={styles.titleTextH1}>{problem?.problem_title}</h1>
                <div className={styles.titleInfo}>
                  <span className={styles.category}>
                    {problem?.category.category_name}
                  </span>
                  <span className={styles.difficultyBadge}>
                    {problem?.rank.rank_name}
                  </span>
                  <div className={styles.tagsContainer}>
                    <span className={styles.tag}>
                      {problem?.category.category_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Left Column: Problem Details */}
            <div>
              <div className={styles.tabsList}>
                <button
                  onClick={() => setActiveTab("problem")}
                  className={`${styles.tabTrigger} ${
                    activeTab === "problem" ? styles.tabTriggerActive : ""
                  }`}
                >
                  問題
                </button>
                <button
                  onClick={() => setActiveTab("examples")}
                  className={`${styles.tabTrigger} ${
                    activeTab === "examples" ? styles.tabTriggerActive : ""
                  }`}
                >
                  入出力例
                </button>
                <button
                  onClick={() => setActiveTab("hints")}
                  className={`${styles.tabTrigger} ${
                    activeTab === "hints" ? styles.tabTriggerActive : ""
                  }`}
                >
                  ヒント
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === "problem" && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>問題文</h2>
                    </div>
                    <div className={styles.cardContent}>
                      <SimpleMarkdownDisplay
                        content={problem?.problem_text ?? ""}
                      />
                    </div>
                  </div>
                )}
                {activeTab === "examples" && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>入出力例</h2>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.exampleContainer}>
                        {problem?.test_cases.map((ex, i) => (
                          <div key={i} className={styles.exampleItem}>
                            <h4>例 {i + 1}</h4>
                            <div>
                              <span>入力:</span>
                              <pre>{ex.input_text}</pre>
                            </div>
                            <div>
                              <span>出力:</span>
                              <pre>{ex.expected_output}</pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "hints" && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>ヒント</h2>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.hintContainer}>
                        {/* {problem.hints.map((hint, i) => (
                          <div key={i} className={styles.hintItem}>
                            <span className={styles.hintNumber}>{i + 1}.</span>
                            <span>{hint}</span>
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Code Editor & Results/Preview */}
            <div className={styles.editorAndOutputColumn}>
              {" "}
              {/* 新しいクラス名 */}
              <div className={styles.card}>
                <div
                  className={`${styles.cardHeader} ${styles.cardHeaderFlex}`}
                >
                  <h2 className={styles.cardTitle}>コードエディタ</h2>
                  <div className={styles.editorHeader}>
                    <span>{problem?.category.category_name}</span>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <Editor
                    height="400px"
                    language={language}
                    theme="vs-light"
                    value={code}
                    onChange={handleEditorChange}
                    options={editorOptions}
                  />
                  <div className={styles.editorActions}>
                    <button
                      onClick={runCode}
                      disabled={
                        isRunning || language === "html" || language === "css"
                      } // HTML/CSSでは「実行」を無効化
                      className={`${styles.editorButton} ${styles.primaryButton}`}
                    >
                      <FaPlay />
                      {isRunning ? "実行中..." : "実行"}
                    </button>
                    <button
                      className={`${styles.editorButton} ${styles.outlineButton}`}
                    >
                      <FaSave />
                      保存
                    </button>
                    <button
                      className={`${styles.editorButton} ${styles.outlineButton}`}
                    >
                      <FaRotate />
                      リセット
                    </button>
                    <button
                      onClick={submitCode}
                      className={`${styles.editorButton} ${styles.primaryButton} ${styles.submitButton}`}
                    >
                      <FaPaperPlane />
                      提出
                    </button>
                  </div>
                </div>
              </div>
              {/* ★★★ 右カラムのタブ表示部分 ★★★ */}
              {language === "html" || language === "css" ? (
                <div className={styles.previewSection}>
                  <div className={styles.card}>
                    <div
                      className={`${styles.cardHeader} ${styles.cardHeaderFlex}`}
                    >
                      <h2 className={styles.cardTitle}>プレビュー</h2>
                      {/* プレビュー用のタブが必要ならここに実装 */}
                    </div>
                    <div className={styles.cardContent}>
                      <iframe
                        id="preview-iframe"
                        title="Code Preview"
                        className={styles.previewIframe}
                        sandbox="allow-scripts allow-forms allow-same-origin" // 重要なセキュリティ設定
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // HTML/CSS以外の言語の場合
                testResults.length > 0 && (
                  <div className={`${styles.card} ${styles.tabContent}`}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>実行結果</h2>
                      <p className={styles.cardDescription}>
                        テストケースの実行結果
                      </p>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.exampleContainer}>
                        {testResults.map((result) => (
                          <div
                            key={result.test_case_id}
                            className={`${styles.resultItem} ${
                              result.status === "passed"
                                ? styles.resultItemPassed
                                : styles.resultItemFailed
                            }`}
                          >
                            <div className={styles.resultHeader}>
                              <span className="font-medium">
                                テストケース {result.test_case_id}
                              </span>
                              <div className={styles.editorHeader}>
                                <span
                                  className={`${styles.resultStatus} ${
                                    result.status === "passed"
                                      ? styles.resultStatusPassed
                                      : styles.resultStatusFailed
                                  }`}
                                >
                                  {result.status === "passed" ? "成功" : "失敗"}
                                </span>
                                <span className={styles.resultTime}>
                                  {result.executionTime}ms
                                </span>
                              </div>
                            </div>
                            <div className={styles.resultBody}>
                              <div>
                                <span>出力:</span>
                                <pre>{result.expected_output}</pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
