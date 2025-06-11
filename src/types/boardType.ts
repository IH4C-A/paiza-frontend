import type { Category } from "./categoryType";
import type { User } from "./userTypes";

export type Board = {
    board_id: string;
    user_id: User;
    title: string;
    content: string;
    status: string;
    categories: Category;
    created_at: Date;
    updated_at: Date;
    comment_count: number;
}