export type Notification = {
    notification_id: string;
    user_id: string;
    message: string;
    is_read: boolean;
    created_at: Date;
}