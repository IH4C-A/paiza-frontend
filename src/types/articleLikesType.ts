export type ArticleLikes = {
    article_like_id: string;
    user_id: string;
    article_id: string;
}

export type ArticleLikesAll = {
    article_like_id: string;
    user_id: string;
    article_id: string;
    title: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}

export type ArticleLikesCount = {
    article_id: string;
    like_count: number;
    like: string;
}

export type ArticleLikeStatus = {
  article_id: string;
  liked: boolean;
};
