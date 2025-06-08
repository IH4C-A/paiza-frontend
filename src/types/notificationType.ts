export type Notification = {
    notification_id: string;
    type: string;
    title: string;
    message: string;
    detail: string;
    is_read: boolean;
    created_at: Date;
    priority: string;
    actionUrl?: string;
}

export type Unread = {
    unread_count: number;
};