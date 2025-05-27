export type Mentorship = {
    mentorship_id: string;
    mentor_id: string;
    mentee_id: string;
    started_at: Date;
    ended_at: Date | null;
}