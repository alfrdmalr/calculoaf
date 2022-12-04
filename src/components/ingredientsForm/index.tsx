import React, { useCallback } from "react";
import { applyFormula, getFlourMass } from "../../functions/applyFormula";
import { Formula, validateFormula } from "../../types/formula";
import { emptyIngredients, Ingredients } from "../../types/ingredients";
import { Nullable } from "../../types/nullable";
import { isValid, Numberish } from "../../types/numberish";
import { NumberInput } from "../numberInput";

export interface IngredientsFormProps {
  ingredients: Nullable<Ingredients>;
  updateIngredients: (i: Nullable<Ingredients>) => void;
  formula: Nullable<Formula>;
}

export const IngredientsForm = (props: IngredientsFormProps) => {
  const { updateIngredients, ingredients, formula } = props;
  const { levainMass, flourMass, waterMass, saltMass } = ingredients;

  //todo
  const unit: string = "g";

  // curry apply formula
  const adjustIngredients = useCallback(
    (
      i: Numberish,
      getPercent: (f: Formula) => number,
      key: keyof Ingredients
    ) => {
      if (!isValid(i) || !validateFormula(formula)) {
        updateIngredients({
          ...emptyIngredients(),
          [key]: i,
        });
        return;
      }

      const percent: number = getPercent(formula);
      const flour: number = getFlourMass(i, percent);
      updateIngredients(applyFormula(formula, flour));
    },
    [formula, updateIngredients]
  );

  return (
    <>
      <h2>Ingredients</h2>
      <NumberInput
        label={`Pre-Ferment (${unit})`}
        id={"pre-ferment"}
        value={levainMass}
        setValue={(n) =>
          adjustIngredients(n, (f) => f.levainPercent, "levainMass")
        }
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput
        label={`Water (${unit})`}
        id={"water"}
        value={waterMass}
        setValue={(n) =>
          adjustIngredients(n, (f) => f.hydrationPercent, "waterMass")
        }
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput
        label={`Salt (${unit})`}
        id={"salt"}
        value={saltMass}
        setValue={(n) => adjustIngredients(n, (f) => f.saltPercent, "saltMass")}
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput
        label={`Flour (${unit})`}
        id={"flour"}
        value={flourMass}
        setValue={(n) => adjustIngredients(n, (_f) => 100, "flourMass")}
        enforceBounds
        precision={2}
        min={0}
      />
    </>
  );
};
