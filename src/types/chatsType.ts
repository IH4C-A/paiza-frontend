export type Chats = {
    chat_id: string;
    message: string | null;
    image: string | null;
    sender: string;
    receiver_user_id: string | null;
    group_id: string | null;
    chat_at: Date;
    type: string;
}

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