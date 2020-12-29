import React from 'react';
import {Ingredients} from '../../types/ingredients';
import {NumberInput} from '../numberInput';

export interface IngredientsFormProps extends Ingredients {
  updateIngredients: (f: Ingredients) => void;
}

export const IngredientsForm = (props: IngredientsFormProps) => {
  const {updateIngredients, preFermentMass, flourMass, waterMass, saltMass} = props;

  const updatePartial = (part: Partial<Ingredients>) => {
    updateIngredients({
      preFermentMass,
      flourMass,
      waterMass,
      saltMass,
      ...part
    });
  }

  //todo
  const unit: string = "g";

  return(
    <>
      <h2>Ingredients</h2>
      <NumberInput 
        label={`Pre-Ferment (${unit})`}
        id={'pre-ferment'}
        value={preFermentMass}
        updateValue={n => updatePartial({preFermentMass: parseFloat(n)})}
        enforceBounds
        min={0}
      />
      <NumberInput 
        label={`Water (${unit})`}
        id={'water'}
        value={waterMass}
        updateValue={n => updatePartial({waterMass: parseFloat(n)})}
        enforceBounds
        min={0}
      />
      <NumberInput 
        label={`Salt (${unit})`}
        id={'salt'}
        value={saltMass}
        updateValue={n => updatePartial({saltMass: parseFloat(n)})}
        enforceBounds
        min={0}
      />
      <NumberInput 
        label={`Flour (${unit})`}
        id={'flour'}
        value={flourMass}
        updateValue={n => updatePartial({flourMass: parseFloat(n)})}
        enforceBounds
        min={0}
      />
    </>
  )
}
