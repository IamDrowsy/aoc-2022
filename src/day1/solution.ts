import { AbstractSolution } from "../utils/runner";

type Calories = number;
type CarriedCalories = Calories[];
type Elf = {
  carriedCalories: CarriedCalories;
  sumOfCarriedCalories: Calories;
};

const defaultElf: Elf = {
  carriedCalories: [],
  sumOfCarriedCalories: 0,
};

function sortByCalories(elfs: Elf[]): Elf[] {
  return elfs.sort((a, b) => b.sumOfCarriedCalories - a.sumOfCarriedCalories);
}

export default class Solution extends AbstractSolution<Elf[]> {
  parseInput(input: string[]): Elf[] {
    return input.reduce(
      (result: Elf[], item: string) => {
        if (!item) {
          return [{ ...defaultElf }].concat(result);
        } else {
          const latestElf = result[0];
          if (latestElf) {
            latestElf.carriedCalories = [...latestElf.carriedCalories, +item];
            latestElf.sumOfCarriedCalories += +item;
          }
          return result;
        }
      },
      [{ ...defaultElf }]
    );
  }

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
