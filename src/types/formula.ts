import { Inclusion, validInclusionReducer } from "./inclusion";
import { isValid } from "./numberish";

export interface Formula {
  hydrationPercent: number;
  levainPercent: number;
  saltPercent: number;
  //flourPercent: 100; // necessary?
  //absoluteFormula?: boolean; // whether the flour/water from levain is included in calcs
  //preFermentedFlourPercent?: number;
  flourComposition?: FlourComposition;
  inclusions: Inclusion[];
  //levainFormula?: Omit<Formula, 'absoluteFormula' | 'saltPercent' | 'flourComposition' | 'mixins'>
}

export interface FlourComposition {
  [flourType: string]: number
}

// assertion func
export const validateFormula = (f: Formula): f is {
  hydrationPercent: number,
  levainPercent: number,
  saltPercent: number,
  inclusions: Inclusion[]
} => {
  return (true
    && isValid(f.saltPercent) 
    && isValid(f.levainPercent)
    && isValid(f.hydrationPercent)
    && f.inclusions.reduce(validInclusionReducer, true)
  );
  // ...and all mixins
}
