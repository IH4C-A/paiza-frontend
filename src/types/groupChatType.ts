import type { Category } from "./categoryType";
import type { Rank } from "./rankType";

export type GroupChat = {
    group_id: string;
    group_name: string;
    group_image: string | null;
    created_at: Date;
    created_by: string;
    memberCount: number;
}

export type GroupChatMember = {
    group_id: string;
    id: string;
    name: string;
    prof_image: string | null;
    rank: Rank;
}

export type GroupChats = {
    group_id: string;
    group_name: string;
    group_image: string | null;
    created_at: Date;
    created_by: string;
    description: string;
    category: Category | null;
    last_message: string | null;
    unread_count: number;
    member_count: number;
}