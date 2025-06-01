import style from "./SignupForm.module.css";

export const SignupForm = () => {
  const genderOption = [
    { id: 1, gender: "男性" },
    { id: 2, gender: "女性" },
    { id: 3, gender: "その他" },
    { id: 3, gender: "未回答" },
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
      <div className={style.inputGrid}>
        <div>
          <p className={style.inputLabel}>姓</p>
          <input className={style.inputForm} type="text" placeholder="姓" />
        </div>
        <div>
          <p className={style.inputLabel}>名</p>
          <input className={style.inputForm} type="text" placeholder="名" />
        </div>
        <div className={style.inputFullWidth}>
          <p className={style.inputLabel}>メールアドレス</p>
          <input
            className={style.inputForm}
            type="text"
            placeholder="example@email.com"
          />
        </div>
        <div className={style.inputFullWidth}>
          <p className={style.inputLabel}>パスワード</p>
          <input className={style.inputForm} type="password" />
        </div>
        <div className={style.inputFullWidth}>
          <p className={style.inputLabel}>住所</p>
          <input className={style.inputForm} type="text" />
        </div>
        <div>
          <p className={style.inputLabel}>姓</p>
          <select className={style.inputForm} name="" defaultValue="" id="">
            <option value="" disabled>
              性別を選択してください
            </option>
            {genderOption.map((item) => (
              <option value={item.gender}>{item.gender}</option>
            ))}
          </select>
        </div>
        <div>
          <p className={style.inputLabel}>年齢</p>
          <input
            className={style.inputForm}
            type="number"
            min={0}
            placeholder="年齢"
          />
        </div>
        <div className={style.inputFullWidth}>
          <p className={style.inputLabel}>職業</p>
          <select className={style.inputForm} name="" defaultValue="" id="">
            <option value="" disabled>
              現在の職業
            </option>
            {industryOption.map((item) => (
              <option value={item.industry}>{item.industry}</option>
            ))}
          </select>
        </div>
        <div className={style.inputFullWidth}>
          <input className={style.inputButton} type="submit" value={"登録"} />
        </div>
      </div>
    </div>
  );
};
