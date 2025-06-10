import { useState, useEffect } from "react";
import type { Mentorship } from "../types/mentorshipType";

export const useMentorships = () => {
    const [mentorships, setMentorships] = useState<Mentorship[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMentorships = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/mentorships',{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Mentorship[] = await response.json();
            setMentorships(data);
        } catch (error) {
            console.error('Error fetching mentorships:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentorships();
    }, []);

    return { mentorships, loading, error, refetch: fetchMentorships };
};

export const useMentorship = (mentorshipId: string) => {
    const [mentorship, setMentorship] = useState<Mentorship | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMentorship = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/mentorships/${mentorshipId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Mentorship = await response.json();
            setMentorship(data);
        } catch (error) {
            console.error('Error fetching mentorship:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentorship();
    }, [mentorshipId]);

    return { mentorship, loading, error, refetch: fetchMentorship };
};

export const useCreateMentorship = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createMentorship = async (user_id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/mentorship', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ user_id }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error creating mentorship:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, createMentorship };
};

export const useMentorRequest = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token')

    const requestMentor = async (request: {
        mentor_id: string;
        message?: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:5000/mentorship/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':  `Bearer ${token}`,
                },
                body: JSON.stringify(request)
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

    return { requestMentor, loading, error };
}

export const useMentorRequestApprove = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token')

    const requestMentorapprove = async (request_id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:5000/mentorship/request/${request_id}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':  `Bearer ${token}`,
                },
                body: JSON.stringify(request_id)
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

    return { requestMentorapprove, loading, error };
}