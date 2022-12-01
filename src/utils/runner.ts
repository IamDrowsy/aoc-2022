import { readFileSync, writeFileSync } from "fs";

export interface SolutionInterface {
  solveFirst: (input: string[]) => string;
  solveSecond: (input: string[]) => string;
}

export abstract class AbstractSolution implements SolutionInterface {
  public folder: string;

  public abstract solveFirst(input: string[]): string;
  public abstract solveSecond(input: string[]): string;

  getInput(): string[] {
    return readFileSync(this.folder + "input.txt", "utf-8").split(/\r?\n/);
  }

  runFirst(): string {
    const result = this.solveFirst(this.getInput());
    writeFileSync(this.folder + "solution1.txt", result);
    return result;
  }

  runSecond(): string {
    const result = this.solveSecond(this.getInput());
    writeFileSync(this.folder + "solution2.txt", result);
    return result;
  }
}

async function loadSolution(day: string): Promise<AbstractSolution> {
  const solutionModule: { default: { new (): AbstractSolution } } =
    await import(`../day${day}/solution`);
  const { default: solutionClass } = solutionModule;
  const solution = new solutionClass();
  return solution;
}

export function run(day: string): void {
  const folder = `./src/day${day}/`;

  loadSolution(day).then((solution: AbstractSolution) => {
    solution.folder = folder;
    console.log(solution.runFirst());
    console.log(solution.runSecond());
  });
}
