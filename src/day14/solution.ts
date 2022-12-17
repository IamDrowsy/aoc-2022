import { asNumber } from "../utils/common";
import { RecordGrid } from "../utils/grid";
import { AbstractSolution } from "../utils/runner";

type Content = "Rock" | "Sand" | "Empty";
type Point = [number, number];
type Map = RecordGrid<Point, Content>;

type State = {
  map: Map;
  currentSand: Point;
  floor: number;
  stable: boolean;
};

function parsePoint(s: string): Point {
  const [x, y] = s.split(",");
  return [asNumber(x), asNumber(y)];
}

function addRockLine(map: Map, [sx, sy]: Point, [ex, ey]: Point): Map {
  const xdiff = sx <= ex ? 1 : -1;
  const ydiff = sy <= ey ? 1 : -1;
  for (let x = sx; x != ex + xdiff; x = x + xdiff) {
    for (let y = sy; y != ey + ydiff; y = y + ydiff) {
      map.put([x, y], "Rock");
    }
  }
  return map;
}

function addRockLines(map: Map, line: string): Map {
  line
    .split(" -> ")
    .map(parsePoint)
    .reduce((prev, current) => {
      addRockLine(map, prev, current);
      return current;
    });
  return map;
}

function down([x, y]: Point): Point {
  return [x, y + 1];
}
function downLeft([x, y]: Point): Point {
  return [x - 1, y + 1];
}
function downRight([x, y]: Point): Point {
  return [x + 1, y + 1];
}

function step(state: State): State {
  const current = state.currentSand;
  if (current[1] === state.floor + 1) {
    state.map.put(current, "Sand");
    state.currentSand = [500, 0];
  } else if (state.map.get(down(current)) === "Empty") {
    state.currentSand = down(current);
  } else if (state.map.get(downLeft(current)) === "Empty") {
    state.currentSand = downLeft(current);
  } else if (state.map.get(downRight(current)) === "Empty") {
    state.currentSand = downRight(current);
  } else {
    state.map.put(current, "Sand");
    state.currentSand = [500, 0];
  }
  return state;
}

function floor(map: Map): number {
  return map
    .keys()
    .map((p) => p[1])
    .reduce((a, b) => Math.max(a, b));
}

function currentSandUnderFloor(state: State): boolean {
  return state.currentSand[1] === state.floor;
}

function countSand(map: Map): number {
  return map.getAll(map.keys()).filter((c) => c === "Sand").length;
}

export default class Solution extends AbstractSolution<Map> {
  public parseInput1(input: string[]): Map {
    const grid = new RecordGrid<Point, Content>();
    grid.defaultValue = "Empty";
    return input.reduce(addRockLines, grid);
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: Map): string {
    let state: State = {
      map: input,
      currentSand: [500, 0],
      floor: floor(input),
      stable: false,
    };
    while (!state.stable) {
      state = step(state);
      state.stable = currentSandUnderFloor(state);
    }
    return countSand(state.map).toString();
  }
  public solveSecond(input: Map): string {
    let state: State = {
      map: input,
      currentSand: [500, 0],
      floor: floor(input),
      stable: false,
    };
    while (!state.stable) {
      state = step(state);
      state.stable = state.map.get([500, 0]) === "Sand";
    }
    return countSand(state.map).toString();
  }
}
