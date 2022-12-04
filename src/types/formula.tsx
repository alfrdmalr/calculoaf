import { Nullable } from "./nullable";
import { isValid } from "./numberish";

export interface Formula {
  hydrationPercent: number;
  levainPercent: number;
  saltPercent: number;
  //absoluteFormula?: boolean; // whether the flour/water from levain is included in calcs
  //preFermentedFlourPercent?: number;
  flourComposition?: FlourComposition;
  mixins?: MixinPercentages;
  levainFormula?: Omit<
    Formula,
    "absoluteFormula" | "saltPercent" | "flourComposition" | "mixins"
  >;
}

export interface FlourComposition {
  [flourPercent: string]: number;
}

export interface MixinPercentages {
  [mixinPercent: string]: number;
}

export const validateFormula = (f: Nullable<Formula>): f is Formula => {
  return (
    true &&
    isValid(f.saltPercent) &&
    isValid(f.levainPercent) &&
    isValid(f.hydrationPercent)
  );
  // ...and all mixins
};
