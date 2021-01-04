import React from 'react';
import {applyFormula, getFlourMass} from '../../functions/applyFormula';
import {Formula} from '../../types/formula';
import {Ingredients} from '../../types/ingredients';
import {NumberInput} from '../numberInput';

export interface IngredientsFormProps {
  ingredients: Ingredients
  updateIngredients: (i: Ingredients) => void;
  formula: Formula;
}

export const IngredientsForm = (props: IngredientsFormProps) => {
  const {updateIngredients, ingredients, formula } = props;
  const { preFermentMass, flourMass, waterMass, saltMass } = ingredients;

  //todo
  const unit: string = "g";

  const adjustIngredients = (n: string, ingredientPercent: number): void => {
    if (n === "") {
      updateIngredients({})
      return;
    }
    const val = parseFloat(n);
    if (isNaN(val)) {
      //todo ERROR
      return;
    }

    const flourMass: number = getFlourMass(val, ingredientPercent);
    const adjustedIngredients: Ingredients = applyFormula(formula, flourMass);   
    updateIngredients(adjustedIngredients);
  }

  return(
    <>
      <h2>Total Ingredients</h2>
      <NumberInput 
        label={`Pre-Ferment (${unit})`}
        id={'pre-ferment'}
        value={preFermentMass}
        updateValue={(n) => adjustIngredients(n, formula.preFermentPercent)}
        enforceBounds
        min={0}
      />
      <NumberInput 
        label={`Water (${unit})`}
        id={'water'}
        value={waterMass}
        updateValue={(n) => adjustIngredients(n, formula.hydrationPercent)}
        enforceBounds
        min={0}
      />
      <NumberInput 
        label={`Salt (${unit})`}
        id={'salt'}
        value={saltMass}
        updateValue={(n) => adjustIngredients(n, formula.saltPercent)}
        enforceBounds
        min={0}
      />
      <NumberInput 
        label={`Flour (${unit})`}
        id={'flour'}
        value={flourMass}
        updateValue={(n) => adjustIngredients(n, 100)}
        enforceBounds
        min={0}
      />
    </>
  )
}
