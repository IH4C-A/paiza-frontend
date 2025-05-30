import { useState, useEffect } from "react";
import type { Course } from "../types/coursesType";

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/courses');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Course[] = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return { courses, loading, error, refetch: fetchCourses };
};

// Course単体取得
export const useCourse = (courseId: string) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourse = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/courses/${courseId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Course = await response.json();
            setCourse(data);
        } catch (error) {
            console.error('Error fetching course:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    return { course, loading, error, refetch: fetchCourse };
};

// カテゴリーに紐づくCourseの取得
export const useCoursesByCategory = (categoryId: string) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCoursesByCategory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/courses/category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Course[] = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses by category:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoursesByCategory();
    }, [categoryId]);

    return { courses, loading, error, refetch: fetchCoursesByCategory };
}