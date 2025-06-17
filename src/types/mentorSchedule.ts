import type { Mentorship } from "./mentorshipType";
import type { User } from "./userTypes";

export type MentorSchedule = {
    schedule_id: string;
    mentorship_id: Mentorship;
    start_time: string;
    end_time: string;
    status: string;
    topic: string;
    description: string;
    created_at: string;
    updated_at: string;
    cancel_reason?: string;
}

export type MentorNotes = {
    note_id: string;
    mentorship: Mentorship;
    user_id: User;
    type: string;
    content: string;
    created_at: string;
}

export type MentorFeedback = {
    feedback_id: string;
    mentorship_id: Mentorship;
    user_id: User;
    rating: number;
    comment: string;
    created_at: string;
}