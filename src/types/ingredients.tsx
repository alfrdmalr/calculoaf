import { Nullable } from "./nullable";
import { isValid, Numberish } from "./numberish";

export interface Ingredients {
  waterMass: number;
  levainMass: number;
  saltMass: number;
  flourMass: number;

  /*
  flourComposition?: FlourComposition;
  mixins?: 
   */
}

export function emptyIngredients(): Nullable<Ingredients> {
  return {
    levainMass: null,
    flourMass: null,
    waterMass: null,
    saltMass: null,
  };
}

export function validateIngredients(i: Nullable<Ingredients>): i is {
  saltMass: number;
  flourMass: number;
  waterMass: number;
  levainMass: number;
} {
  return (
    true &&
    isValid(i.saltMass) &&
    isValid(i.flourMass) &&
    isValid(i.waterMass) &&
    isValid(i.levainMass)
  );
}
