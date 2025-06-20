import { useState, useEffect } from "react";
import type { MentorNotes } from "../types/mentorSchedule";

export const useMentorshipNotes = (mentorshipId?: string) => {
  const [notes, setNotes] = useState<MentorNotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/mentor_notes${mentorshipId ? `?mentorship_id=${mentorshipId}` : ""}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [mentorshipId]);

  return { notes, loading, error, refetch: fetchNotes };
};

export const useMentorshipNote = (noteId: string) => {
  const [note, setNote] = useState<MentorNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/mentor_notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch note");
      const data = await res.json();
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  return { note, loading, error, refetch: fetchNote };
};

export const useCreateMentorshipNote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNote = async (note: {
    mentorship_id: string;
    type: string;
    content: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/mentor_notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error("Failed to create note");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createNote, loading, error };
};


export const useUpdateMentorshipNote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNote = async (noteId: string, update: {
    type?: string;
    content?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/mentor_notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(update),
      });
      if (!res.ok) throw new Error("Failed to update note");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateNote, loading, error };
};

export const useDeleteMentorshipNote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNote = async (noteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/mentor_notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete note");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteNote, loading, error };
};
