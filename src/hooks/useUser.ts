// Userモデルのバックつなぎ合わせ
import { useState, useEffect } from "react";
import type { User, UserLoginPayload } from "../types/userTypes";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};

// ユーザー単体取得
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: User = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return { user, loading, error, refetch: fetchUser };
};

export const useLogin = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (login: UserLoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: login.email, password: login.password }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      
      setToken(data.token);
      localStorage.setItem("token", data.token);
      console.log("Login successful, token:", data.token);
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { token, loading, error, login };
};

export const useRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    profile_image?: string | null;
    age?: number;
    seibetu?: string;
    adrress?: string;
    employment_status?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await response.json();
    } catch (error) {
      console.error("Error registering user:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, register };
};

// ログインユーザー取得
export const useCurrentUser = () => {
  const token = localStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/login_user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json(); // ← 一度だけ読み取る！

      if (!response.ok) {
        // トークン切れ対応
        if (response.status === 401 && data.msg === "Token has expired") {
          console.warn("Token expired, logging out");
          localStorage.removeItem("token");
          setCurrentUser(null);
          // ここでログインページに遷移させるなどの処理を追加してもOK
          return;
        }

        throw new Error(data.msg || "Failed to fetch current user");
      }

      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return { currentUser, loading, error, refetch: fetchCurrentUser };
};
