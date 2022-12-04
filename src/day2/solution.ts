import { AbstractSolution } from "../utils/runner";
import { match } from "ts-pattern";

type OpponentLetter = "A" | "B" | "C";
type MyLetter = "X" | "Y" | "Z";
type InputChar = OpponentLetter | MyLetter;
type Shape = "Rock" | "Paper" | "Scissors";

type MyShape = Shape;
type OppoShape = Shape;

type Result = "Win" | "Lose" | "Draw";

type ParsedShape<InputChar> = InputChar extends OpponentLetter
  ? OppoShape
  : MyShape;

type Score = number;

export default class Solution extends AbstractSolution<
  [OppoShape, MyShape][],
  [OppoShape, Result][]
> {
  parseShapeLetter(input: InputChar): ParsedShape<InputChar> {
    switch (input) {
      case "A":
      case "X":
        return "Rock";
      case "B":
      case "Y":
        return "Paper";
      case "C":
      case "Z":
        return "Scissors";
    }
  }

  parseResultLetter(input: MyLetter): Result {
    switch (input) {
      case "X":
        return "Lose";
      case "Y":
        return "Draw";
      case "Z":
        return "Win";
    }
  }

  public parseInput1(input: string[]): [OppoShape, MyShape][] {
    return input.map((s) => [
      this.parseShapeLetter(s.substring(0, 1) as OpponentLetter),
      this.parseShapeLetter(s.substring(2) as MyLetter),
    ]);
  }

  public parseInput2(input: string[]): [OppoShape, Result][] {
    return input
      .filter((s) => s)
      .map((s) => [
        this.parseShapeLetter(s.substring(0, 1) as OpponentLetter),
        this.parseResultLetter(s.substring(2) as MyLetter),
      ]);
  }

  private shapeScore(shape: Shape): Score {
    switch (shape) {
      case "Rock":
        return 1;
      case "Paper":
        return 2;
      case "Scissors":
        return 3;
    }
  }

  private resultScore(result: Result): Score {
    switch (result) {
      case "Win":
        return 6;
      case "Draw":
        return 3;
      case "Lose":
        return 0;
    }
  }

  assertNever = (_arg: never): never => {
    throw "assertNever";
  };

  private result(round: [OppoShape, MyShape]): Result {
    return match(round)
      .with(
        ["Rock", "Rock"],
        ["Paper", "Paper"],
        ["Scissors", "Scissors"],
        (): Result => "Draw"
      )
      .with(
        ["Rock", "Paper"],
        ["Paper", "Scissors"],
        ["Scissors", "Rock"],
        (): Result => "Win"
      )
      .with(
        ["Rock", "Scissors"],
        ["Paper", "Rock"],
        ["Scissors", "Paper"],
        (): Result => "Lose"
      )
      .exhaustive();
  }

  private myShape(round: [OppoShape, Result]): MyShape {
    return match(round)
      .with(
        ["Rock", "Draw"],
        ["Paper", "Lose"],
        ["Scissors", "Win"],
        (): MyShape => "Rock"
      )
      .with(
        ["Paper", "Draw"],
        ["Scissors", "Lose"],
        ["Rock", "Win"],
        (): MyShape => "Paper"
      )
      .with(
        ["Scissors", "Draw"],
        ["Rock", "Lose"],
        ["Paper", "Win"],
        (): MyShape => "Scissors"
      )
      .exhaustive();
  }

  //private myShape([s1, s2]: [Shape, Result]): Shape {}

  public solveFirst(input: [OppoShape, MyShape][]): string {
    return (
      input.reduce(
        (sum, current) =>
          sum +
          this.resultScore(this.result(current)) +
          this.shapeScore(current[1]),
        0
      ) + ""
    );
  }
  public solveSecond(input: [OppoShape, Result][]): string {
    return (
      input.reduce(
        (sum, current) =>
          sum +
          this.resultScore(current[1]) +
          this.shapeScore(this.myShape(current)),
        0
      ) + ""
    );
  }
}
