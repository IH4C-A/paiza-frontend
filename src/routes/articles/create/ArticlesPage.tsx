import React, { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import styles from "./ArticlesPage.module.css";
import { useRegisterArticle } from "../../../hooks/useArticle";

const MarkdownEditor: React.FC = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const { registerArticle } = useRegisterArticle();

  const handleSave = () => {
    alert("記事を下書き保存しました！（保存ロジックは後ほど実装）");
  };

  const handlePublish = () => {
    const article = {
      title,
      categoryids: tags.split(",").map((tag) => tag.trim()),
      content: markdown,
    };
    registerArticle(article)
      .then(() => {
        alert("記事を新しく登録しました！");
        setTitle("");
        setTags("");
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
        <input
          className={styles.editorTags}
          type="text"
          placeholder="タグ（カンマ区切り）"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
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
              {tags
                ? tags.split(",").map((tag, idx) => (
                    <span key={idx} className={styles.tagChip}>
                      #{tag.trim()}
                    </span>
                  ))
                : "タグなし"}
            </p>
            <div dangerouslySetInnerHTML={{__html: html}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
