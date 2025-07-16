export type Chats = {
  chat_id: string; // または number
  message: string | null;
  image: string | null; // 画像ファイル名
  code: string | null; // コードスニペット (バックエンドが返す場合)
  sender: string; // フロントエンドで表示するsender名 (例: first_name)
  send_user_id: string; // 送信者のユーザーID
  receiver_user_id?: string; // 受信者のユーザーID (個人チャットの場合)
  group_id?: string; // グループID (グループチャットの場合)
  chat_at: string; // 日時文字列
  type: 'text' | 'image' | 'code'; // メッセージタイプ
  // ... その他のプロパティ
};

export type ChatHistory = {
    message: string | null;
    image: string | null;
    sender: string;
    receiver: string;
    chat_at: Date;
}

export type GroupChatHistory = {
    chat_id: string;
    message: string | null;
    timestamp: Date;
    send_user_id: string;
    group_id: string;
    sender_name: string;
    profile_image: string | null;
    type: string;
}

export type ChatUsers = {
    user_id: string;
    user_name: string;
    profile_image: string | null;
    last_message: string | null;
    last_chat_at: Date;
    unread_count: number;
}