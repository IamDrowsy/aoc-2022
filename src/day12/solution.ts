import { AbstractSolution } from "../utils/runner";
import { Grid, RecordGrid } from "../utils/grid";
import { asArray, asNumber, difference, ensure, union } from "../utils/common";

type MapPoint = {
  height: number;
  char: string;
};

// type Point = [number, number];
// use string because compare by value :(
type Point = string;
type Map = Grid<[number, number], MapPoint>;

type State = {
  map: Map;
  visited: Set<Point>;
  current: Set<Point>;
  index: number;
};

function parseChar(s: string): MapPoint {
  const result: MapPoint = {
    height: s.charCodeAt(0) - 96,
    char: s,
  };
  if (s === "S") {
    result.height = 1;
  } else if (s === "E") {
    result.height = 26;
  }
  return result;
}

function toPointString(point: [number, number]): string {
  return point.join(":");
}

function fromPointString(s: string): [number, number] {
  return s.split(":").map(asNumber) as [number, number];
}

function reachableFrom(map: Map, point: Point): Set<Point> {
  const [x, y] = fromPointString(point);
  const candidates: Point[] = [
    toPointString([x + 1, y]),
    toPointString([x - 1, y]),
    toPointString([x, y + 1]),
    toPointString([x, y - 1]),
  ];
  const currentHeight = map.get(fromPointString(point)).height;
  return candidates.reduce((reachable, candidate) => {
    if (
      map.has(fromPointString(candidate)) &&
      map.get(fromPointString(candidate)).height <= currentHeight + 1
    ) {
      reachable.add(candidate);
      return reachable;
    } else {
      return reachable;
    }
  }, new Set<Point>());
}

function step(state: State): State {
  const reachableNext = asArray(state.current)
    .map((p) => reachableFrom(state.map, p))
    .reduce(union);
  const reachableNew = difference(reachableNext, state.visited);
  return {
    map: state.map,
    current: reachableNew,
    visited: union(state.visited, reachableNew),
    index: state.index + 1,
  };
}

export default class Solution extends AbstractSolution<Map> {
  public parseInput1(input: string[]): Map {
    const grid = new RecordGrid<[number, number], MapPoint>();
    input.reduce((grid, line, x) => {
      return line
        .split("")
        .reduce((grid, char, y) => grid.put([x, y], parseChar(char)), grid);
    }, grid);
    return grid;
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: Map): string {
    const startPoint = ensure(
      input.keys().find((p) => input.get(p).char === "S")
    );
    const endPoint = ensure(
      input.keys().find((p) => input.get(p).char === "E")
    );
    let state: State = {
      map: input,
      visited: new Set<Point>(),
      current: new Set<Point>([toPointString(startPoint)]),
      index: 0,
    };
    while (
      !state.current.has(toPointString(endPoint)) &&
      state.current.size !== 0
    ) {
      state = step(state);
    }
    return state.index.toString();
  }
  public solveSecond(input: Map): string {
    const startPoints = ensure(
      input.keys().filter((p) => input.get(p).height === 1)
    );
    const endPoint = ensure(
      input.keys().find((p) => input.get(p).char === "E")
    );
    let state: State = {
      map: input,
      visited: new Set<Point>(),
      current: new Set<Point>(startPoints.map(toPointString)),
      index: 0,
    };
    while (
      !state.current.has(toPointString(endPoint)) &&
      state.current.size !== 0
    ) {
      state = step(state);
    }
    return state.index.toString();
  }
}
