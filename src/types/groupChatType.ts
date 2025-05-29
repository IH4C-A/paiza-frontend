export type GroupChat = {
    group_id: string;
    group_name: string;
    group_image: string | null;
    created_at: Date;
    created_by: string;
}

export type GroupChatMember = {
    group_id: string;
    user_id: string;
    user_name: string;
    user_image: string | null;
}