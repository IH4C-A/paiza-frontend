import { useState, useEffect } from "react";
import type { Article } from "../types/articleType";

export const useArticlesWithCategories = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/articles');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Article[] = await response.json();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles with categories:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return { articles, loading, error, refetch: fetchArticles };
};

// 単体記事取得
export const useArticle = (articleId: string) => {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticle = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/articles/${articleId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Article = await response.json();
            setArticle(data);
        } catch (error) {
            console.error('Error fetching article:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [articleId]);

    return { article, loading, error, refetch: fetchArticle };
};

// 記事登録
export const useRegisterArticle = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const registerArticle = async (article: {
        title: string;
        content: string;
        categoryids?: string[];
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(article)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error registering article:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { registerArticle, loading, error };
};