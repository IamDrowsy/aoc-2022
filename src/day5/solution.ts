import { Char, singleStringToChar } from "../utils/chars";
import { asNumber, ensure, notBlank } from "../utils/common";
import { AbstractSolution } from "../utils/runner";

type Crate = Char;
type Stack = Crate[];
type Index = number;
type Stock = Stack[];
type Instruction = {count: number, from: Index, to: Index };


function parseInstruction(line: string): Instruction {
  const result =  line.match(/move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/)?.groups
  if (result) {
    return {count: asNumber(result.count) , from: asNumber(result.from) -1 , to: asNumber(result.to) -1}
  } else {
    throw new Error(`invalid instruction: ${line}`);
  }
}

function parseStack(input: string[]): Stock {
  // remove last line as it is always the frist nat number and we don't need it.
  const lastLine = ensure(input.pop());
  const result = [];
  const stackCount = Math.ceil(lastLine.length / 4);
  for (let i = 0; i < stackCount; i++) {
    result.push(input.map((line) => line.substring(4*i + 1, 4*i +2)).filter(notBlank).map(singleStringToChar));
    };
  return result;
}

// we mutate stock! try without mutation on other days
function takeFromStack(stock: Stock, index: Index, count: number) {
  return ensure(stock[index]?.splice(0, count));
}

function putToStack(stock: Stock, index: Index, newItem: Stack) {
  return stock[index] = newItem.concat(ensure(stock[index]));
}

function execute(stock: Stock, inst: Instruction) {
  const tookAway = takeFromStack(stock, inst.from, inst.count);
  putToStack(stock, inst.to, tookAway.reverse());
  return stock;
}

function execute2(stock: Stock, inst: Instruction) {
  const tookAway = takeFromStack(stock, inst.from, inst.count);
  putToStack(stock, inst.to, tookAway);
  return stock;
}

function allTopCrates(stock: Stock) {
  return stock.map((s) => s[0]).join('');
}

export default class Solution extends AbstractSolution<[Stock, Instruction[]]> {

  public parseInput1(input: string[]): [Stock, Instruction[]] {
    const separtion = input.indexOf('')
    return [parseStack(input.slice(0, separtion)), input.slice(separtion+1).map(parseInstruction)];
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: [Stock, Instruction[]]): string {
    const result = input[1].reduce(execute, input[0]);
    return allTopCrates(result);
  }
  public solveSecond(input: [Stock, Instruction[]]): string {
    const result = input[1].reduce(execute2, input[0]);
    return allTopCrates(result);
  }
}
