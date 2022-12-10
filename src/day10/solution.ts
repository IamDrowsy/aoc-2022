import { asNumber, chunk, last, sum } from "../utils/common";
import { AbstractSolution } from "../utils/runner";

interface Op {
  op: string;
  cycles: number;
}

class Noop implements Op {
  op: "noop";
  cycles = 1;
  constructor() {
    this.op = "noop";
  }
}

class Addx implements Op {
  op: "addx";
  toAdd: number;
  cycles = 2;
  constructor(toAdd: number) {
    this.op = "addx";
    this.toAdd = toAdd;
  }
}

type Instruction = Noop | Addx;
type Register = number;

type State = {
  cycle: number;
  phase: "start" | "during" | "after" | "idle";
  register: Register;
};

function initState(): State {
  return { cycle: 0, register: 1, phase: "idle" };
}

function runInst(currentState: State, instruction: Instruction): State[] {
  switch (instruction.op) {
    case "noop":
      return [
        {
          cycle: currentState.cycle + 1,
          register: currentState.register,
          phase: "start",
        },
        {
          cycle: currentState.cycle + 1,
          register: currentState.register,
          phase: "during",
        },
        {
          cycle: currentState.cycle + 1,
          register: currentState.register,
          phase: "after",
        },
      ];
    case "addx":
      return [
        {
          cycle: currentState.cycle + 1,
          register: currentState.register,
          phase: "start",
        },
        {
          cycle: currentState.cycle + 1,
          register: currentState.register,
          phase: "during",
        },
        {
          cycle: currentState.cycle + 1,
          register: currentState.register,
          phase: "after",
        },
        {
          cycle: currentState.cycle + 2,
          register: currentState.register,
          phase: "start",
        },
        {
          cycle: currentState.cycle + 2,
          register: currentState.register,
          phase: "during",
        },
        {
          cycle: currentState.cycle + 2,
          register: currentState.register + instruction.toAdd,
          phase: "after",
        },
      ];
  }
}

function run(initalState: State, instructions: Instruction[]): State[] {
  return instructions.reduce(
    (allStates, instruction) => {
      return [...allStates, ...runInst(last(allStates), instruction)];
    },
    [initalState]
  );
}

function parseInstruction(inst: string): Instruction {
  const parts = inst.split(" ");
  switch (parts[0]) {
    case "addx":
      return new Addx(asNumber(parts[1]));
    case "noop":
      return new Noop();
    default:
      throw new Error(`invalid instruction ${inst}`);
  }
}

function isSignalStrengthCycle(cycle: number): boolean {
  return (cycle + 20) % 40 === 0;
}

function cycleStringStrength(state: State): number {
  return state.cycle * state.register;
}

function signalStrength(states: State[]): number {
  return sum(
    states
      .filter(
        (state) =>
          isSignalStrengthCycle(state.cycle) && state.phase === "during"
      )
      .map(cycleStringStrength)
  );
}

type Pixel = "#" | ".";

function renderPixel(state: State): Pixel {
  const spritePos = [state.register, state.register + 1, state.register + 2];
  if (spritePos.includes(state.cycle % 40)) {
    return "#";
  } else {
    return ".";
  }
}

export default class Solution extends AbstractSolution<State[]> {
  public parseInput1(input: string[]): State[] {
    return run(initState(), input.map(parseInstruction));
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: State[]): string {
    return signalStrength(input).toString();
  }
  public solveSecond(input: State[]): string {
    return chunk(input.filter((s) => s.phase === "during").map(renderPixel), 40)
      .map((s) => s.join(""))
      .join("\n");
  }
}
