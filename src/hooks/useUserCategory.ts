// UserCategoryモデルのバックエンドつなぎ合わせ
import { useState, useEffect } from 'react';
import type { UserCategory } from '../types/userCategoryType';

// tokenを使用したログインユーザーのカテゴリ一覧を取得するカスタムフック
export const useUserCategories = () => {
    const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/user_categories', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: UserCategory[] = await response.json();
            setUserCategories(data);
        } catch (error) {
            console.error('Error fetching user categories:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserCategories();
    }, []);

    return { userCategories, loading, error, refetch: fetchUserCategories };
}

// userCategoryを登録するカスタムフックcategoryは配列データとして渡したい
export const useRegisterUserCategory = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const registerUserCategory = async (categoryids: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/user_category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ categoryids })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error registering user category:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUserCategory };
}

// userCategoryを削除するカスタムフック
export const useDeleteUserCategory = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteUserCategory = async (categoryId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/user_category/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error deleting user category:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, deleteUserCategory };
}