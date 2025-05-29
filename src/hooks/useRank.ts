import { useState, useEffect } from "react";
import type { Rank } from "../types/rankType";

export const useRanks = () => {
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRanks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/ranks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Rank[] = await response.json();
            setRanks(data);
        } catch (error) {
            console.error('Error fetching ranks:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRanks();
    }, []);

    return { ranks, loading, error, refetch: fetchRanks };
};

// ランク単体取得
export const useRank = (rankId: string) => {
    const [rank, setRank] = useState<Rank | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRank = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/rank/${rankId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Rank = await response.json();
            setRank(data);
        } catch (error) {
            console.error('Error fetching rank:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRank();
    }, [rankId]);

    return { rank, loading, error, refetch: fetchRank };
};