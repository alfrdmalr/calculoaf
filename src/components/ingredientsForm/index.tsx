import React, { useCallback } from 'react';
import { applyFormula, getFlourMass } from '../../functions/applyFormula';
import { emptyIngredients } from '../../functions/emptyIngredients';
import { Formula, validateFormula } from '../../types/formula';
import { Ingredients } from '../../types/ingredients';
import { isValid, Numberish } from '../../types/numberish';
import { NumberInput } from '../numberInput';

export interface IngredientsFormProps {
  ingredients: Ingredients;
  updateIngredients: (i: Ingredients | ((prev: Ingredients) => Ingredients)) => void;
  formula: Formula;
}

export const IngredientsForm = (props: IngredientsFormProps) => {
  const { updateIngredients, ingredients, formula } = props;
  const { levainMass, flourMass, waterMass, saltMass } = ingredients;

  //todo
  const unit: string = "g";

  const adjustIngredients = useCallback((i: Numberish, getPercent: (f: Formula) => number) => {
    if (!isValid(i) || !validateFormula(formula)) {
      updateIngredients({
        ...emptyIngredients(formula),
        //[key]: i
      });
      return;
    }

    const percent = getPercent(formula);
    const flour = getFlourMass(i, percent);
    updateIngredients(applyFormula(formula, flour));
  }, [formula, updateIngredients]);

  const adjustInclusions = useCallback((i: Numberish, getPercent: (f: Formula) => Numberish) => {
    if (!isValid(i) || !validateFormula(formula)) {
      updateIngredients(emptyIngredients(formula))
      return;
    }

    /*
            ({
            ...prev,
            inclusions: prev.inclusions?.map((i: Inclusion) => {
              if (i.id === e.id) {
                return {
                  ...i,
                  value: n
                }
              } else {
                return i;
              }
            })
            })
     */

    const percent = getPercent(formula);
    if (!percent) {
      console.log('null percent encountnered when adjusting inclusions');
      return;
    }
    const flour = getFlourMass(i, percent);
    updateIngredients(applyFormula(formula, flour));
  }, [formula, updateIngredients]);

  return (
    <>
      <h2>Ingredients</h2>
      <NumberInput
        label={`Pre-Ferment (${unit})`}
        id={'pre-ferment'}
        value={levainMass}
        setValue={(n) => adjustIngredients(n, f => f.levainPercent)}
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput
        label={`Water (${unit})`}
        id={'water'}
        value={waterMass}
        setValue={(n) => adjustIngredients(n, f => f.hydrationPercent)}
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput
        label={`Salt (${unit})`}
        id={'salt'}
        value={saltMass}
        setValue={(n) => adjustIngredients(n, f => f.saltPercent)}
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput
        label={`Flour (${unit})`}
        id={'flour'}
        value={flourMass}
        setValue={(n) => adjustIngredients(n, _f => 100)}
        enforceBounds
        precision={2}
        min={0}
      />
      {ingredients?.inclusions?.map(e => (
        <NumberInput
          label={`${e.name} (%)`}
          id={`inclusion-${e.name}`}
          key={e.id}
          value={e.value}
          setValue={(n) => adjustInclusions(n, f => f.inclusions[e.id]?.value)}
          required
          enforceBounds
          precision={2}
          min={0}
          max={100}
        />
      ))}

    </>
  )
}
