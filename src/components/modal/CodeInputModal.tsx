"use client";

import React, { useState } from "react";
import styles from "./CodeInputModal.module.css"; // CSSモジュールをインポート
import { HiOutlineCodeBracket } from "react-icons/hi2";

type CodeInputModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
};

export default function CodeInputModal({ isOpen, onClose, onSubmit }: CodeInputModalProps) {
  const [code, setCode] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit(code);
    setCode(""); // 入力フィールドをクリア
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <HiOutlineCodeBracket className={styles.modalIcon} />
          <h2 className={styles.modalTitle}>コードを送信</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <textarea
            className={styles.codeInput}
            placeholder="ここにコードを入力してください..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
          ></textarea>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!code.trim()}
            className={styles.submitButton}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}