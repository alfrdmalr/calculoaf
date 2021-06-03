import React from 'react';
import {applyFormula, getFlourMass} from '../../functions/applyFormula';
import {Formula} from '../../types/formula';
import {NumberInput} from '../numberInput';

export interface IngredientsFormProps {
  totalDoughMass: number;
  setTotalDoughMass: (n: number) => void;
  formula: Formula;
}

export const IngredientsForm = (props: IngredientsFormProps) => {
  const {setTotalDoughMass, totalDoughMass, formula } = props;
  const { levainPercent, hydrationPercent, saltPercent } = formula;
  const waterPercent = hydrationPercent - 

  //todo
  const unit: string = "g";

  const adjin = (n: number | undefined, ingredientPercent: number): void => {
    if (n === undefined) {
      updateIngredients({})
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

  const levainMass: number = totalDoughMass * levainPercent;
  const saltMass: number = totalDoughMass * saltPercent;

  let levainHydration: number = 100;

  const waterPercent = hydrationPercent - waterFromLevain(levainHydration, percentLevain);


  return(
    <>
      <h2>Ingredients</h2>
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

function waterFromLevain(levainHydration: number, percentLevain: number) {
  const ratio: number = levainHydration / (levainHydration + 100); //total levain ingredients
  return percentLevain * ratio;
} 
