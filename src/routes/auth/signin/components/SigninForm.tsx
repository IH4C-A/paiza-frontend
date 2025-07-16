import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useSignin from "../../../../hooks/useSignin";
import style from "./SigninForm.module.css";

export const SigninForm = () => {
  const { register, handleSubmit, errors, signInWithLineId } = useSignin();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const LINE_CHANNEL_ID = "2007736198";
  const LINE_LOGIN_REDIRECT_URI =
    "https://paiza-nurture-api.inrigsnet.com/api/line/callback";

  // ✅ 戻るボタンの処理
  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

  // ✅ LINEログインに遷移（LINE公式ログイン画面へリダイレクト）
  const redirectToLineLogin = () => {
    const redirectUri = encodeURIComponent(LINE_LOGIN_REDIRECT_URI);
    const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CHANNEL_ID}&redirect_uri=${redirectUri}&state=signin&scope=openid%20profile%20email`;

    window.location.href = loginUrl;
  };

  // ✅ コールバック後にline_user_idからログイン処理
  const tryLineLoginFromLocalStorage = async () => {
    const line_user_id = localStorage.getItem("line_user_id");
    if (line_user_id) {
      await signInWithLineId(line_user_id);
    } else {
      alert("LINEログインIDが見つかりません");
    }
  };

  // ✅ 初回マウント時にURLからline_user_idをチェックして自動ログイン
  useEffect(() => {
    const id = searchParams.get("line_user_id");
    if (id) {
      localStorage.setItem("line_user_id", id); // 保存
      tryLineLoginFromLocalStorage(); // 自動ログイン
    }
  }, []);

  return (
    <div className={style.container}>
      {/* 戻るボタン */}
      <button className={style.backButton} onClick={handleBack} type="button">
        <FaArrowLeft className={style.backIcon} />
        戻る
      </button>

      <h1 className={style.formTitle}>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div className={style.inputContainer}>
          <div>
            <p className={style.inputLabel}>メールアドレス</p>
            <input
              className={style.inputForm}
              type="email"
              placeholder="example@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className={style.errorMessage}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <p className={style.inputLabel}>パスワード</p>
            <input
              className={style.inputForm}
              type="password"
              placeholder="パスワードを入力してください"
              {...register("password")}
            />
            {errors.password && (
              <p className={style.errorMessage}>{errors.password.message}</p>
            )}
          </div>

          <div>
            <p className={style.forgetPassword}>
              パスワードを忘れた方は
              <a className={style.linkMessage} href="/">
                こちら
              </a>
            </p>
          </div>

          <div className={style.inputContainer}>
            <input
              className={style.inputButton}
              type="submit"
              value="ログイン"
            />
          </div>

          <div>
            <p className={style.centerText}>または</p>
          </div>

          <div className={style.inputContainer}>
            <input
              className={style.googleLoginButton}
              type="button"
              value="Googleでログイン"
            />
          </div>

          <div className={style.inputContainer}>
            <input
              className={style.lineLoginButton}
              type="button"
              onClick={redirectToLineLogin}
              value="LINEでログイン"
            />
          </div>

          <div>
            <p className={style.centerText}>
              アカウントをお持ちでない方は
              <a className={style.linkMessage} href="/auth/signup">
                新規登録
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
