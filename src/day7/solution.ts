import { asNumber, ensure, notBlank, notEmpty, sum } from "../utils/common";
import { AbstractSolution } from "../utils/runner";

interface BaseCommand {
  command: string;
}

interface LsCommand extends BaseCommand {
  type: "LsCommand";
  command: "ls";
  output: LsLine[];
}

interface hasSize {
  size: number;
}

function isLs(c: Command): c is LsCommand {
  return c.type === "LsCommand";
}

interface CdCommand extends BaseCommand {
  type: "CdCommand";
  into: string;
  command: "cd";
}

function isCd(c: Command): c is CdCommand {
  return c.type === "CdCommand";
}

interface File extends hasSize {
  type: "File";
  name: string;
}

interface Dir {
  type: "Dir";
  name: string;
  size?: number;
  content: Record<string, File | Dir>;
}

function hasSize(x: Dir | File): x is (Dir | File) & hasSize {
  return "size" in x;
}

function isDir(d: File | Dir | undefined): d is Dir {
  return d?.type === "Dir";
}

type LsLine = File | Dir;

type Command = LsCommand | CdCommand;

interface Root extends Dir {
  name: "/";
}

interface OS {
  root: Root;
  pwd: [Dir, ...Dir[]];
}

function initOS(): OS {
  const root: Root = { type: "Dir", name: "/", content: {} };
  return {
    root: root,
    pwd: [root],
  };
}

function parseLsOut(line: string): LsLine {
  const [a, b] = line.split(" ");
  if (a === "dir") {
    return {
      type: "Dir",
      name: ensure(b),
      content: {},
    };
  } else {
    return {
      type: "File",
      name: ensure(b),
      size: asNumber(a),
    };
  }
}

function parseCommand(line: string): Command {
  const [commandPart, ...outPart] = line.trim().split("&");
  if (!commandPart) {
    throw new Error("got empty command");
  } else {
    const [command, ...params] = ensure(commandPart.split(" "));
    if (command === "ls") {
      return {
        type: "LsCommand",
        command: command,
        output: outPart.filter(notBlank).map(parseLsOut),
      };
    } else if (command === "cd") {
      return {
        type: "CdCommand",
        command: command,
        into: ensure(params[0]),
      };
    } else {
      throw new Error(`invalid command ${command}`);
    }
  }
}

function buildContent(lines: LsLine[]): Record<string, File | Dir> {
  return lines.reduce((result, line) => {
    result[line.name] = line;
    return result;
  }, {} as Record<string, File | Dir>);
}

function runCommand(os: OS, command: Command): OS {
  const currentDir = os.pwd[0];
  if (isCd(command)) {
    if (command.into === "/") {
      return { root: os.root, pwd: [os.root] };
    } else if (command.into === "..") {
      const [_currentDir, ...dirStack] = os.pwd;
      if (notEmpty(dirStack)) {
        return { root: os.root, pwd: dirStack };
      } else {
        throw new Error("cannot cd .. from base dir");
      }
    } else {
      const intoDir = currentDir.content[command.into];
      if (isDir(intoDir)) {
        return { root: os.root, pwd: [intoDir, ...os.pwd] };
      } else {
        throw new Error(
          `${intoDir} is not a valid dir in ${currentDir.content}`
        );
      }
    }
  } else if (isLs(command)) {
    currentDir.content = buildContent(command.output);
    return { root: os.root, pwd: os.pwd };
  } else {
    throw new Error(`invalid command ${command}`);
  }
}

function addSize(input: Dir | File): (Dir | File) & hasSize {
  if (hasSize(input)) {
    return input;
  } else {
    const contentWithSize = Object.entries(input.content).reduce(
      (result, [name, item]) => {
        const newItem = addSize(item);
        result[name] = newItem;
        return result;
      },
      {} as Record<string, (File | Dir) & hasSize>
    );
    input.content = contentWithSize;
    input.size = Object.values(contentWithSize).reduce(
      (size: number, item: hasSize) => size + item.size,
      0
    );
    if (hasSize(input)) {
      return input;
    } else {
      throw new Error("unreachable");
    }
  }
}

function listAllDirs(input: Dir | File): Dir[] {
  if (isDir(input)) {
    return [
      input,
      ...Object.values(input.content)
        .map(listAllDirs)
        .reduce((x, y) => x.concat(y)),
    ];
  } else {
    return [];
  }
}

export default class Solution extends AbstractSolution<Command[]> {
  public parseInput1(input: string[]): Command[] {
    return input.join("&").split("$").filter(notBlank).map(parseCommand);
  }

  public parseInput2 = this.parseInput1;

  public solveFirst(input: Command[]): string {
    const os = input.reduce(runCommand, initOS());
    // TODO as hasSize is not nice. Make listAllDirs "forward" the hasSize;
    const foldersWithSize = listAllDirs(addSize(os.root)) as hasSize[];
    return sum(
      foldersWithSize.map((f) => f.size).filter((n) => n <= 100000)
    ).toString();
  }
  public solveSecond(input: Command[]): string {
    const os = input.reduce(runCommand, initOS());
    // TODO as hasSize is not nice. Make listAllDirs "forward" the hasSize;
    const rootWithSizes = addSize(os.root);
    const sizeNeeded = 30000000 - (70000000 - rootWithSizes.size);
    const foldersWithSize = listAllDirs(rootWithSizes) as hasSize[];
    const sizes = foldersWithSize.map((f) => f.size).sort();
    return sizes.find((n) => n >= sizeNeeded) + "";
  }
}
