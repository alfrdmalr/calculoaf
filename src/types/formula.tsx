export interface Formula {
  hydrationPercent: number;
  levainHydrationOffset?: boolean;
  levainPercent: number;
  preFermentedFlourPercent?: number;
  saltPercent: number;
  flourComposition?: FlourComposition;
  mixins?: MixinPercentages;
  levainFormula?: Omit<Formula, 'saltPercent' | 'flourComposition' | 'mixins'>
}


export interface FlourComposition {
  [flourPercent: string]: number
}

export interface MixinPercentages {
  [mixinPercent: string]: number;
}

