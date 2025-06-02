import { SignupForm } from "./components/SignupForm";
import style from "./SignupPage.module.css";

export const SignupPage = () => {
  return (
    <div className={style.container}>
      <SignupForm />
    </div>
  );
};
