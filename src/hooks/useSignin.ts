import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "./useUser";
import { useNavigate } from "react-router-dom";

// バリデーションスキーマ
const signinSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("正しいメールアドレスの形式で入力してください"),
  password: z.string().min(1, "パスワードは必須です"),
});

export type SigninFormData = z.infer<typeof signinSchema>;

const useSignin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useLogin();

  // 通常ログイン処理
  const onSubmit = async (data: SigninFormData) => {
    try {
      await login(data);
      navigate("/"); // 成功時リダイレクト
      console.log("✅ 通常ログイン成功:", data);
    } catch (error) {
      console.error("❌ ログイン失敗:", error);
    }
  };

  // LINEログイン処理
  const signInWithLineId = async (lineUserId: string) => {
    try {
      const res = await fetch("https://paiza-nurture-api.inrigsnet.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ line_user_id: lineUserId }),
      });

      const result = await res.json();

      if (res.ok && result.token) {
        // トークン保存やログイン状態の更新など
        localStorage.setItem("token", result.token);
        console.log("✅ LINEログイン成功:", result);
        navigate("/");
      } else {
        console.error("❌ LINEログイン失敗:", result);
      }
    } catch (err) {
      console.error("❌ LINEログイン中にエラー:", err);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    signInWithLineId, // LINEログイン関数を公開
    schema: signinSchema,
  };
};

export default useSignin;
