
export type ArticleCategory = {
    category_id: string;
    category_name: string;
    category_code: string;
}

export type ArticleCategoryAll = {
    category_id: string;
    article_category_id: string;
    article_id: string;
    user_id: string;
    title: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}