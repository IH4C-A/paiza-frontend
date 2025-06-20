import React, { useState } from "react";
import styles from "./CategoryModal.module.css";
import { useCategories, useRegisterUserCategory } from "../../hooks";
import { useCurrentUser } from "../../hooks";
type Props = {
  onClose: () => void;
};
const CategoryModal: React.FC<Props> = ({ onClose }) => {
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [categoryids, setSelectedIds] = useState<string[]>([]);
  const { categories } = useCategories();
  const { registerUserCategory, loading } = useRegisterUserCategory();
  const { currentUser } = useCurrentUser();
  const uniqueCodes = Array.from(
    new Set(categories.map((cat) => cat.category_code))
  );

  const filteredCategories = categories.filter(
    (cat) => cat.category_code === activeCode
  );

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const [checkboxNoneSelected, setCheckboxNoneSelected] = useState(false);

  const handleNoneSelectedChange = () => {
    setCheckboxNoneSelected((prev) => !prev);
    setSelectedIds([]); // 他の選択をクリア
  };

  const handleSubmit = () => {
    if (currentUser) {
      const toRegister = checkboxNoneSelected ? [] : categoryids;
      registerUserCategory(toRegister);
      alert("ロール付加完了");
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h1>カテゴリー選択</h1>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.tabContainer}>
          {uniqueCodes.map((code) => (
            <button
              key={code}
              className={`${styles.tabButton} ${
                code === activeCode ? styles.active : ""
              }`}
              onClick={() => setActiveCode(code)}
            >
              {code}
            </button>
          ))}
        </div>

        <div className={styles.categoryList}>
          {filteredCategories.map((cat) => {
            const isSelected = categoryids.includes(cat.category_id);
            return (
              <button
                key={cat.category_id}
                type="button"
                disabled={checkboxNoneSelected}
                onClick={() => toggle(cat.category_id)}
                className={`${styles.categoryButton} ${
                  isSelected ? styles.selected : ""
                }`}
              >
                {cat.category_name}
              </button>
            );
          })}
        </div>
        <div className={styles.noneSelect}>
          <label>
            <input
              type="checkbox"
              checked={checkboxNoneSelected}
              onChange={handleNoneSelectedChange}
            />
            ロールを付加しない
          </label>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={onClose}>キャンセル</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "登録中..." : "登録する"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
