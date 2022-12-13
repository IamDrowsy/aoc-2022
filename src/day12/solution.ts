import { AbstractSolution } from "../utils/runner";

export default class Solution extends AbstractSolution<string[]> {

  public parseInput1(input: string[]): string[] {
    return input;
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(_input: string[]): string {
    return "Not Implemented";
  }
  public solveSecond(_input: string[]): string {
    return "Not Implemented";
  }
}
