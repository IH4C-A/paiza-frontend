import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import styles from "./ArticlesPage.module.css";

const MarkdownEditor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [markdown, setMarkdown] = useState('');

  const handleSave = () => {
    const article = {
      title,
      tags: tags.split(',').map((tag) => tag.trim()),
      content: markdown,
      date: new Date().toISOString(),
    };
    // 仮の保存 → ローカルStorage
    localStorage.setItem('draft_article', JSON.stringify(article));
    alert('下書きを保存しました！');
  };

  const handlePublish = () => {
    alert('記事を公開しました！（保存ロジックは後ほど実装）');
  };

  const getSanitizedHtml = () => {
    const rawHtml = marked.parse(markdown, { breaks: true, gfm: true });
    return { __html: DOMPurify.sanitize(rawHtml) };
  };

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
            <h1>{title || 'タイトル（プレビュー）'}</h1>
            <p>
              {tags
                ? tags.split(',').map((tag, idx) => (
                    <span key={idx} className={styles.tagChip}>
                      #{tag.trim()}
                    </span>
                  ))
                : 'タグなし'}
            </p>
            <div dangerouslySetInnerHTML={getSanitizedHtml()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
