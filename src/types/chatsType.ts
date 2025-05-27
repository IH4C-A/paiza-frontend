export type Chats = {
    chat_id: string;
    message: string | null;
    image: string | null;
    send_user_id: string;
    receiver_user_id: string | null;
    group_id: string | null;
    chat_at: Date;
}