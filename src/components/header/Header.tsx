import { FaBell } from "react-icons/fa";
import style from "./Header.module.css";
import { useEffect, useState } from "react";
import type { User } from "../../types/userTypes";

export const Header = () => {
  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      // トークンがなければスキップ
      if (!token) {
        console.warn("No token found. Skipping user fetch.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/login_user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // JSONを複数回呼ばないよう注意
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
        } else {
          // トークン期限切れなど
          console.error("Failed to fetch user:", data);
          // トークン削除などの処理を追加してもOK
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.navigationList}>
        <figure>
          <img src="/logo.png" alt="logo" width={250} />
        </figure>
        <a className={style.navigationLink} href="/">
          トップ
        </a>
        <a className={style.navigationLink} href="/mentor">
          メンター
        </a>
        <a className={style.navigationLink} href="/partner">
          うちのコ
        </a>
        <a className={style.navigationLink} href="/skillcheck">
          スキルチェック
        </a>
      </div>
      <div className={style.navigationList}>
        <a className={style.navigationLink} href="/">
          <FaBell className={style.navigationLink} />
        </a>
        {userData ? (
          <a className={style.navigationLink} href="/mypage">
            {userData.first_name}さん
          </a>
        ) : (
          <a className={style.navigationLink} href="/auth/signin">
            ログイン
          </a>
        )}
      </div>
    </div>
  );
};
