import React from 'react';
import {applyFormula, getFlourMass} from '../../functions/applyFormula';
import {Formula} from '../../types/formula';
import {Ingredients} from '../../types/ingredients';
import {NumberInput} from '../numberInput';

export interface IngredientsFormProps {
  ingredients: Ingredients | undefined;
  updateIngredients: (i: Ingredients | null) => void;
  formula: Formula;
}

export const IngredientsForm = (props: IngredientsFormProps) => {
  const {updateIngredients, ingredients, formula } = props;
  const { levainMass, flourMass, waterMass, saltMass } = ingredients || {
    levainMass: undefined, flourMass: undefined, waterMass: undefined, saltMass: undefined
  };

  //todo
  const unit: string = "g";

  const adjustIngredients = (n: number | undefined, ingredientPercent: number): void => {
    if (n === undefined) {
      updateIngredients(null)
      return;
    }
    if (isNaN(n)) {
      //todo ERROR
      return;
    }

    // this needs special handler for waterr, which has amore complex calc
    const flourMass: number = getFlourMass(n, ingredientPercent);
    const adjustedIngredients: Ingredients = applyFormula(formula, flourMass);   
    updateIngredients(adjustedIngredients);
  }

  return(
    <>
      <h2>Ingredients</h2>
      <NumberInput 
        label={`Pre-Ferment (${unit})`}
        id={'pre-ferment'}
        value={levainMass}
        updateValue={(n) => adjustIngredients(n, formula.levainPercent)}
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput 
        label={`Water (${unit})`}
        id={'water'}
        value={waterMass}
        updateValue={(n) => adjustIngredients(n, formula.hydrationPercent)}
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput 
        label={`Salt (${unit})`}
        id={'salt'}
        value={saltMass}
        updateValue={(n) => adjustIngredients(n, formula.saltPercent)}
        enforceBounds
        precision={2}
        min={0}
      />
      <NumberInput 
        label={`Flour (${unit})`}
        id={'flour'}
        value={flourMass}
        updateValue={(n) => adjustIngredients(n, 100)}
        enforceBounds
        precision={2}
        min={0}
      />
    </>
  )
}
