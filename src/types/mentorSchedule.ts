import type { GroupChats } from "./groupChatType";
import type { Mentorship } from "./mentorshipType";
import type { User } from "./userTypes";

export type MentorSchedule = {
    schedule_id: string;
    mentorship_id: Mentorship;
    group: GroupChats;
    start_time: string;
    end_time: string;
    status: string;
    topic: string;
    description: string;
    created_at: string;
    updated_at: string;
    cancel_reason?: string;
    meeting_link?: string;
    notes: MentorNotes;
    feedback: MentorFeedback;
}

export type MentorNotes = {
    note_id: string;
    mentorship: Mentorship;
    user: User;
    type: string;
    content: string;
    created_at: string;
}

export type MentorFeedback = {
    feedback_id: string;
    mentorship: Mentorship;
    user: User;
    rating: number;
    comment: string;
    created_at: string;
}