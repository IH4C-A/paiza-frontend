import { io, Socket } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
import type { Chats, ChatHistory, ChatUsers, GroupChatHistory } from "../types/chatsType";
import type { User } from "../types/userTypes";



export const useChat = () => {
  const [chats, setChats] = useState<Chats[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [groupChatHistory, setGroupChatHistory] = useState<GroupChatHistory[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUsers[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");
  const [socket, setSocket] = useState<Socket | null>(null);

  // 初期化
  useEffect(() => {
    const s = io("http://127.0.0.1:5000", {
      transports: ["websocket"],
      query: { token: encodeURIComponent(token || "") },
    });

    s.on("connect", () => {
      console.log("Connected to chat server");
    });

    s.on("chatHistory", (data: ChatHistory[]) => {
      setChatHistory(data);
    });

    s.on("groupChatHistory", (data: GroupChatHistory[]) => {
      setGroupChatHistory(data);
    });

    s.on("chatUsers", (data: ChatUsers[]) => {
      setChatUsers(data);
    });

    // 新規メッセージを受信
    s.on("receive_message", (data: Chats) => {
      setChats((prev) => [...prev, data]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token]);

    // 全ユーザー情報を取得するための新しいfetch関数
  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/users", { // 例: 全ユーザーを取得する新しいAPIエンドポイント
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch all users");
      }

      const data: User[] = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  }, [token]);

  // コンポーネントがマウントされたときに全ユーザー情報を取得
  useEffect(() => {
    if (token) {
      fetchAllUsers();
    }
  }, [token, fetchAllUsers]);

      // HTTP fetch で履歴を取得する場合
const fetchChatHistory = useCallback(
  async (receiverId?: string, groupId?: string) => {
    try {
      let url = "";

      if (groupId) {
        url = `http://127.0.0.1:5000/chat_send_group?group_id=${groupId}`;
      } else if (receiverId) {
        url = `http://127.0.0.1:5000/chat_history?receiver_user_id=${receiverId}`;
      }

      if (!url) {
        console.error("receiverId または groupId が必要です");
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const data: Chats[] = await response.json();
      setChats(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  },
  [token]
);


  // マウント時にチャット履歴を取得
  useEffect(() => {
    if (token) {
      fetchChatHistory();
    }
  }, [token, fetchChatHistory]);

  // メッセージ送信関数
  const sendMessage = (messageData: {
    message: string;
    send_user_id: string;
    receiver_user_id?: string;
    group_id?: string;
    image?: { filename: string;} | null;
  }) => {
    if (socket) {
      socket.emit("send_message", messageData);
    } else {
      console.error("Socket not connected");
    }
  };

  return {
    chats,
    chatHistory,
    groupChatHistory,
    chatUsers,
    allUsers,
    sendMessage,
    fetchChatHistory,
    fetchAllUsers,
  };
};

// 個人チャットの履歴を取得するためのカスタムフック
export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatUsers[]>([]);
  const token = localStorage.getItem("token");

    // チャットしたことのあるユーザーを取得し、チャット履歴順にソート
  const fetchChatUsers = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/chat_users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat users");
      }

      const data: ChatUsers[] = await response.json();
      setChatHistory(data);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  }, [token]);

  // マウント時にチャットユーザー取得
  useEffect(() => {
    if (token) {
      fetchChatUsers();
    }
  }, [token, fetchChatUsers]);

  return {
    chatHistory,
    fetchChatUsers,
  };

}

