import { useState, useEffect } from "react";
import type { StudyLog } from "../types/studyLogsType";

export const useStudyLogs = () => {
    const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudyLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/studylogs',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // トークンをヘッダーに追加
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: StudyLog[] = await response.json();
            setStudyLogs(data);
        } catch (error) {
            console.error('Error fetching study logs:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudyLogs();
    }, []);

    return { studyLogs, loading, error, refetch: fetchStudyLogs };
};

// 学習ログ登録
export const useAddStudyLog = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addStudyLog = async (logData: {
        course_id: string;
        study_time: number;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/studylogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // トークンをヘッダーに追加
                },
                body: JSON.stringify(logData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error adding study log:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, addStudyLog };
};

// 学習ログ詳細
export const useStudyLogDetail = (course_id: string) => {
    const [studyLog, setStudyLog] = useState<StudyLog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudyLogDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/studylogs/${course_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // トークンをヘッダーに追加
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: StudyLog = await response.json();
            setStudyLog(data);
        } catch (error) {
            console.error('Error fetching study log detail:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudyLogDetail();
    }, [course_id]);

    return { studyLog, loading, error, refetch: fetchStudyLogDetail };
};

// 学習ログ更新
export const useUpdateStudyLog = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateStudyLog = async (logData: {
        log_id: string;
        course_id: string;
        study_time: number;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/studylogs/${logData.log_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // トークンをヘッダーに追加
                },
                body: JSON.stringify(logData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error updating study log:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, updateStudyLog };
}