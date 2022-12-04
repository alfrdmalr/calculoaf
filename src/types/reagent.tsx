import { Ingredients } from "./ingredients";
import { Numberish } from "./numberish";

export type ReagentType = keyof Ingredients | "totalDoughMass";

export type Reagent = {
  value: Numberish;
  key: ReagentType;
};

// use this in totals component
export function getReagentLabel(key: ReagentType): string {
  switch (key) {
    case "totalDoughMass":
      return "Total Dough";
    case "flourMass":
      return "Flour";
    case "levainMass":
      return "Levain";
    case "waterMass":
      return "Water";
    case "saltMass":
      return "Salt";
  }
}
