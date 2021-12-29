import { isValid, Numberish } from "./numberish";

export type Inclusion = {
  id: number,
  name: string,
  value: Numberish
};

export function validInclusionReducer(prev: boolean, cur: Inclusion): boolean {
  return prev && isValid(cur.value); 
}
