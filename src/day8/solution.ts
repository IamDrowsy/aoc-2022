import { AbstractSolution } from "../utils/runner";
import { Grid, RecordGrid } from "../utils/grid";
import { asNumber } from "../utils/common";

type Tree = number;
type Point = [number, number];
type Forest = Grid<Point, Tree>;
type Direction = "Up" | "Down" | "Left" | "Right";

function isVisibleFrom(
  forest: Forest,
  point: Point,
  direction: Direction
): boolean {
  const index = direction === "Up" || direction === "Down" ? 0 : 1;
  const dir = direction === "Up" || direction === "Left" ? -1 : +1;
  const height = forest.get(point);
  const currentPoint: Point = [...point];
  let currentHeight = 0;
  do {
    currentPoint[index] += dir;
    currentHeight = forest.get(currentPoint);
    if (currentHeight >= height) {
      return false;
    }
  } while (currentHeight != -1);
  return true;
}

function isVisible(forest: Forest, point: Point): boolean {
  function f(dir: Direction): boolean {
    return isVisibleFrom(forest, point, dir);
  }
  return f("Up") || f("Down") || f("Left") || f("Right");
}

function visibleTrees(
  forest: Forest,
  point: Point,
  direction: Direction
): number {
  const index = direction === "Up" || direction === "Down" ? 0 : 1;
  const dir = direction === "Up" || direction === "Left" ? -1 : +1;
  const height = forest.get(point);
  const currentPoint: Point = [...point];
  let currentHeight = 0;
  let visibleTrees = 0;
  do {
    currentPoint[index] += dir;
    currentHeight = forest.get(currentPoint);
    if (currentHeight != -1) {
      visibleTrees++;
    }
    if (currentHeight >= height) {
      break;
    }
  } while (currentHeight != -1);
  return visibleTrees;
}

function scenicScore(forest: Forest, point: Point): number {
  function f(dir: Direction): number {
    return visibleTrees(forest, point, dir);
  }
  const score = f("Up") * f("Down") * f("Left") * f("Right");
  return score;
}

export default class Solution extends AbstractSolution<Forest> {
  public parseInput1(input: string[]): Forest {
    const result = new RecordGrid<Point, Tree>();
    result.defaultValue = -1;
    input.reduce((grid, line, x) => {
      return line.split("").reduce((grid, char, y) => {
        return grid.put([x, y], asNumber(char));
      }, grid);
    }, result);
    return result;
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: Forest): string {
    return input
      .keys()
      .filter((point) => isVisible(input, point))
      .length.toString();
  }
  public solveSecond(input: Forest): string {
    return (
      input
        .keys()
        .map((point) => scenicScore(input, point))
        .sort((a, b) => b - a)[0] + ""
    );
  }
}
