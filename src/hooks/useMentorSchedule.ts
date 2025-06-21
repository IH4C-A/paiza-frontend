import { useState, useEffect } from "react";
import type { MentorSchedule } from "../types/mentorSchedule";

export const useMentorshipSchedules = () => {
  const [schedules, setSchedules] = useState<MentorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/mentorship-schedules", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return { schedules, loading, error, refetch: fetchSchedules };
};

export const useMentorshipSchedule = (scheduleId: string) => {
  const [schedule, setSchedule] = useState<MentorSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/mentorship-schedules/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch schedule");
      const data = await res.json();
      setSchedule(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [scheduleId]);

  return { schedule, loading, error, refetch: fetchSchedule };
};

export const useCreateSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async (schedule: {
    mentorship_id?: string;
    group_id?: string;
    start_time: string;
    end_time: string;
    topic?: string;
    description?: string;
    cancel_reason?: string;
    status?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/mentorship-schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(schedule),
      });
      if (!res.ok) throw new Error("Failed to create schedule");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { createSchedule, loading, error };
};

export const useUpdateSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSchedule = async (scheduleId: string, data: Partial<Omit<MentorSchedule, 'schedule_id' | 'created_at' | 'updated_at' | 'mentorship'>>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/mentorship-schedules/${scheduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update schedule");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { updateSchedule, loading, error };
};




export const useDeleteSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSchedule = async (scheduleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/mentorship-schedules/${scheduleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete schedule");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { deleteSchedule, loading, error };
};
