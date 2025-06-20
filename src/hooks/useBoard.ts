import { useState, useEffect } from "react";
import type { Board } from "../types/boardType";

export const useBoards = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBoards = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/boards');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Board[] = await response.json();
            setBoards(data);
        } catch (error) {
            console.error('Error fetching boards:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    return { boards, loading, error, refetch: fetchBoards };
};

// Board単体取得
export const useBoard = (boardId: string) => {
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBoard = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/boards/${boardId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Board = await response.json();
            setBoard(data);
        } catch (error) {
            console.error('Error fetching board:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoard();
    }, [boardId]);

    return { board, loading, error, refetch: fetchBoard };
};

// Boardの作成
export const useCreateBoard = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createBoard = async (newBoard: {
        title: string;
        content: string;
        status: string;
        categories?: string[];
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newBoard)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error creating board:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { createBoard, loading, error };
}