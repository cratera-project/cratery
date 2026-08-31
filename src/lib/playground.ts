


export function withSolutionHarness(testHarness: string, solution: string): string {
  return testHarness.replace('{{SOLUTION}}', solution.trimEnd())
}
