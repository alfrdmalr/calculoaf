import { Inclusion, validInclusionReducer } from "./inclusion";
import { isValid, Numberish } from "./numberish";

export interface Ingredients {
  waterMass: Numberish;
  levainMass: Numberish;
  saltMass: Numberish;
  flourMass: Numberish;

  /*
  flourComposition?: FlourComposition;
   */
  inclusions: Inclusion[];
}

export interface MixinAmounts {
  [mixinName: string]: number;
}

export function validateIngredients(i: Ingredients): i is ({
  saltMass: number, 
  flourMass: number, 
  waterMass: number, 
  levainMass: number,
  inclusions: Inclusion[]
}) {

  return (true
    && isValid(i.saltMass) 
    && isValid(i.flourMass) 
    && isValid(i.waterMass) 
    && isValid(i.levainMass)
    && i.inclusions.reduce(validInclusionReducer, true)
  ); 
}
