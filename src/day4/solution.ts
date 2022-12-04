import { asSet, intersection, range } from "../utils/common";
import { AbstractSolution } from "../utils/runner";

type Id = number;
type StartId = Id;
type EndId = Id;
type Assignment = [StartId, EndId];
type AssignmentSet = Set<Id>;
type Pair = [Assignment, Assignment];

function hasTwoElements<T>(input: T[]) {
  return input.length == 2;
}

function isAssignment(input: number[]): input is Assignment {
  return hasTwoElements(input);
}

function isPair(input: Assignment[]): input is Pair {
  return hasTwoElements(input);
}

function parseAssignment(input: string): Assignment {
  const result = input.split("-").map(Number);
  if (isAssignment(result)) {
    return result;
  } else {
    throw new Error(`${input} is no valid assignment`);
  }
}

function parsePair(input: string): Pair {
  const result = input.split(",").map(parseAssignment);
  if (isPair(result)) {
    return result;
  } else {
    throw new Error(`${input} is no valid pair`);
  }
}

function isFullyContained(pair: Pair): boolean {
  return (
    (pair[0][0] <= pair[1][0] && pair[0][1] >= pair[1][1]) ||
    (pair[0][0] >= pair[1][0] && pair[0][1] <= pair[1][1])
  );
}

function toAssignmentSet(a: Assignment): AssignmentSet {
  return asSet(range(a[0], a[1]));
}

function overlaps(pair: Pair): boolean {
  return (
    intersection(toAssignmentSet(pair[0]), toAssignmentSet(pair[1])).size != 0
  );
}

export default class Solution extends AbstractSolution<Pair[]> {
  public parseInput1(input: string[]): Pair[] {
    return input.map(parsePair);
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: Pair[]): string {
    return input.filter(isFullyContained).length.toString();
  }
  public solveSecond(input: Pair[]): string {
    return input.filter(overlaps).length.toString();
  }
}
