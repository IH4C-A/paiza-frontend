import useSignin from "../../../../hooks/useSignin";
import style from "./SigninForm.module.css";

export const SigninForm = () => {
  const { register, handleSubmit, errors } = useSignin();

  return (
    <div className={style.container}>
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
