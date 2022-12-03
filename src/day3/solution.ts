import { AbstractSolution } from "../utils/runner";
import { Char, stringToChars, chars } from "../utils/chars";
import {
  intersection,
  add,
  notBlank,
  asSet,
  asArray,
  chunk,
} from "../utils/common";

type Item = Char;
type RucksackItems = [Item, ...Item[]];
type RucksackContent = [RucksackItems, RucksackItems];
type Section = "Left" | "Right";
type Group = [RucksackItems, RucksackItems, RucksackItems];

function isNotEmpty(chars: Char[]): chars is RucksackItems {
  return chars.length > 0;
}

function isBisectable(items: RucksackItems) {
  return items.length % 2 === 0 && items.length > 0;
}

function getBisection(items: RucksackItems, section: Section): RucksackItems {
  if (isBisectable(items)) {
    const middle = items.length / 2;
    if (section === "Left") {
      return items.slice(0, middle) as RucksackItems;
    } else {
      return items.slice(middle) as RucksackItems;
    }
  } else {
    throw new Error(`items ${items} not bisectable. Size is ${items.length}`);
  }
}

function lineToItems(line: string): RucksackItems {
  const chars = stringToChars(line);
  if (isNotEmpty(chars)) {
    return chars;
  } else {
    throw new Error("Empty RucksackItems");
  }
}

function packCompartments(items: RucksackItems): RucksackContent {
  return [getBisection(items, "Left"), getBisection(items, "Right")];
}

function itemIsDefined(item: Item | undefined): item is Item {
  return !!item;
}

function itemScore(item: Item): number {
  return chars.indexOf(item) + 1;
}

function firstItem(items: Item[]): Item {
  const firstItem = items[0];
  if (itemIsDefined(firstItem)) {
    return firstItem;
  } else {
    throw new Error(`no first Item`);
  }
}

function commonItem(contents: RucksackItems[]) {
  const commons = contents
    .map(asSet)
    .reduce((common, content) => intersection(common, content));
  return firstItem(asArray(commons));
}

function firstPackError(rucksack: RucksackContent): Item {
  return commonItem(rucksack);
}

function isGroup(items: RucksackItems[]): items is Group {
  return items.length === 3;
}

function buildGroups(items: RucksackItems[]): Group[] {
  return chunk(items, 3).filter(isGroup);
}

export default class Solution extends AbstractSolution<RucksackItems[]> {
  public parseInput1(input: string[]): RucksackItems[] {
    return input.filter(notBlank).map(lineToItems);
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: RucksackItems[]): string {
    return input
      .map(packCompartments)
      .map(firstPackError)
      .map(itemScore)
      .reduce(add)
      .toString();
  }
  public solveSecond(input: RucksackItems[]): string {
    return buildGroups(input)
      .map(commonItem)
      .map(itemScore)
      .reduce(add)
      .toString();
  }
}
