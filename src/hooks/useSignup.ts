import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAddress } from "jposta";
import { useRegister } from "../hooks/useUser";
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
  address_number: z
    .string()
    .min(7, "正しい形式ではありません")
    .max(7, "正しい形式ではありません"),
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
      message: "正しい年齢を入力してください(0-150)",
    }),
  employment_status: z.string().min(1, "職業を選択してください"),
  line_login_user_id: z.string().optional(),
});

export type SignupFormData = z.infer<typeof signupSchema>;

const useSignup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      last_name: "",
      first_name: "",
      email: "",
      password: "",
      address_number: "",
      adrress: "",
      seibetu: "",
      age: "",
      employment_status: "",
      line_login_user_id: "",
    },
  });

  const { register: registerUser } = useRegister();

  // 郵便番号検索機能
  const searchAddress = async () => {
    const postalCode = watch("address_number");

    if (!postalCode || postalCode.length !== 7) {
      alert("正しい郵便番号を入力してください（7桁）");
      return;
    }

    try {
      const addressData = await getAddress(postalCode);

      // addressDataが配列でない場合に備えて配列化
      const addressArray = Array.isArray(addressData)
        ? addressData
        : [addressData];

      if (addressArray && addressArray.length > 0) {
        // 最初の結果を使用
        const result = addressArray[0];

        console.log(result);

        // 都道府県 + 市区町村 + 町域名を結合して住所フィールドに設定
        const fullAddress = `${result.pref}${result.city}${result.area}`;
        setValue("adrress", fullAddress);

        console.log("住所検索結果:", result);
      } else {
        alert("該当する住所が見つかりませんでした");
      }
    } catch (error) {
      console.error("住所検索エラー:", error);
      alert("住所検索中にエラーが発生しました");
    }
  };

  // フォーム送信処理
  const onSubmit = async (data: SignupFormData) => {
    try {
      await registerUser(data);
      navigate("/auth/signin");
      console.log("登録処理を実行:", data);
    } catch (error) {
      console.error("登録エラー:", error);
      alert("エラーが発生しました");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    searchAddress, // 郵便番号検索機能を追加
    schema: signupSchema,
    setValue
  };
};

export default useSignup;
