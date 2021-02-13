import {Formula} from "../types/formula";
import {Ingredients} from "../types/ingredients";

export function getFlourMass(ingredientMass: number, ingredientPercent: number): number {
  return ingredientMass / (ingredientPercent / 100);
}

// assumes valid formula
export function applyFormula(formula: Formula, flourMass: number): Ingredients {  
  const hydrationDecimal = formula.hydrationPercent / 100;
  const preFermentDecimal = formula.preFermentPercent / 100;
  const saltDecimal = formula.saltPercent / 100;
  
  const saltMass = flourMass * saltDecimal;
  const preFermentMass = flourMass * preFermentDecimal;
  const waterMass = flourMass * hydrationDecimal - (preFermentMass / 2); // not strictly true since the levain has some water
  
  return {
    saltMass,
    preFermentMass,
    flourMass,
    waterMass
  }
} 

export function applyFormulaTDM(formula: Formula, totalDoughMass: number): Ingredients {
  const hydrationDecimal = formula.hydrationPercent / 100;
  const preFermentDecimal = formula.preFermentPercent / 100;
  const saltDecimal = formula.saltPercent / 100;
  if (totalDoughMass < 1) {
    throw new Error("Dough mass must be at least 1 gram.")
  }

  const flourMass = totalDoughMass / (1 + (hydrationDecimal + saltDecimal + preFermentDecimal));
  return applyFormula(formula, flourMass);
}

// general formula:
// TDM = water + flour + salt + levain
// both water and flour can be expressed in terms of hydration and the other:
// water = flour * hydration
// flour = water / hydration
// meaning we only need one of these terms to generate a full set of
// ingredients, provided we have a formula (and a tdm)
//
// for example:
// flour = (TDM - salt - levain) / (1 + hydration)
// even better, we can get flour from just a TDM and recipe:
// TDM = FLOUR + FLOUR*water% + FLOUR*salt% + FLOUR*levain%
// so FLOUR = TDM / (1 + (waterPercent + saltPercent + preFermentPercent))
// hydration is a bit trickier though...
// we can still always find the flour percentage though
// if we don't have a TDM, we can just backcalculate the total flour amount from any single ingredient, because bakers percentage
