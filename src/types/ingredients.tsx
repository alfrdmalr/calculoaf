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
  mixins?: 
   */
  mixins: Mixin[];
}

export type Mixin = {
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
    mixins:
      formula.mixins?.map((mixin) => ({
        name: mixin.name,
        mass: null,
      })) ?? [],
  };
}

export function validateIngredients(
  i: Nullable<Ingredients>
): i is Ingredients {
  const allMixinsValid: boolean = (i.mixins ?? []).reduce(
    (acc: boolean, cur: Mixin) => isValid(cur.mass) && acc,
    true
  );
  return (
    true &&
    isValid(i.saltMass) &&
    isValid(i.flourMass) &&
    isValid(i.waterMass) &&
    isValid(i.levainMass) &&
    allMixinsValid
  );
}
