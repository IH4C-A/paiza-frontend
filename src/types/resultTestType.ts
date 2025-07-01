
export type TestResult = {
  test_case_id: string;
  input: string;
  expected_output: string;
  actual_output: string;
  execution_time: number;
  passed: boolean;
};


export type RunApiResponse = {
  passed: boolean;
  results: TestResult[];
};
