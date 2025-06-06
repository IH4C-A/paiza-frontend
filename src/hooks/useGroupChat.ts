import { useState, useEffect } from "react";
import type {
  GroupChat,
  GroupChatMember,
  GroupChats,
} from "../types/groupChatType";
import { useNavigate } from "react-router-dom";

export const useGroupChats = () => {
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/group_chats");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: GroupChat[] = await response.json();
      setGroupChats(data);
    } catch (error) {
      console.error("Error fetching group chats:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupChats();
  }, []);

  return { groupChats, loading, error, refetch: fetchGroupChats };
};

// hooks/useGroupChat.ts
export const useGroupChatMembers = (groupId: string) => {
  const [members, setMembers] = useState<GroupChatMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const fetchGroupChatMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/groupchat/members/${groupId}`,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // ここが重要：APIレスポンスの構造に合わせて変更
      const data: { members: GroupChatMember[] } = await response.json(); // APIが { members: [...] } を返すため型を定義
      setMembers(data.members || []); // 取得したオブジェクトから `members` プロパティを取り出してセット
    } catch (error) {
      console.error("Error fetching group chat members:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupChatMembers();
  }, [groupId]);

  // フックが直接メンバー配列を返すように変更
  return { members, loading, error, refetch: fetchGroupChatMembers };
};

// グループチャット作成
export const useCreateGroupChat = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createGroupChat = async (
    group_name: string,
    description: string,
    user_ids: string[]
  ) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    console.log(group_name,description,user_ids);

    try {
      const response = await fetch("http://localhost:5000/groupchat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_name,
          group_image: null, // 画像送信しない前提
          description,
          user_ids,
        }),
      });

      if (!response.ok) {
        throw new Error("グループ作成に失敗しました");
      }

      const data = await response.json();
      console.log("グループ作成成功", data);
      navigate(`/group/${data.group_id}`)
      return data;
    } catch (error) {
      console.error("グループ作成失敗:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
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
      const response = await fetch("http://localhost:5000/chat_groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: GroupChats[] = await response.json();
      setMyGroupChats(data);
    } catch (error) {
      console.error("Error fetching my group chats:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroupChats();
  }, []);

  return { myGroupChats, loading, error, refetch: fetchMyGroupChats };
};
