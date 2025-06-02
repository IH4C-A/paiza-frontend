import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zodバリデーションスキーマ
const signinSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("正しいメールアドレスの形式で入力してください"),
  password: z.string().min(1, "パスワードは必須です"),
});

export type SigninFormData = z.infer<typeof signinSchema>;

const useSignin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onChange", // リアルタイムバリデーション
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // フォーム送信処理
  const onSubmit = async (data: SigninFormData) => {
    // ここで実際のサインイン処理を行う
    // 例: API呼び出しなど
    try {
      // await signinUser(data);
      // 成功した場合の処理
      // 例: リダイレクト、トークン保存など
      console.log("サインイン処理を実行:", data);
    } catch (error) {
      console.error("サインインエラー:", error);
      // エラーハンドリング
      // 例: エラーメッセージの表示など
    }
  };

  return {
    // React Hook Formの機能
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,

    // バリデーションスキーマ
    schema: signinSchema,
  };
};

export default useSignin;
