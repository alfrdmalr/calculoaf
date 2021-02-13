export function parseString (s: string): number | undefined {
  if (s === "") {
    return undefined;
  }
  return parseFloat(s);
}
