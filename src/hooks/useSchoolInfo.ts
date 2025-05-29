import { useState, useEffect } from "react";
import type { SchoolInfo } from "../types/schoolInfoType";

export const useSchoolInfo = () => {
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSchoolInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/schools');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: SchoolInfo[] = await response.json();
            setSchoolInfo(data);
        } catch (error) {
            console.error('Error fetching school info:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchoolInfo();
    }, []);

    return { schoolInfo, loading, error, refetch: fetchSchoolInfo };
};

// ユーザー単体取得
export const useSchool = () => {
    const [school, setSchool] = useState<SchoolInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSchool = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/school',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // トークンをヘッダーに追加
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: SchoolInfo = await response.json();
            setSchool(data);
        } catch (error) {
            console.error('Error fetching school:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchool();
    }, []);

    return { school, loading, error, refetch: fetchSchool };
};

// 学校情報登録
export const useRegisterSchool = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const registerSchool = async (schoolData: SchoolInfo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/school', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // トークンをヘッダーに追加
                },
                body: JSON.stringify(schoolData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error registering school:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerSchool };
};