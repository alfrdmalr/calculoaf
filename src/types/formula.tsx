import { Nullable } from "./nullable";
import { isValid } from "./numberish";

export interface Formula {
  hydrationPercent: number;
  levainPercent: number;
  saltPercent: number;
  //absoluteFormula?: boolean; // whether the flour/water from levain is included in calcs
  //preFermentedFlourPercent?: number;
  flourComposition?: FlourComposition;
  inclusions: FormulaInclusion[];
  levainFormula?: Omit<
    Formula,
    "absoluteFormula" | "saltPercent" | "flourComposition" | "inclusions"
  >;
}

export interface FlourComposition {
  [flourPercent: string]: number;
}

export interface FormulaInclusion {
  name: string;
  percentage: number | null;
}

export const validateFormula = (f: Nullable<Formula>): f is Formula => {
  const allInclusionsValid: boolean = (f.inclusions ?? []).reduce(
    (acc: boolean, cur: FormulaInclusion) => isValid(cur.percentage) && acc,
    true
  );

  return (
    isValid(f.saltPercent) &&
    isValid(f.levainPercent) &&
    isValid(f.hydrationPercent) &&
    allInclusionsValid
  );
};
