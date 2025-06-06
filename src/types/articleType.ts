import type { Category } from "./categoryType";
import type { User } from "./userTypes";

export type Article = {
    article_id: string;
    user: User;
    title: string;
    content: string;
    categories: Category[];
    created_at: Date;
    updated_at: Date;
}

