import React, { useState } from "react";
// useNavigate を react-router-dom からインポート
import { useNavigate } from "react-router-dom";
import styles from "./NewQuestionPage.module.css";
import { useCategories } from "../../../hooks/useCategory";
import { useCreateBoard } from "../../../hooks/useBoard";

export default function NewQuestionPage() {
  // useNavigateフックを呼び出す
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const { categories } = useCategories();
  const { createBoard } = useCreateBoard();

  const handleCategoryClick = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  // ユニークな category_code を取得
  const categoryCodes = Array.from(
    new Set(categories.map((c) => c.category_code))
  );

  // 表示対象のカテゴリだけ絞り込む
  const filteredCategories = categories.filter(
    (c) => c.category_code === selectedCategoryCode
  );

  // キャンセルボタンがクリックされたときの処理
  const handleCancelClick = () => {
    // '/question' にページ遷移する
    navigate("/question");
  };

  const handleCreateClick = () => {
    const newBoard = {
      title,
      content,
      status: "on",
      categories: selectedCategoryIds
    };
    createBoard(newBoard)
      .then(() => {
        alert("質問を投稿しました！");
        setTitle("");
        setSelectedCategoryIds([]);
        setContent("");
        setSelectedCategoryCode("");
        navigate("/question")
      })
      .catch((error) => {
        console.error("質問の投稿に失敗しました:", error);
        alert("質問の投稿に失敗しました");
      })

  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <h1 className={styles.titleTextH1}>新しい質問を投稿</h1>
            <p className={styles.titleTextP}>
              プログラミングに関する質問を投稿して、他のユーザーからの回答を得ましょう
            </p>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>質問内容</h2>
                <p className={styles.cardDescription}>
                  質問のタイトルと詳細を入力してください
                </p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.formField}>
                  <label htmlFor="title" className={styles.formLabel}>
                    タイトル
                  </label>
                  <input
                    id="title"
                    placeholder="質問のタイトルを入力してください"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                {/* ▼ category_code 切替ボタン */}
                <div style={{ marginBottom: "8px" }}>
                  {categoryCodes.map((code) => (
                    <button
                      key={code}
                      onClick={() => setSelectedCategoryCode(code)}
                      className={`${styles.codeButton} ${
                        selectedCategoryCode === code
                          ? styles.codeButtonActive
                          : ""
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>

                {/* ▼ category_name バッジ（複数選択） */}
                <div style={{ marginBottom: "16px" }}>
                  {filteredCategories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(
                      cat.category_id
                    );
                    return (
                      <span
                        key={cat.category_id}
                        className={`${styles.tagChip} ${
                          isSelected ? styles.selected : ""
                        }`}
                        onClick={() => handleCategoryClick(cat.category_id)}
                      >
                        {cat.category_name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>質問の詳細</h2>
                <p className={styles.cardDescription}>
                  マークダウン形式で記述できますが、ここではプレーンテキストとして扱われます。
                </p>
              </div>
              <div className={styles.cardContent}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="質問の詳細を入力してください..."
                  className={styles.formTextarea}
                />
              </div>
            </div>

            <div className={styles.actionsContainer}>
              <button
                type="button"
                onClick={handleCancelClick}
                className={styles.formButtonOutline}
              >
                キャンセル
              </button>
              <button className={styles.formButtonPrimary} onClick={handleCreateClick}>質問を投稿</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
