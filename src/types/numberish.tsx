export type Numberish = number | null;

// can't express through typescript, but this also filters out NaN values
export function isValid(n: Numberish): n is number {
  return !(n !== 0 && !n);
}
