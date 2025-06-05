import { useState, useEffect } from "react";
import type { GroupChat, GroupChatMember, GroupChats } from "../types/groupChatType";

export const useGroupChats = () => {
    const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroupChats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/group_chats');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: GroupChat[] = await response.json();
            setGroupChats(data);
        } catch (error) {
            console.error('Error fetching group chats:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupChats();
    }, []);

    return { groupChats, loading, error, refetch: fetchGroupChats };
};

// グループチャットメンバー取得
export const useGroupChatMembers = (groupId: string) => {
    const [members, setMembers] = useState<GroupChatMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroupChatMembers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/group_chats/members/${groupId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: GroupChatMember[] = await response.json();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching group chat members:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupChatMembers();
    }, [groupId]);

    return { members, loading, error, refetch: fetchGroupChatMembers };
};

// グループチャット作成
export const useCreateGroupChat = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createGroupChat = async (group_name: string, group_image: File | null, user_ids: number[]) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("group_name", group_name);
        if (group_image) {
            formData.append("group_image", group_image);
        }
        user_ids.forEach((userId) => formData.append("user_ids[]", userId.toString()));

        try {
            const response = await fetch("http://localhost:5000/groupchat", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('グループ作成に失敗しました');
            }

            const data = await response.json();
            console.log("グループ作成成功", data);
            return data;
        } catch (error) {
            console.error("グループ作成失敗:", error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { createGroupChat, loading, error };
};

// 自分が所属しているグループチャットを取得
export const useMyGroupChats = () => {
    const [myGroupChats, setMyGroupChats] = useState<GroupChats[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyGroupChats = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        try {
            const response = await fetch('http://localhost:5000/chat_groups', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: GroupChats[] = await response.json();
            setMyGroupChats(data);
        } catch (error) {
            console.error('Error fetching my group chats:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyGroupChats();
    }, []);

    return { myGroupChats, loading, error, refetch: fetchMyGroupChats };
};