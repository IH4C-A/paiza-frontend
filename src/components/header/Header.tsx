import { FaBell } from "react-icons/fa";
import style from "./Header.module.css";
import { useCurrentUser } from "../../hooks/useUser";
import { usePlant } from "../../hooks/usePlant";
import type { Rank } from "../../types/rankType";

export const Header = () => {
  const { currentUser } = useCurrentUser();
  const { plant } = usePlant();

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
        {currentUser?.ranks?.some((rank: Rank) => rank.rank_code === "mentor") ? (
        <a className={style.navigationLink} href="/mentor/applications">
          メンティー申請
        </a>
        ) : (
          <div></div>
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
        <a className={style.navigationLink} href="/skillcheck">
          スキルチェック
        </a>
        <a className={style.navigationLink} href="/article">
          技術記事
        </a>
        <a className={style.navigationLink} href="/chats">
          チャット
        </a>
      </div>
      <div className={style.navigationList}>
        <a className={style.navigationLink} href="/notification">
          <FaBell className={style.navigationLink} />
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
