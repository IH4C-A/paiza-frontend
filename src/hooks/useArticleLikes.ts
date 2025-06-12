import { useState, useEffect } from "react";
import type { ArticleLikesAll, ArticleLikesCount } from "../types/articleLikesType";

export const useArticleLikes = () => {
    const [articleLikes, setArticleLikes] = useState<ArticleLikesAll[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticleLikes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/articlelikes',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ArticleLikesAll[] = await response.json();
            setArticleLikes(data);
        } catch (error) {
            console.error('Error fetching article likes:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticleLikes();
    }, []);

    return { articleLikes, loading, error, refetch: fetchArticleLikes };
}

// いいね登録
export const useArticleLike = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addArticleLike = async (articleId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/articlelikes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ article_id: articleId }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error adding article like:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, addArticleLike };
}

// いいね数取得
export const useArticleLikesCount = (article_id: string) => {
    const [articleLikesCount, setArticleLikesCount] = useState<ArticleLikesCount | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticleLikesCount = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/articlelikes/count/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ArticleLikesCount = await response.json();
            setArticleLikesCount(data);
        } catch (error) {
            console.error('Error fetching article likes count:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (article_id) {
            fetchArticleLikesCount(article_id);
        }
    }, [article_id]);

    return { articleLikesCount, loading, error, refetch: fetchArticleLikesCount };
}