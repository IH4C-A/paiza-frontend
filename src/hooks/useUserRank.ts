import { useState, useEffect } from "react";
import type { UserRank } from "../types/userRankType";

export const useUserRanks = () => {
    const [userRanks, setUserRanks] = useState<UserRank[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserRanks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/user-ranks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: UserRank[] = await response.json();
            setUserRanks(data);
        } catch (error) {
            console.error('Error fetching user ranks:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRanks();
    }, []);

    return { userRanks, loading, error, refetch: fetchUserRanks };
};

// ユーザーランク単体取得
export const useUserRank = (userRankId: string) => {
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserRank = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/user_ranks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: UserRank = await response.json();
            setUserRank(data);
        } catch (error) {
            console.error('Error fetching user rank:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRank();
    }, [userRankId]);

    return { userRank, loading, error, refetch: fetchUserRank };
};

// ユーザーランク更新
export const useUpdateUserRank = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateUserRank = async (userRankId: string, rankData: Partial<UserRank>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/user_rank/${userRankId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify(rankData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error updating user rank:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { updateUserRank, loading, error };
};