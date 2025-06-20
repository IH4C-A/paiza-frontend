import type { User } from "./userTypes";

export type Mentorship = {
    mentorship_id: string;
    mentor: User;
    mentee: User;
    started_at: Date;
    ended_at: Date | null;
}

export type MentorQuery = {
    mentorship: Mentorship;
    student_mentors: User;
}

export type MentorRequest = {
    request_id: string;
    status: string;
    message: string;
    requested_at: Date;
    mentee: User;
}