import { useState, useEffect } from "react";
import type { Notification, Unread } from "../types/notificationType";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/notifications`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Notification[] = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return { notifications, loading, error, refetch: fetchNotifications };
};

// 未読通知の数を取得するカスタムフック
export const useUnreadNotificationCount = () => {
    const [unreadCount, setUnreadCount] = useState<Unread>({ unread_count: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUnreadCount = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/notifications/unread_count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Unread = await response.json();
            setUnreadCount(data);
        } catch (error) {
            console.error('Error fetching unread notification count:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    return { unreadCount, loading, error, refetch: fetchUnreadCount };
};

// 通知を既読にするカスタムフック
export const useMarkNotificationsAsRead = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const markAsRead = async (notificationIds: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/notifications/mark_as_read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ notification_ids: notificationIds }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { markAsRead, loading, error };
}