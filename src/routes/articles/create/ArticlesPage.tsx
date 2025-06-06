import React, { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import styles from "./ArticlesPage.module.css";
import { useRegisterArticle } from "../../../hooks/useArticle";
import { useCategories } from "../../../hooks/useCategory";

const MarkdownEditor: React.FC = () => {
  const [title, setTitle] = useState("");
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const { registerArticle } = useRegisterArticle();
  const { categories } = useCategories();

  const handleSave = () => {
    alert("記事を下書き保存しました！（保存ロジックは後ほど実装）");
  };

  const handleCategoryClick = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handlePublish = () => {
    const article = {
      title,
      categoryids: selectedCategoryIds,
      content: markdown,
    };
    registerArticle(article)
      .then(() => {
        alert("記事を新しく登録しました！");
        setTitle("");
        setSelectedCategoryIds([]);
        setMarkdown("");
      })
      .catch((error) => {
        console.error("記事の保存に失敗しました:", error);
        alert("記事の保存に失敗しました。");
      });
  };

  useEffect(() => {
    const processMarkdown = async () => {
      const rawHtml = await marked.parse(markdown, { breaks: true, gfm: true });
      setHtml(DOMPurify.sanitize(rawHtml));
    };
    processMarkdown();
  }, [markdown]);

  // ユニークな category_code を取得
  const categoryCodes = Array.from(new Set(categories.map(c => c.category_code)));

  // 表示対象のカテゴリだけ絞り込む
  const filteredCategories = categories.filter(
    (c) => c.category_code === selectedCategoryCode
  );

  return (
    <div className={styles.editorCard}>
      <div className={styles.editorHeader}>
        <input
          className={styles.editorTitle}
          type="text"
          placeholder="タイトルを入力..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ▼ category_code 切替ボタン */}
        <div style={{ marginBottom: "8px" }}>
          {categoryCodes.map((code) => (
            <button
              key={code}
              onClick={() => setSelectedCategoryCode(code)}
              className={`${styles.codeButton} ${
                selectedCategoryCode === code ? styles.codeButtonActive : ""
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        {/* ▼ category_name バッジ（複数選択） */}
        <div style={{ marginBottom: "16px" }}>
          {filteredCategories.map((cat) => {
            const isSelected = selectedCategoryIds.includes(cat.category_id);
            return (
              <span
                key={cat.category_id}
                className={`${styles.tagChip} ${isSelected ? styles.selected : ""}`}
                onClick={() => handleCategoryClick(cat.category_id)}
              >
                {cat.category_name}
              </span>
            );
          })}
        </div>

        <div className={styles.editorButtons}>
          <button onClick={handleSave}>下書き保存</button>
          <button onClick={handlePublish}>公開する</button>
        </div>
      </div>

      <div className={styles.markdownEditorContainer}>
        <div className={styles.editorPane}>
          <textarea
            className={styles.editorTextarea}
            placeholder="ここにMarkdownを入力..."
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
        <div className={styles.previewPane}>
          <div className={styles.previewContent}>
            <h1>{title || "タイトル（プレビュー）"}</h1>
            <p>
              {selectedCategoryIds.length > 0 ? (
                selectedCategoryIds.map((id) => {
                  const category = categories.find((c) => c.category_id === id);
                  return (
                    <span key={id} className={styles.tagChip}>
                      #{category?.category_name}
                    </span>
                  );
                })
              ) : (
                "タグなし"
              )}
            </p>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
