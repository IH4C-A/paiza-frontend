import type { User } from "./userTypes";

export type Comment = {
    comment_id: string;
    board_id: string;
    user_id: User;
    content: string;
    is_answered: boolean;
    created_at: string;
}