import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zodバリデーションスキーマ
const signupSchema = z.object({
  lastname: z
    .string()
    .min(1, "姓は必須です")
    .max(20, "姓は20文字以内で入力してください"),
  firstname: z
    .string()
    .min(1, "名は必須です")
    .max(20, "名は20文字以内で入力してください"),
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("正しいメールアドレスの形式で入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "パスワードは大文字、小文字、数字を含む必要があります"
    ),
  address: z
    .string()
    .min(1, "住所は必須です")
    .max(100, "住所は100文字以内で入力してください"),
  gender: z.string().min(1, "性別を選択してください"),
  age: z
    .string()
    .min(1, "年齢は必須です")
    .transform((val) => parseInt(val))
    .refine((val) => val >= 0 && val <= 150, {
      message: "正しい年齢を入力してください（0-150）",
    }),
  industry: z.string().min(1, "職業を選択してください"),
});

export type SignupFormData = z.infer<typeof signupSchema>;

const useSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // リアルタイムバリデーション
    defaultValues: {
      lastname: "",
      firstname: "",
      email: "",
      password: "",
      address: "",
      gender: "",
      age: "",
      industry: "",
    },
  });

  // フォーム送信処理
  const onSubmit = (data: SignupFormData) => {
    // ここで実際の登録処理を行う
    // 例: API呼び出しなど
    try {
      // await registerUser(data);
      // 成功した場合はフォームをリセット
      // reset();
      console.log("登録処理を実行:", data);
    } catch (error) {
      console.error("登録エラー:", error);
    }
  };

  return {
    // React Hook Formの機能
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    // バリデーションスキーマ
    schema: signupSchema,
  };
};

export default useSignup;
