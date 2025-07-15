import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaLine, FaArrowLeft } from "react-icons/fa";
import useSignup from "../../../../hooks/useSignup";
import style from "./SignupForm.module.css";

export const SignupForm = () => {
  const { register, handleSubmit, searchAddress, errors, setValue } =
    useSignup();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const line_user_id = params.get("line_user_id");

  // ✅ 戻るボタンの処理
  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

  useEffect(() => {
    if (line_user_id) {
      setValue("line_login_user_id", line_user_id); // react-hook-form にセット
    }
  }, [line_user_id]);

  const genderOption = [
    { id: 1, gender: "男性" },
    { id: 2, gender: "女性" },
    { id: 3, gender: "その他" },
    { id: 4, gender: "未回答" },
  ];

  const industryOption = [
    { id: 1, industry: "学生" },
    { id: 2, industry: "社会人(IT系)" },
    { id: 3, industry: "社会人(IT系以外)" },
    { id: 4, industry: "その他" },
  ];

  const LINE_CHANNEL_ID = "2007736198";
  const LINE_LOGIN_REDIRECT_URI =
    "https://paiza-nurture-api.inrigsnet.com/api/line/callback";

  const handleLineLogin = () => {
    const redirectUri = encodeURIComponent(LINE_LOGIN_REDIRECT_URI);
    const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CHANNEL_ID}&redirect_uri=${redirectUri}&state=signup&scope=openid profile email`;

    window.location.href = loginUrl;
  };

  return (
    <div className={style.container}>
      {/* 戻るボタン */}
      <button className={style.backButton} onClick={handleBack} type="button">
        <FaArrowLeft className={style.backIcon} />
        戻る
      </button>

      <h1 className={style.formTitle}>新規登録</h1>

      {/* handleSubmitでフォーム送信を処理 */}
      <form onSubmit={handleSubmit}>
        <div className={style.inputGrid}>
          <div>
            <label>姓</label>
            <input
              className={style.inputForm}
              type="text"
              placeholder="姓"
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className={style.errorMessage}>{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label>名</label>
            <input
              className={style.inputForm}
              type="text"
              placeholder="名"
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className={style.errorMessage}>{errors.first_name.message}</p>
            )}
          </div>

          <div className={style.inputFullWidth}>
            <label>メールアドレス</label>
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

          <div className={style.inputFullWidth}>
            <label>パスワード</label>
            <input
              className={style.inputForm}
              type="password"
              placeholder="8文字以上、大文字・小文字・数字を含むパスワード"
              {...register("password")}
            />
            {errors.password && (
              <p className={style.errorMessage}>{errors.password.message}</p>
            )}
          </div>

          <div className={style.inputFullWidth}>
            <label>郵便番号</label>
            <div className={style.addressSearch}>
              <input
                className={style.addressNumberInput}
                type="text"
                {...register("address_number")}
              />
              <div>
                <input
                  className={style.addressSearchButton}
                  type="button"
                  value="検索"
                  onClick={searchAddress}
                />
              </div>
            </div>
            {errors.adrress && (
              <p className={style.errorMessage}>{errors.adrress.message}</p>
            )}
          </div>

          <div className={style.inputFullWidth}>
            <label>住所</label>
            <input
              className={style.inputForm}
              type="text"
              {...register("adrress")}
            />
            {errors.adrress && (
              <p className={style.errorMessage}>{errors.adrress.message}</p>
            )}
          </div>

          <div>
            <label>性別</label>
            <select className={style.inputForm} {...register("seibetu")}>
              <option value="">性別を選択してください</option>
              {genderOption.map((item) => (
                <option key={item.id} value={item.gender}>
                  {item.gender}
                </option>
              ))}
            </select>
            {errors.seibetu && (
              <p className={style.errorMessage}>{errors.seibetu.message}</p>
            )}
          </div>

          <div>
            <label>年齢</label>
            <input
              className={style.inputForm}
              type="number"
              min={0}
              placeholder="年齢"
              {...register("age")}
            />
            {errors.age && (
              <p className={style.errorMessage}>{errors.age.message}</p>
            )}
          </div>

          <div className={style.inputFullWidth}>
            <label className={style.inputLabel}>職業</label>
            <select
              className={style.inputForm}
              {...register("employment_status")}
            >
              <option value="現在の職業">現在の職業</option>
              {industryOption.map((item) => (
                <option key={item.id} value={item.industry}>
                  {item.industry}
                </option>
              ))}
            </select>
            {errors.employment_status && (
              <p className={style.errorMessage}>
                {errors.employment_status.message}
              </p>
            )}
          </div>
          <div className={style.inputFullWidth}>
            <button
              type="button"
              onClick={handleLineLogin}
              className={style.lineButton}
            >
              <FaLine />
              <span>LINEアカウントと連携</span>
            </button>
            <input type="hidden" {...register("line_login_user_id")} />
          </div>

          <div className={style.inputFullWidth}>
            <input className={style.inputButton} type="submit" value="登録" />
          </div>
        </div>
      </form>
    </div>
  );
};