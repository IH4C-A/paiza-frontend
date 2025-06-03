import type { Category } from "./categoryType";

export type Article = {
    article_id: string;
    user_id: string;
    title: string;
    content: string;
    categories: Category[];
    created_at: Date;
    updated_at: Date;
}

