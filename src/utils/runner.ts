import { readFileSync, writeFileSync } from "fs";

export interface SolutionInterface<ParsedInput> {
  solveFirst: (input: ParsedInput) => string;
  solveSecond: (input: ParsedInput) => string;
}

export abstract class AbstractSolution<ParsedInput>
  implements SolutionInterface<ParsedInput>
{
  public folder: string;

  public abstract parseInput(input: string[]): ParsedInput;
  public abstract solveFirst(input: ParsedInput): string;
  public abstract solveSecond(input: ParsedInput): string;

  getInput(): string[] {
    return readFileSync(this.folder + "input.txt", "utf-8").split(/\r?\n/);
  }

  runFirst(): string {
    const result = this.solveFirst(this.parseInput(this.getInput()));
    writeFileSync(this.folder + "solution1.txt", result);
    return result;
  }

  runSecond(): string {
    const result = this.solveSecond(this.parseInput(this.getInput()));
    writeFileSync(this.folder + "solution2.txt", result);
    return result;
  }
}

async function loadSolution<T>(day: string): Promise<AbstractSolution<T>> {
  const solutionModule: { default: { new (): AbstractSolution<T> } } =
    await import(`../day${day}/solution`);
  const { default: solutionClass } = solutionModule;
  const solution = new solutionClass();
  return solution;
}

export function run<T>(day: string): void {
  const folder = `./src/day${day}/`;

  loadSolution(day).then((solution: AbstractSolution<T>) => {
    solution.folder = folder;
    console.log(solution.runFirst());
    console.log(solution.runSecond());
  });
}
