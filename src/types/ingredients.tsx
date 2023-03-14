import { Formula } from "./formula";
import { Nullable } from "./nullable";
import { isValid } from "./numberish";

export interface Ingredients {
  waterMass: number;
  levainMass: number;
  saltMass: number;
  flourMass: number;

  /*
  flourComposition?: FlourComposition;
  inclusions?: 
   */
  inclusions: Inclusion[];
}

export type Inclusion = {
  name: string;
  mass: number | null;
};

export function emptyIngredients(
  formula: Nullable<Formula>
): Nullable<Ingredients> {
  return {
    levainMass: null,
    flourMass: null,
    waterMass: null,
    saltMass: null,
    inclusions:
      formula.inclusions?.map((inclusion) => ({
        name: inclusion.name,
        mass: null,
      })) ?? [],
  };
}

export function validateIngredients(
  i: Nullable<Ingredients>
): i is Ingredients {
  const allInclusionsValid: boolean = (i.inclusions ?? []).reduce(
    (acc: boolean, cur: Inclusion) => isValid(cur.mass) && acc,
    true
  );
  return (
    true &&
    isValid(i.saltMass) &&
    isValid(i.flourMass) &&
    isValid(i.waterMass) &&
    isValid(i.levainMass) &&
    allInclusionsValid
  );
}
