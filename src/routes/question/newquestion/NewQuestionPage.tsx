import React, { useState } from "react";
// useNavigate を react-router-dom からインポート
import { useNavigate } from "react-router-dom";
import styles from "./NewQuestionPage.module.css";

export default function NewQuestionPage() {
  // useNavigateフックを呼び出す
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  // キャンセルボタンがクリックされたときの処理
  const handleCancelClick = () => {
    // '/question' にページ遷移する
    navigate('/question');
  };

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
                <p className={styles.cardDescription}>質問のタイトルと詳細を入力してください</p>
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
                <div className={styles.formField}>
                  <label htmlFor="category" className={styles.formLabel}>
                    カテゴリ
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="" disabled>カテゴリを選択</option>
                    <option value="algorithm">アルゴリズム</option>
                    <option value="web">Webフレームワーク</option>
                    <option value="design">UI/UX</option>
                    <option value="exam">情報処理試験</option>
                    <option value="other">その他</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label htmlFor="tags" className={styles.formLabel}>
                    タグ（最大5つ）
                  </label>
                  <div className={styles.tagsDisplayContainer}>
                    {tags.map((tag) => (
                      <div key={tag} className={styles.tagItem}>
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className={styles.removeTagButton}
                        >
                          <img src="/icons/x.svg" alt={`Remove ${tag}`} />
                          <span className={styles.srOnly}>Remove {tag}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className={styles.tagInputContainer}>
                    <input
                      id="tags"
                      placeholder="タグを入力してEnterキーを押してください"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className={`${styles.formInput} ${styles.tagInput}`}
                    />
                    <button type="button" onClick={addTag} className={styles.addButton}>
                      追加
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>質問の詳細</h2>
                    <p className={styles.cardDescription}>マークダウン形式で記述できますが、ここではプレーンテキストとして扱われます。</p>
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
              <button type="button" onClick={handleCancelClick} className={styles.formButtonOutline}>
                キャンセル
              </button>
              <button className={styles.formButtonPrimary}>
                質問を投稿
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}