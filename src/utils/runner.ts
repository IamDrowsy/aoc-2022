import { readFileSync, writeFileSync } from "fs";

export interface SolutionInterface<Input1 = string[], Input2 = Input1> {
  parseInput1: (input: string[]) => Input1;
  parseInput2: (input: string[]) => Input2;
  solveFirst: (input: Input1) => string;
  solveSecond: (input: Input2) => string;
}

export abstract class AbstractSolution<Input1 = string[], Input2 = Input1>
  implements SolutionInterface<Input1, Input2>
{
  public folder: string;

  public abstract parseInput1(input: string[]): Input1;
  public abstract parseInput2(input: string[]): Input2;
  public abstract solveFirst(input: Input1): string;
  public abstract solveSecond(input: Input2): string;

  getInput(postfix?: string): string[] {
    const input = readFileSync(this.folder + `input${postfix}.txt`, "utf-8")
        .split(/\r?\n/);
    // remove last line if empty
    if (!input[input.length -1]) {
      input.splice(-1);
    }
    return input;
  }

  runFirst(inputPostfix: string): string {
    const result = this.solveFirst(
      this.parseInput1(this.getInput(inputPostfix))
    );
    writeFileSync(this.folder + "solution1.txt", result);
    return result;
  }

  runSecond(inputPostfix: string): string {
    const result = this.solveSecond(
      this.parseInput2(this.getInput(inputPostfix))
    );
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

export function run<T>(day: string, inputPostfix: string): void {
  const folder = `./src/day${day}/`;

  loadSolution(day).then((solution: AbstractSolution<T>) => {
    solution.folder = folder;
    console.log(solution.runFirst(inputPostfix));
    console.log(solution.runSecond(inputPostfix));
  });
}
