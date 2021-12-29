import { Formula } from "../types/formula";
import { Ingredients } from "../types/ingredients";

export function emptyIngredients(f: Formula): Ingredients {
  return {
    levainMass: null,
    flourMass: null,
    waterMass: null,
    saltMass: null,
    inclusions: f.inclusions.map(i => ({
      ...i,
      value: null
    }))
  }
};
