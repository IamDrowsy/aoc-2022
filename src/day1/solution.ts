import { AbstractSolution } from "../utils/runner";

type Calories = number;
type CarriedCalories = Calories[];
type Elf = {
  carriedCalories: CarriedCalories;
  sumOfCarriedCalories: Calories;
};

type BlankLine = null;
type Line = BlankLine | Calories;

function sortByCalories(elfs: Elf[]): Elf[] {
  return elfs.sort((a, b) => b.sumOfCarriedCalories - a.sumOfCarriedCalories);
}

function stringToLine(input: string): Line {
  if (+input) {
    return +input;
  } else {
    return null;
  }
}

function partitionLines(lines: Line[]): CarriedCalories[] {
  return lines.reduce((result, current) => {
    if (current === null) {
      return [[] as CarriedCalories].concat(result);
    } else {
      result[0]?.push(current);
      return result;
    }
  }, [] as CarriedCalories[]);
}

function buildElf(callories: CarriedCalories): Elf {
  return {
    carriedCalories: callories,
    sumOfCarriedCalories: callories.reduce((sum, current) => sum + current, 0),
  };
}

export default class Solution extends AbstractSolution<Elf[]> {
  parseInput1(input: string[]): Elf[] {
    return partitionLines(input.map(stringToLine)).map(buildElf);
  }

  parseInput2 = this.parseInput1;

  public solveFirst(input: Elf[]): string {
    const elfes = sortByCalories(input);
    return elfes[0]?.sumOfCarriedCalories + "";
  }
  public solveSecond(input: Elf[]): string {
    const elfes = sortByCalories(input) as [Elf, Elf, Elf, ...Elf[]];
    return (
      elfes[0].sumOfCarriedCalories +
      elfes[1].sumOfCarriedCalories +
      elfes[2].sumOfCarriedCalories +
      ""
    );
  }
}
