import React, { useCallback, useMemo } from "react";
import {
  applyFormula,
  applyFormulaTDM,
  getFlourMass,
} from "../../functions/applyFormula";
import { getTotalDoughMass } from "../../functions/getTotalMass";
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
          ...emptyIngredients(formula),
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

  const updateTDM = useCallback(
    (totalDoughMass: Numberish) => {
      if (!isValid(totalDoughMass) || !validateFormula(formula)) {
        updateIngredients(emptyIngredients(formula));
        return;
      }
      updateIngredients(applyFormulaTDM(formula, totalDoughMass));
    },
    [formula, updateIngredients]
  );

  const updateMixins = useCallback(
    (i: Numberish, id: string) => {
      if (!isValid(i) || !validateFormula(formula)) {
        //TODO handle invalid case
        updateIngredients({
          ...emptyIngredients(formula),
        });
        return;
      }

      // TODO disallow nullable percentages
      const percent: number =
        formula.mixins.find((m) => m.name === id)?.percentage ?? 0;
      const flour: number = getFlourMass(i, percent);
      updateIngredients(applyFormula(formula, flour));
    },
    [formula, updateIngredients]
  );

  const totalDoughMass: Numberish = useMemo(() => {
    return getTotalDoughMass(ingredients);
  }, [ingredients]);

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
      {ingredients.mixins?.map((mixin, i) => (
        <NumberInput
          key={`inclusion-${i}`}
          label={`${mixin.name} (${unit})`}
          id={mixin.name}
          value={mixin.mass}
          setValue={(n) => updateMixins(n, mixin.name)}
          required
          enforceBounds
          min={0}
          max={100}
          precision={2}
        />
      ))}
      <NumberInput
        label={`Total Dough Mass (${unit})`}
        id={"dough-mass"}
        value={totalDoughMass}
        setValue={updateTDM}
        min={0}
        enforceBounds
        precision={2}
      />
    </>
  );
};
