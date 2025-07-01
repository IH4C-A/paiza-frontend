export type TestCase = {
    test_case_id: string;
    problem_id: string;
    input_text: string;
    expected_output: string;
    is_public?:string | boolean;
    executionTime?: number;
    status?: string;
}