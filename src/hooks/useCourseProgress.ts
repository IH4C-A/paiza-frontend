import { useState, useEffect } from "react";
import type { CurseProgress, CourseProgress } from "../types/curseProgressType";

export const useCourseProgress = () => {
    const [courseProgress, setCourseProgress] = useState<CurseProgress[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourseProgress = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/courseprogress`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: CurseProgress[] = await response.json();
            setCourseProgress(data);
        } catch (error) {
            console.error('Error fetching course progress:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseProgress();
    }, []);

    return { courseProgress, loading, error, refetch: fetchCourseProgress };
};

// CourseProgressの作成
export const useCreateCourseProgress = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createCourseProgress = async (progressData: {
        course_id: string;
        progress_percentage: number; // 0 to 100
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/courseprogress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(progressData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error creating course progress:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, createCourseProgress };
};

// 特定のCourseProgressの取得
export const useCourseProgressById = (courseId: string) => {
    const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourseProgressById = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/courseprogress/${courseId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: CourseProgress = await response.json();
            setCourseProgress(data);
        } catch (error) {
            console.error('Error fetching course progress by ID:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseProgressById();
    }, [courseId]);

    return { courseProgress, loading, error, refetch: fetchCourseProgressById };
};