import { useState, useEffect } from "react";
import type { ArticleCategory, ArticleCategoryAll } from "../types/articleCategoryType";

export const useArticleCategories = () => {
    const [articleCategories, setArticleCategories] = useState<ArticleCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticleCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/articlecategories');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ArticleCategory[] = await response.json();
            setArticleCategories(data);
        } catch (error) {
            console.error('Error fetching article categories:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticleCategories();
    }, []);

    return { articleCategories, loading, error, refetch: fetchArticleCategories };
}

// category_idを指定して記事カテゴリーを取得するカスタムフック
export const useArticleCategoryByCategoryId = (categoryId: string) => {
    const [articleCategories, setArticleCategories] = useState<ArticleCategoryAll[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticleCategoriesByCategoryId = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/articles/category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ArticleCategoryAll[] = await response.json();
            setArticleCategories(data);
        } catch (error) {
            console.error('Error fetching article categories by category ID:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticleCategoriesByCategoryId();
    }, [categoryId]);

    return { articleCategories, loading, error, refetch: fetchArticleCategoriesByCategoryId };
}