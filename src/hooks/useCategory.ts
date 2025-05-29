import { useState, useEffect } from "react";
import type { Category } from "../types/categoryType";

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/categorys');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Category[] = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories, loading, error, refetch: fetchCategories };
};

// カテゴリ単体取得
export const useCategory = (categoryId: string) => {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/categorys/${categoryId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Category = await response.json();
            setCategory(data);
        } catch (error) {
            console.error('Error fetching category:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [categoryId]);

    return { category, loading, error, refetch: fetchCategory };
};