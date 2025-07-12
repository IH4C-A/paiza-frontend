// src/pages/LineConnect.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import styles from "./LineConnect.module.css";

export const LineConnect = () => {
  const [searchParams] = useSearchParams();
  const [isConnected, setIsConnected] = useState(false);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const botFriendUrl = "https://lin.ee/fVQb7u3"; // ✅ あなたのBot URLに変更

  // Webhook完了確認（APIにポーリング）
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      setChecking(true);
      const res = await fetch(`https://paiza-nurture-api.inrigsnet.com/api/line/check_connection?token=${token}`);
      const data = await res.json();

      if (data.connected) {
        clearInterval(interval);
        setIsConnected(true);
        setTimeout(() => {
          navigate("/auth/signin"); // ✅ 通知連携完了後の遷移先
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>LINE通知の連携</h1>

      <p className={styles.description}>
        LINEからのお知らせを受け取るには、以下からBotを友だち追加してください。
      </p>

      {/* 友だち追加リンク */}
      <a
        href={botFriendUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.addButton}
      >
        📲 LINEでBotを追加する
      </a>

      {/* QRコードも併用 */}
      <div className={styles.qrContainer}>
        <p className={styles.qrLabel}>スマホでQRコードを読み取って追加：</p>
        <QRCodeSVG value={botFriendUrl} size={180} />
      </div>

      <div className={styles.statusContainer}>
        {checking && !isConnected && (
          <p className={styles.checkingText}>連携を確認中... Botを友だち追加しましたか？</p>
        )}
        {isConnected && (
          <p className={styles.successText}>✅ 連携が完了しました！</p>
        )}
      </div>
    </div>
  );
};
