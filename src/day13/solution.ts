import { chunk, ensure, product, sum } from "../utils/common";
import { AbstractSolution } from "../utils/runner";

type Packet = number | Packet[];
type Pair = [Packet, Packet];
type Order = 'Right' | 'NotRight' | 'Undecided'

function isNumber(p: Packet): p is number {
  return typeof p === 'number';
}

function isList(p: Packet): p is Packet[] {
  return typeof p === 'object'
}

function defined(p: Packet | undefined): p is Packet {
  return p !== undefined;
}

function checkOrder([p1, p2]: Pair): Order {
  if (isNumber(p1) && isNumber(p2)) {
    if (p1 < p2) {
      return 'Right';
    } else if (p1 > p2) {
      return 'NotRight';
    } else {
      return 'Undecided';
    }
  }
  else if (isNumber(p1) && isList(p2)) {
    return checkOrder([[p1], p2]);
  } else if (isList(p1) && isNumber(p2)) {
    return checkOrder([p1, [p2]]);
  } else if (isList(p1) && isList(p2)) {
    for (let i = 0; i <= Math.max(p1.length, p2.length); i++) {
      const e1 = p1[i]; const e2 = p2[i];
      if (!defined(e1) && !defined(e2)) {
        return "Undecided";
      } else if (!defined(e1) && defined(e2)) {
        return 'Right'
      } else if (defined(e1) && !defined(e2)) {
        return 'NotRight'
      } else if (defined(e1) && defined(e2)) {
        const result = checkOrder([e1, e2]);
        if (result !== 'Undecided') {
          return result;
        }
      }
    }
  return 'Undecided';
  } else {
    throw new Error('invalid case');
  }
}

const dividerPackets: Packet[] = [[[2]], [[6]]];

export default class Solution extends AbstractSolution<Pair[], Packet[]> {

  public parseInput1(input: string[]): Pair[] {
    return chunk(input, 3).map((lines) => [JSON.parse(ensure(lines[0])), JSON.parse(ensure(lines[1]))]);
  }

  public parseInput2(input: string[]): Packet[] {
    return this.parseInput1(input).reduce((all, [p1, p2]) => [...all, p1, p2], dividerPackets);
  }

  public solveFirst(input: Pair[]): string {
    return sum(input.map((p, i) => checkOrder(p) === 'Right' ? i+1 : 0)).toString();
  }
  public solveSecond(input: Packet[]): string {
    return product(input.sort((p1, p2) => checkOrder([p1, p2]) === 'Right'? -1 : 1).map((p, i) => dividerPackets.includes(p) ? i + 1 : 1)).toString();
  }
}
