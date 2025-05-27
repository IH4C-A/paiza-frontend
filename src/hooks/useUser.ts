// Userモデルのバックつなぎ合わせ
import { useState, useEffect } from "react";
import type { User } from "../types/userTypes";


export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: User[] = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    },[]);

    return { users, loading, error, refetch: fetchUsers };
}

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
                throw new Error('Network response was not ok');
            }
            const data: User = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    return { user, loading, error, refetch: fetchUser };
}

export const useLogin = () => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setToken(data.token);
        } catch (error) {
            console.error('Error logging in:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { token, loading, error, login };
}

export const useRegister = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (userData: {
        username: string;
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
            const response = await fetch('http://localhost:5000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error registering user:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, register };
}

// ログインユーザー取得
export const useCurrentUser = (token: string | null) => {
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
            const response = await fetch('http://localhost:5000/current_user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: User = await response.json();
            setCurrentUser(data);
        } catch (error) {
            console.error('Error fetching current user:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, [token]);

    return { currentUser, loading, error, refetch: fetchCurrentUser };
}