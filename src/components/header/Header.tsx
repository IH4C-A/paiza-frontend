import { FaBell, FaBars } from "react-icons/fa";
import style from "./Header.module.css";
import { useCurrentUser } from "../../hooks/useUser";
import { usePlant } from "../../hooks/usePlant";
import type { Rank } from "../../types/rankType";
import { useState } from "react";

export const Header = () => {
  const { currentUser } = useCurrentUser();
  const { plant } = usePlant();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={style.container}>
      {/* ハンバーガー：スマホサイズ時 */}
      <button className={style.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </button>

      {/* ロゴ */}
      <figure className={style.logo}>
        <img src="/logo.png" alt="logo" width={250} />
      </figure>


      {/* ハンバーガー内メニュー */}
      <div className={`${style.responsiveMenu} ${menuOpen ? style.active : ""}`}>
        <a className={style.navigationLink} href="/">トップ</a>
        <a className={style.navigationLink} href="/mentor">メンター</a>
        {currentUser?.ranks?.some(
          (rank: Rank) => rank.rank_code === "mentor"
        ) ? (
          <a className={style.navigationLink} href="/mentor/applications">
            メンティー申請
          </a>
        ) : (
          <div className={style.hidden}></div>
        )}
        {plant ? (
          <a className={style.navigationLink} href="/partner">
            うちのコ
          </a>
        ) : (
          <a className={style.navigationLink} href="/partner/setup">
            うちのコ
          </a>
        )}
        <a className={style.navigationLink} href="/skillcheck">スキルチェック</a>
        <a className={style.navigationLink} href="/article">技術記事</a>
        <a className={style.navigationLink} href="/chats">チャット</a>
      </div>


      {/* 通知 + ログイン */}
      <div className={style.rightNav}>
        <a className={style.navigationLink} href="/notification">
          <FaBell />
        </a>
        {currentUser ? (
          <a className={style.navigationLink} href="/mypage">
            {currentUser.first_name}さん
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