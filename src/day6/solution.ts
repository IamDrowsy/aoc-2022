import { Char, stringToChars } from "../utils/chars";
import { asSet, ensure } from "../utils/common";
import { AbstractSolution } from "../utils/runner";


type Packet = [Char, Char, Char, Char]
type Message = [Char, Char, Char, Char, Char, Char, Char, Char, Char, Char, Char, Char, Char, Char];

function allDifferent<T>(p: T[]) {
  return asSet(p).size === p.length;
}

export default class Solution extends AbstractSolution<Packet[], Message[]> {

  public parseInput1(input: string[]): Packet[] {
    // only one line in input:
    const message = stringToChars(ensure(input[0]));
    function parsePaket(i: number): Packet {
      return [ensure(message[i]), ensure(message[i+1]), ensure(message[i+2]), ensure(message[i+3])];
    }
    return [...Array(message.length - 3).keys()].map((i) => parsePaket(i));
  }

  public parseInput2(input: string[]): Message[] {
    // only one line in input:
    const message = stringToChars(ensure(input[0]));
    function parsePaket(i: number): Message {
      return [ensure(message[i]), ensure(message[i+1]), ensure(message[i+2]), ensure(message[i+3]),
      ensure(message[i+4]), ensure(message[i+5]), ensure(message[i+6]), ensure(message[i+7]),
      ensure(message[i+8]), ensure(message[i+9]), ensure(message[i+10]), ensure(message[i+11]),
      ensure(message[i+12]), ensure(message[i+13])];
    }
    return [...Array(message.length - 13).keys()].map((i) => parsePaket(i));
  }

  public solveFirst(input: Packet[]): string {
    return (input.findIndex(allDifferent) + 4).toString();
  }
  public solveSecond(input: Message[]): string {
    return (input.findIndex(allDifferent) + 14).toString();
  }
}
