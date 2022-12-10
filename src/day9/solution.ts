import { asNumber, last, mapcat } from "../utils/common";
import { Grid, RecordGrid } from "../utils/grid";
import { AbstractSolution } from "../utils/runner";

type Point = [number, number];

type State = {
  knots: [Point, ...Point[]];
  visited: Grid<Point, boolean>;
};

function isDirection(s: string | undefined): s is Direction {
  return s === "U" || s === "D" || s === "L" || s === "R";
}

function asDir(s: string | undefined): Direction {
  if (isDirection(s)) {
    return s;
  } else {
    throw new Error(`${s} is no valid direction`);
  }
}

type Direction = "U" | "D" | "L" | "R";
type Motion = {
  dir: Direction;
  dist: number;
};

function parseMotion(line: string): Motion {
  const [dir, dist] = line.split(" ");
  return { dir: asDir(dir), dist: asNumber(dist) };
}

function spliceMotion(motion: Motion): Motion[] {
  return Array(motion.dist)
    .fill(0)
    .map((): Motion => {
      return { dir: motion.dir, dist: 1 };
    });
}

function applyMotionToPoint(point: Point, motion: Motion): Point {
  switch (motion.dir) {
    case "U":
      return [point[0] + motion.dist, point[1]];
    case "D":
      return [point[0] - motion.dist, point[1]];
    case "L":
      return [point[0], point[1] - motion.dist];
    case "R":
      return [point[0], point[1] + motion.dist];
  }
}

function newTail(head: Point, tail: Point): Point {
  const diffVertical = head[0] - tail[0];
  const diffHorizontal = head[1] - tail[1];
  if (Math.abs(diffHorizontal) == 2 && Math.abs(diffVertical) == 2) {
    return [head[0] - diffVertical / 2, head[1] - diffHorizontal / 2];
  } else if (Math.abs(diffHorizontal) == 2) {
    return [head[0], head[1] - diffHorizontal / 2];
  } else if (Math.abs(diffVertical) == 2) {
    return [head[0] - diffVertical / 2, head[1]];
  } else {
    return tail;
  }
}

function applyMotion(state: State, motion: Motion): State {
  state.knots[0] = applyMotionToPoint(state.knots[0], motion);
  state.knots = state.knots.slice(1).reduce(
    (all, next) => {
      return [...all, newTail(last(all), next)];
    },
    [[...state.knots[0]]] as [Point, ...Point[]]
  );
  state.visited.put(last(state.knots), true);
  return state;
}

export default class Solution extends AbstractSolution<Motion[]> {
  public parseInput1(input: string[]): Motion[] {
    return mapcat(input.map(parseMotion), spliceMotion);
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: Motion[]): string {
    const state: State = {
      knots: [
        [0, 0],
        [0, 0],
      ],
      visited: new RecordGrid<Point, boolean>().put([0, 0], true),
    };
    input.reduce((state, motion) => applyMotion(state, motion), state);
    return state.visited.keys().length.toString();
  }
  public solveSecond(input: Motion[]): string {
    const state: State = {
      knots: [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      visited: new RecordGrid<Point, boolean>().put([0, 0], true),
    };
    input.reduce((state, motion) => applyMotion(state, motion), state);
    return state.visited.keys().length.toString();
  }
}
