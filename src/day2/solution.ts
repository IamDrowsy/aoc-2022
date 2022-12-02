import { AbstractSolution } from "../utils/runner";

type OpponentLetter = "A" | "B" | "C";
type MyLetter = "X" | "Y" | "Z";
type InputChar = OpponentLetter | MyLetter;
enum Shape {
  Rock,
  Paper,
  Scissors,
}

type MyShape = Shape;
type OppoShape = Shape;

enum Result {
  Win,
  Lose,
  Draw,
}

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
        return Shape.Rock;
      case "B":
      case "Y":
        return Shape.Paper;
      case "C":
      case "Z":
        return Shape.Scissors;
    }
  }

  parseResultLetter(input: MyLetter): Result {
    switch (input) {
      case "X":
        return Result.Lose;
      case "Y":
        return Result.Draw;
      case "Z":
        return Result.Win;
    }
  }

  public parseInput1(input: string[]): [OppoShape, MyShape][] {
    return input
      .filter((s) => s)
      .map((s) => [
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
      case Shape.Rock:
        return 1;
      case Shape.Paper:
        return 2;
      case Shape.Scissors:
        return 3;
    }
  }

  private resultScore(result: Result): Score {
    switch (result) {
      case Result.Win:
        return 6;
      case Result.Draw:
        return 3;
      case Result.Lose:
        return 0;
    }
  }

  assertNever = (_arg: never): never => {
    throw "assertNever";
  };

  private result([oppo, my]: [OppoShape, MyShape]): Result {
    if (oppo == my) {
      return Result.Draw;
    } else if (oppo === Shape.Rock) {
      if (my === Shape.Paper) {
        return Result.Win;
      } else if (my === Shape.Scissors) {
        return Result.Lose;
      } else {
        return Result.Draw;
      }
    } else if (oppo === Shape.Paper) {
      if (my === Shape.Rock) {
        return Result.Lose;
      }
      if (my === Shape.Scissors) {
        return Result.Win;
      } else {
        return Result.Draw;
      }
    } else if (oppo === Shape.Scissors) {
      if (my === Shape.Paper) {
        return Result.Lose;
      } else if (my === Shape.Rock) {
        return Result.Win;
      } else {
        return Result.Draw;
      }
    } else {
      return this.assertNever(oppo);
    }
  }

  private myShape([oppo, result]: [OppoShape, Result]): MyShape {
    if (result === Result.Draw) {
      return oppo;
    } else if (result === Result.Lose) {
      if (oppo === Shape.Rock) {
        return Shape.Scissors;
      } else if (oppo === Shape.Paper) {
        return Shape.Rock;
      } else {
        return Shape.Paper;
      }
    } else if (result === Result.Win) {
      if (oppo === Shape.Rock) {
        return Shape.Paper;
      } else if (oppo === Shape.Paper) {
        return Shape.Scissors;
      } else {
        return Shape.Rock;
      }
    } else {
      return this.assertNever(result);
    }
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
