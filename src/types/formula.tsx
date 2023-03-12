import { Nullable } from "./nullable";
import { isValid } from "./numberish";

export interface Formula {
  hydrationPercent: number;
  levainPercent: number;
  saltPercent: number;
  //absoluteFormula?: boolean; // whether the flour/water from levain is included in calcs
  //preFermentedFlourPercent?: number;
  flourComposition?: FlourComposition;
  mixins: FormulaMixin[];
  levainFormula?: Omit<
    Formula,
    "absoluteFormula" | "saltPercent" | "flourComposition" | "mixins"
  >;
}

export interface FlourComposition {
  [flourPercent: string]: number;
}

export interface FormulaMixin {
  name: string;
  percentage: number | null;
}

export const validateFormula = (f: Nullable<Formula>): f is Formula => {
  const allMixinsValid: boolean = (f.mixins ?? []).reduce(
    (acc: boolean, cur: FormulaMixin) => isValid(cur.percentage) && acc,
    true
  );

  return (
    isValid(f.saltPercent) &&
    isValid(f.levainPercent) &&
    isValid(f.hydrationPercent) &&
    allMixinsValid
  );
};
