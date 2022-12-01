export function stopWithError(msg: string) {
  console.error(msg);
  process.exit(1);
}
