import { useState, useEffect } from "react";
import type { Problem } from "../types/problemType";

export const useProblems = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    const fetchProblems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/problems',{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Problem[] = await response.json();
            setProblems(data);
        } catch (error) {
            console.error('Error fetching problems:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    return { problems, loading, error, refetch: fetchProblems };
};

// problem単体取得
export const useProblem = (problemId: string) => {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProblem = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/problem/${problemId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Problem = await response.json();
            setProblem(data);
        } catch (error) {
            console.error('Error fetching problem:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblem();
    }, [problemId]);

    return { problem, loading, error, refetch: fetchProblem };
}

// category_idで問題を取得
export const useProblemsByCategory = (categoryId: string) => {
    const [problemcategory, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProblemsByCategory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/problems/category/${categoryId}`,{
                method: "GET",
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Problem[] = await response.json();
            setProblems(data);
        } catch (error) {
            console.error('Error fetching problems by category:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!categoryId || categoryId === "all") {
            // categoryIdがnullか"all"のときはfetchしない
            setProblems([]);
            setLoading(false);
            return;
        }
        fetchProblemsByCategory();
    }, [categoryId]);

    return { problemcategory, loading, error, refetch: fetchProblemsByCategory };
};

// rank_idで問題を取得
export const useProblemsByRank = (rankId: string) => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProblemsByRank = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/problems/rank/${rankId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Problem[] = await response.json();
            setProblems(data);
        } catch (error) {
            console.error('Error fetching problems by rank:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblemsByRank();
    }, [rankId]);

    return { problems, loading, error, refetch: fetchProblemsByRank };
}