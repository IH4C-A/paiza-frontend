import { SigninForm } from "./components/SigninForm";
import style from "./SigninPage.module.css";

export const SigninPage = () => {
  return (
    <div className={style.container}>
      <SigninForm />
    </div>
  );
};
