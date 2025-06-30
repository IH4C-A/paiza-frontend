import type { Category } from "./categoryType";
import type { Rank } from "./rankType";
import type { TestCase } from "./testCaseType";

export type Problem = {
    problem_id: string;
    problem_title: string;
    problem_text: string;
    category: Category;
    rank: Rank;
    test_cases: TestCase[];
}