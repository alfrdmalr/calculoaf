import {Formula, validateFormula} from "../types/formula";
import { Inclusion } from "../types/inclusion";
import {emptyIngredients, Ingredients } from "../types/ingredients";

export function getFlourMass(ingredientMass: number, ingredientPercent: number): number {
  return ingredientMass / (ingredientPercent / 100);
}

// assumes valid formula
export function applyFormula(formula: Formula, flourMass: number): Ingredients {  
  if (!validateFormula(formula)) {
    return emptyIngredients();
  }

  const hydrationDecimal = formula.hydrationPercent / 100;
  const levainDecimal = formula.levainPercent / 100;
  const saltDecimal = formula.saltPercent / 100;
  
  const saltMass = flourMass * saltDecimal;
  const levainMass = flourMass * levainDecimal;
  const waterMass = flourMass * hydrationDecimal; // - (preFermentMass / 2); // not strictly true since the levain has some water
  
  const inclusionMasses = formula.inclusions.map((inc: Inclusion) => {
      return {
        ...inc,
        value: (flourMass * ((inc.value ?? 0) / 100)),
      };
  });

  return {
    saltMass,
    levainMass,
    flourMass,
    waterMass,
    inclusions: inclusionMasses
  }
} 

export function applyFormulaTDM(formula: Formula, totalDoughMass: number): Ingredients {
  const {saltPercent, hydrationPercent, levainPercent, inclusions} = formula;

  if (totalDoughMass < 0) {
    throw new Error("Dough mass cannot be negative")
  }

  const inclusionsTotal: number = inclusions?.reduce((prev: number, cur: Inclusion) => {
    return prev + (cur.value ?? 0);
  }, 0) ?? 0;



  // +100 to include flour, which isn't represented strictly in the Formula
  const totalPercentages = 100 + saltPercent + hydrationPercent + levainPercent + inclusionsTotal;
  const flourMass = (totalDoughMass * 100) / totalPercentages;

  return applyFormula(formula, flourMass);
}
