import { useState, useEffect } from "react";
import type { MentorQuery, MentorRequest, Mentorship } from "../types/mentorshipType";
import type { User } from "../types/userTypes";

export const useMentorships = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ... (省略)
  const [mentorships, setMyMentorships] = useState<Mentorship[]>([]);
  const [candidateMentors, setCandidateMentors] = useState<User[]>([]); // student_mentors -> candidateMentors に変更を推奨

  const fetchMentorships = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/mentorships", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // それぞれのリストをセット
      setMyMentorships(data.mentorship); // APIのレスポンスが "mentorship" であれば
      setCandidateMentors(data.student_mentors); // APIのレスポンスが "student_mentors" であれば
    } catch (error) {
      console.error("Error fetching mentorships:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorships();
  }, []);

  return {
    mentorships,
    candidateMentors, // こちらも返す
    loading,
    error,
    refetch: fetchMentorships,
  };
};

export const useMentorship = (mentorshipId: string) => {
  const [mentorship, setMentorship] = useState<MentorQuery | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentorship = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/mentorships/${mentorshipId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: MentorQuery = await response.json();
      setMentorship(data);
    } catch (error) {
      console.error("Error fetching mentorship:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorship();
  }, [mentorshipId]);

  return { mentorship, loading, error, refetch: fetchMentorship };
};

export const useCreateMentorship = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createMentorship = async (user_id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/mentorship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ user_id }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await response.json();
    } catch (error) {
      console.error("Error creating mentorship:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createMentorship };
};

export const useMentorRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const requestMentor = async (request: {
    mentor_id: string;
    message?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/mentorship/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await response.json();
    } catch (error) {
      console.error("Error registering article:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { requestMentor, loading, error };
};

export const useMentorRequestApprove = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const requestMentorapprove = async (request_id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/mentorship/request/${request_id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request_id),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await response.json();
    } catch (error) {
      console.error("Error registering article:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { requestMentorapprove, loading, error };
};

export const useReceivedMentorRequests = () => {
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/mentorship/requests/received", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, loading, error, refetch: fetchRequests };
};

export const useApproveMentorshipRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  const approveRequest = async (request_id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://127.0.0.1:5000/mentorship/request/${request_id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "承認に失敗しました");
      }

      setSuccess(true);
    } catch (err) {
      console.error("承認エラー:", err);
      setError(err instanceof Error ? err.message : "不明なエラー");
    } finally {
      setLoading(false);
    }
  };

  return { approveRequest, loading, error, success };
};

export const useRejectMentorshipRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("token");

  const rejectRequest = async (request_id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://127.0.0.1:5000/mentorship/request/${request_id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "拒否に失敗しました");
      }

      setSuccess(true);
    } catch (err) {
      console.error("拒否エラー:", err);
      setError(err instanceof Error ? err.message : "不明なエラー");
    } finally {
      setLoading(false);
    }
  };

  return { rejectRequest, loading, error, success };
};