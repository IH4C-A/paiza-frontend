import { io, Socket } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
import type { Chats, ChatHistory, ChatUsers, GroupChatHistory } from "../types/chatsType";

type UseChatOptions = {
  useFetchForHistory?: boolean; // true → fetch, false → socket
};

export const useChat = ({ useFetchForHistory = false }: UseChatOptions = {}) => {
  const [chats, setChats] = useState<Chats[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [groupChatHistory, setGroupChatHistory] = useState<GroupChatHistory[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUsers[]>([]);
  const token = localStorage.getItem("token");
  const [socket, setSocket] = useState<Socket | null>(null);

  // 初期化
  useEffect(() => {
    const s = io("http://127.0.0.1:5000", {
      transports: ["websocket"],
      query: { token },
    });

    s.on("connect", () => {
      console.log("Connected to chat server");
    });

    s.on("chats", (data: Chats[]) => {
      setChats(data);
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

  // HTTP fetch で履歴を取得する場合
  const fetchChatHistory = useCallback(
    async (receiverId?: string, groupId?: string) => {
      try {
        let url = "";

        if (groupId) {
          url = `http://127.0.0.1:5000/chat_send_group?group_id=${groupId}`;
        } else if (receiverId) {
          url = `http://127.0.0.1:5000/chat_send?receiverId=${receiverId}`;
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
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  // メッセージ送信関数
  const sendMessage = (messageData: {
    message: string;
    send_user_id: string;
    receiver_user_id?: string;
    group_id?: string;
    image?: { filename: string; data: string } | null;
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
    sendMessage,
    fetchChatHistory: useFetchForHistory ? fetchChatHistory : undefined,
  };
};
