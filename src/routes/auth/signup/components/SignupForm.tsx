import useSignup from "../../../../hooks/useSignup";
import style from "./SignupForm.module.css";

export const SignupForm = () => {
  const { register, handleSubmit, errors } = useSignup();

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

  return (
    <div className={style.container}>
      <h1 className={style.formTitle}>新規登録</h1>

      {/* handleSubmitでフォーム送信を処理 */}
      <form onSubmit={handleSubmit}>
        <div className={style.inputGrid}>
          <div>
            <p className={style.inputLabel}>姓</p>
            <input
              className={style.inputForm}
              type="text"
              placeholder="姓"
              {...register("lastname")}
            />
            {errors.lastname && (
              <p className={style.errorMessage}>{errors.lastname.message}</p>
            )}
          </div>

          <div>
            <p className={style.inputLabel}>名</p>
            <input
              className={style.inputForm}
              type="text"
              placeholder="名"
              {...register("firstname")}
            />
            {errors.firstname && (
              <p className={style.errorMessage}>{errors.firstname.message}</p>
            )}
          </div>

          <div className={style.inputFullWidth}>
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

          <div className={style.inputFullWidth}>
            <p className={style.inputLabel}>パスワード</p>
            <input
              className={style.inputForm}
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className={style.errorMessage}>{errors.password.message}</p>
            )}
          </div>

          <div className={style.inputFullWidth}>
            <p className={style.inputLabel}>住所</p>
            <input
              className={style.inputForm}
              type="text"
              {...register("address")}
            />
            {errors.address && (
              <p className={style.errorMessage}>{errors.address.message}</p>
            )}
          </div>

          <div>
            <p className={style.inputLabel}>性別</p>
            <select className={style.inputForm} {...register("gender")}>
              <option value="">性別を選択してください</option>
              {genderOption.map((item) => (
                <option key={item.id} value={item.gender}>
                  {item.gender}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className={style.errorMessage}>{errors.gender.message}</p>
            )}
          </div>

          <div>
            <p className={style.inputLabel}>年齢</p>
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
            <p className={style.inputLabel}>職業</p>
            <select className={style.inputForm} {...register("industry")}>
              <option value="">現在の職業</option>
              {industryOption.map((item) => (
                <option key={item.id} value={item.industry}>
                  {item.industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className={style.errorMessage}>{errors.industry.message}</p>
            )}
          </div>

          <div className={style.inputFullWidth}>
            <input className={style.inputButton} type="submit" value="登録" />
          </div>
        </div>
      </form>
    </div>
  );
};
