import { io, Socket } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
import type { Chats, ChatUsers, GroupChatHistory } from "../types/chatsType";
import type { User } from "../types/userTypes";

export const useChat = () => {
  const [chats, setChats] = useState<Chats[]>([]);
  const [groupchat, setGroupChats] = useState<GroupChatHistory[]>([]);
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
      const response = await fetch("http://127.0.0.1:5000/users", {
        // 例: 全ユーザーを取得する新しいAPIエンドポイント
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

  // HTTP fetch で個人チャット履歴を取得する場合
  const fetchChatHistory = useCallback(
    async (receiverId: string) => {
      try {
        if (!receiverId) {
          console.error("receiverId が必要です");
          return;
        }

        const url = `http://127.0.0.1:5000/chat_history?receiver_user_id=${receiverId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch private chat history");
        }

        const data: Chats[] = await response.json();
        setChats(data);
        console.log("個人チャット履歴:", data);
      } catch (error) {
        console.error("個人チャット履歴の取得中にエラーが発生しました:", error);
      }
    },
    [token]
  );

  // HTTP fetch でグループチャット履歴を取得する場合
  const fetchGroupChatHistory = useCallback(
    async (groupId: string) => {
      try {
        if (!groupId) {
          console.error("groupId が必要です");
          return;
        }

        const url = `http://127.0.0.1:5000/chat_send_group?group_id=${groupId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch group chat history");
        }

        const data: GroupChatHistory[] = await response.json();
        setGroupChats(data);
        console.log("グループチャット履歴:", data);
      } catch (error) {
        console.error(
          "グループチャット履歴の取得中にエラーが発生しました:",
          error
        );
      }
    },
    [token]
  );

  // マウント時にチャット履歴を取得
  useEffect(() => {
    if (token) {
      // 例: 特定のreceiverIdの個人チャット履歴を取得する場合
      // fetchChatHistory();

      // 例: 特定のgroupIdのグループチャット履歴を取得する場合
      // fetchGroupChatHistory();

      // どちらも指定しない場合は、何も取得しない、またはデフォルトの動作を設定できます。
      // 必要に応じて、どちらかの関数を呼び出すロジックを追加してください。
    }
  }, [token, fetchChatHistory, fetchGroupChatHistory]);

  // メッセージ送信関数
  const sendMessage = (messageData: {
    message: string;
    send_user_id: string;
    receiver_user_id?: string;
    group_id?: string;
    image?: { filename: string } | null;
  }) => {
    if (socket) {
      socket.emit("send_message", messageData);
    } else {
      console.error("Socket not connected");
    }
  };

  return {
    chats,
    groupchat,
    allUsers,
    sendMessage,
    fetchChatHistory,
    fetchGroupChatHistory,
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
};
