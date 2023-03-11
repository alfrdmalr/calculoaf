import { Ingredients } from "../types/ingredients";
import { Nullable } from "../types/nullable";
import { Numberish } from "../types/numberish";

export function getTotalDoughMass(
  ingredients: Nullable<Ingredients>
): Numberish {
  const ingredientMasses = [
    ingredients.levainMass,
    ingredients.waterMass,
    ingredients.saltMass,
    ingredients.flourMass,
  ];
  const total: Numberish = ingredientMasses.reduce((acc, cur) => {
    if (acc === null || cur === null) {
      return null;
    }
    return acc + cur;
  }, 0);
  return total;
}
