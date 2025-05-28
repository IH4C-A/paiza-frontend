export type CourseProgress = {
    progress_id: string;
    user_id: string;
    course_id: string;
    progress_percentage: number; // 0 to 100
    last_updated: Date; 
}

export type CurseProgress = {
    course_id: string;
    course_name: string;
    progress_percentage: number;
    last_updated: Date;
}