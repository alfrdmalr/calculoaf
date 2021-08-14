export interface Formula {
  hydrationPercent: number;
  levainPercent: number;
  saltPercent: number;
  absoluteFormula?: boolean; // whether the flour/water from levain is included in calcs
  preFermentedFlourPercent?: number;
  flourComposition?: FlourComposition;
  mixins?: MixinPercentages;
  levainFormula?: Omit<Formula, 'absoluteFormula' | 'saltPercent' | 'flourComposition' | 'mixins'>
}

export interface FlourComposition {
  [flourPercent: string]: number
}

export interface MixinPercentages {
  [mixinPercent: string]: number;
}

export const isValidFormula = (f: Formula): boolean => {
  if (isNaN(f.saltPercent) || f.saltPercent === undefined) {
    return false;
  }
  if (isNaN(f.hydrationPercent) || f.hydrationPercent === undefined) {
    return false;
  }
  if (isNaN(f.levainPercent) || f.levainPercent === undefined) {
    return false;
  }
  return true;
}
