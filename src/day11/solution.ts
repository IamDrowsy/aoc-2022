import { chunk, asNumber, last, ensure } from "../utils/common";
import { AbstractSolution } from "../utils/runner";

interface Monkey {
  id: number;
  startingItems: number[];
  inspectedItems: number;
  operation: (level: number) => number;
  divisor: number;
  test: (level: number) => boolean;
  ifTrueTarget: number;
  ifFalseTarget: number;
}

function target(targetLine: string): number {
  return asNumber(last(targetLine.split(" ")));
}

function parseMonkey(lines: string[]): Monkey {
  const [monkey, startingItems, operation, test, ifTrue, ifFalse] = lines;
  return {
    id: asNumber(monkey?.split(" ")[1]?.replace(":", "")),
    startingItems: ensure(
      startingItems?.split(":")[1]?.split(",").map(asNumber)
    ),
    inspectedItems: 0,
    operation: Function("old", `return ${operation?.split("=")[1]};`) as (
      old: number
    ) => number,
    divisor: asNumber(last(ensure(test).split(" "))),
    test: (n) => n % asNumber(last(ensure(test).split(" "))) === 0,
    ifTrueTarget: target(ensure(ifTrue)),
    ifFalseTarget: target(ensure(ifFalse)),
  };
}

const logging = false;

function log(s: string) {
  if (logging) {
    console.log(s);
  }
}

function throwItem(monkeys: Monkey[], index: number, item: number) {
  const monkey = ensure(monkeys[index]);
  log(`Inspecting Item ${item}`);
  monkey.inspectedItems++;
  const newWorryLevel = monkey.operation(item);
  log(`new worryLevel ${newWorryLevel}`);
  const testResult = monkey.test(newWorryLevel);
  log(`Test result is ${testResult}`);
  const target = testResult ? monkey.ifTrueTarget : monkey.ifFalseTarget;
  log(`Throwing to target ${target}`);
  ensure(monkeys[target]).startingItems.push(newWorryLevel);
  return monkeys;
}

function executeMonkey(monkeys: Monkey[], index: number): Monkey[] {
  log(`Running Monkey ${index}`);
  const currentItems = ensure(monkeys[index]).startingItems;
  monkeys = currentItems.reduce(
    (monkeys, item) => throwItem(monkeys, index, item),
    monkeys
  );
  ensure(monkeys[index]).startingItems = [];
  log(" ");
  return monkeys;
}

function executeRound(monkeys: Monkey[]): Monkey[] {
  return Array(monkeys.length)
    .fill(0)
    .reduce((monkeys, _zero, index) => executeMonkey(monkeys, index), monkeys);
}

function monkeyBusiness(monkeys: Monkey[]): number {
  const sortedBusiness = monkeys
    .map((m) => m.inspectedItems)
    .sort((a, b) => b - a);
  return ensure(sortedBusiness[0]) * ensure(sortedBusiness[1]);
}

export default class Solution extends AbstractSolution<Monkey[]> {
  public parseInput1(input: string[]): Monkey[] {
    return chunk(input, 7).map(parseMonkey);
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: Monkey[]): string {
    const after20Rounds = Array(20)
      .fill(0)
      .reduce(
        (monkeys, _zero) => executeRound(monkeys),
        input.map((m: Monkey) => {
          const oldOp = m.operation;
          m.operation = (n: number) => Math.floor(oldOp(n) / 3);
          return m;
        })
      );

    return monkeyBusiness(after20Rounds).toString();
  }
  public solveSecond(input: Monkey[]): string {
    const divisor = input.map((m) => m.divisor).reduce((n, m) => n * m);
    const after10000Rounds = Array(10000)
      .fill(0)
      .reduce(
        (monkeys, _zero) => executeRound(monkeys),
        input.map((m: Monkey) => {
          const oldOp = m.operation;
          m.operation = (n: number) => oldOp(n) % divisor;
          return m;
        })
      );

    return monkeyBusiness(after10000Rounds).toString();
  }
}
