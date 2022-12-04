import { Formula } from "../types/formula";
import { Ingredients } from "../types/ingredients";

export function getFlourMass(
  ingredientMass: number,
  ingredientPercent: number
): number {
  return ingredientMass / (ingredientPercent / 100);
}

// assumes valid formula
export function applyFormula(formula: Formula, flourMass: number): Ingredients {
  const hydrationDecimal = formula.hydrationPercent / 100;
  const levainDecimal = formula.levainPercent / 100;
  const saltDecimal = formula.saltPercent / 100;

  const saltMass = flourMass * saltDecimal;
  const levainMass = flourMass * levainDecimal;
  const waterMass = flourMass * hydrationDecimal; // - (preFermentMass / 2); // not strictly true since the levain has some water

  return {
    saltMass,
    levainMass,
    flourMass,
    waterMass,
  };
}

export function applyFormulaTDM(
  formula: Formula,
  totalDoughMass: number
): Ingredients {
  const { saltPercent, hydrationPercent, levainPercent } = formula;
  if (totalDoughMass < 0) {
    throw new Error("Dough mass cannot be negative");
  }

  // +100 to include flour, which isn't represented strictly in the Formula
  const totalPercentages = 100 + saltPercent + hydrationPercent + levainPercent;
  const flourMass = (totalDoughMass * 100) / totalPercentages;

  return applyFormula(formula, flourMass);
}
