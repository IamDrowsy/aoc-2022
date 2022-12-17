export function stopWithError(msg: string) {
  console.error(msg);
  process.exit(1);
}

export function notBlank(s: string) {
  return !!s.trim();
}

export function notEmpty<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0;
}

export function intersection<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  return new Set([...s1].filter((x) => s2.has(x)));
}

export function union<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  return new Set([...s1, ...s2]);
}

export function difference<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  return new Set([...s1].filter((x) => !s2.has(x)));
}

export function asSet<T>(array: T[]) {
  return new Set<T>(array);
}

export function asArray<T>(set: Set<T>) {
  return Array.from(set);
}

export function asNumber(input: string | undefined) {
  if (input) {
    return +input;
  } else {
    throw new Error(`undefined input in asNumber`);
  }
}

export function ensure<T>(input: T | undefined) {
  if (input) {
    return input;
  } else {
    throw new Error(`called ensure with undefined`);
  }
}

export function last<T>(array: T[]): T {
  return ensure(array[array.length - 1]);
}

export function range(start: number, end: number): number[] {
  return Array.from(Array(end - start + 1).keys()).map((x) => x + start);
}

export function chunk<T>(array: T[], chunkSize: number): T[][] {
  return Array.from(
    // iterating over { length: 3 } will result in [0, 1, 2];
    { length: Math.ceil(array.length / chunkSize) },
    (_item, index) =>
      array.slice(index * chunkSize, index * chunkSize + chunkSize)
  );
}

export function mapcat<I, O>(array: I[], f: (a: I) => O[]): O[] {
  return array.map(f).reduce((all, array) => all.concat(array));
}

export function add(n1: number, n2: number) {
  return n1 + n2;
}

export function sum(numbers: number[]) {
  return numbers.reduce((sum, number) => sum + number, 0);
}

export function product(numbers: number[]) {
  return numbers.reduce((product, number) => product * number, 1);
}
