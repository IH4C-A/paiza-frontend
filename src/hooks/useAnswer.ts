import { useState, useEffect } from "react";
import type { Answer } from "../types/answerType";

export const useAnswers = () => {
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnswers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/answers');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Answer[] = await response.json();
            setAnswers(data);
        } catch (error) {
            console.error('Error fetching answers:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnswers();
    }, []);

    return { answers, loading, error, refetch: fetchAnswers };
}

// 問題の解答を取得するカスタムフック
export const useAnswer = (problemId: string) => {
    const [answer, setAnswer] = useState<Answer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnswer = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/answer/${problemId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Answer = await response.json();
            setAnswer(data);
        } catch (error) {
            console.error('Error fetching answer:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnswer();
    }, [problemId]);

    return { answer, loading, error, refetch: fetchAnswer };
}