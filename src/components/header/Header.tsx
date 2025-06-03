import { FaBell } from "react-icons/fa";
import style from "./Header.module.css";
import { useCurrentUser } from "../../hooks/useUser";

export const Header = () => {
  const { currentUser } = useCurrentUser();

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
