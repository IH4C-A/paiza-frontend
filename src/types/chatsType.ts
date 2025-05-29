export type Chats = {
    chat_id: string;
    message: string | null;
    image: string | null;
    send_user_id: string;
    receiver_user_id: string | null;
    group_id: string | null;
    chat_at: Date;
}

export type ChatHistory = {
    message: string | null;
    image: string | null;
    sender: string;
    receiver: string;
    chat_at: Date;
}

export type GroupChatHistory = {
    message: string | null;
    timestamp: Date;
    sender_user_id: string;
    group_id: string;
    sender_name: string;
    profile_image: string | null;
}

export type ChatUsers = {
    user_id: string;
    user_name: string;
    profile_image: string | null;
}