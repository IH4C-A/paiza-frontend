import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "../hooks/useUser"; // API呼び出しのための関数をインポート
import { useNavigate } from "react-router-dom";
// Zodバリデーションスキーマ
const signupSchema = z.object({
  last_name: z
    .string()
    .min(1, "姓は必須です")
    .max(20, "姓は20文字以内で入力してください"),
  first_name: z
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
  adrress: z
    .string()
    .min(1, "住所は必須です")
    .max(100, "住所は100文字以内で入力してください"),
  seibetu: z.string().min(1, "性別を選択してください"),
  age: z
    .string()
    .min(1, "年齢は必須です")
    .transform((val) => parseInt(val))
    .refine((val) => val >= 0 && val <= 150, {
      message: "正しい年齢を入力してください（0-150）",
    }),
  employment_status: z.string().min(1, "職業を選択してください"),
});

export type SignupFormData = z.infer<typeof signupSchema>;

const useSignup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // リアルタイムバリデーション
    defaultValues: {
      last_name: "",
      first_name: "",
      email: "",
      password: "",
      adrress: "",
      seibetu: "",
      age: "",
      employment_status: "",
    },
  });

  // useRegisterをカスタムフックのトップレベルで呼び出す
  const { register: registerUser } = useRegister();

  // フォーム送信処理
  const onSubmit = async (data: SignupFormData) => {
    
    // ここで実際の登録処理を行う
    // 例: API呼び出しなど
    try {
      await registerUser(data);
      navigate("/auth/signin"); // 登録成功後にログインページへリダイレクト
      console.log("登録処理を実行:", data);
    } catch (error) {
      console.error("登録エラー:", error);
      alert("エラー出田");
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
