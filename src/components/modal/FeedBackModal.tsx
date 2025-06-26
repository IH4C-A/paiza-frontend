// MentorshipFeedbackModal.tsx
import React, { useState } from 'react';
import styles from './MentorshipFeedbackModal.module.css';

interface MentorshipFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  mentorName: string; // Assuming you want to display the mentor's name
}

const MentorshipFeedbackModal: React.FC<MentorshipFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mentorName,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setRating(0); // Reset for next use
    setComment(''); // Reset for next use
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{mentorName}さんの評価</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${rating >= star ? styles.filled : ''}`}
                onClick={() => setRating(star)}
              >
                &#9733; {/* Unicode for a star character */}
              </span>
            ))}
          </div>
          <div className={styles.commentContainer}>
            <label htmlFor="comment">コメント（任意）:</label>
            <textarea
              id="comment"
              className={styles.commentTextarea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            ></textarea>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              評価を送信
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorshipFeedbackModal;