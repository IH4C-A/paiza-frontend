import type { Problem } from "./problemType";

export type Submission = {
  submission_id: string;
  user_id: string;
  problem_id: string;
  language: string;
  code_text: string;
  passed: boolean;
  submitted_at: string; // ISO形式
  problem: Problem;
};