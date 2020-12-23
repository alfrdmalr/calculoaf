import React, {useState} from 'react';
import {NumberInput} from '../numberInput';

export interface IngredientsFormProps {}

export const IngredientsForm = (props: IngredientsFormProps) => {
  const [preFerment, setPreFerment] = useState<number | undefined>()
  const [flour, setFlour] = useState<number | undefined>()
  const [water, setWater] = useState<number | undefined>()
  const [salt, setSalt] = useState<number | undefined>()

  return(
    <>
      <h2>Ingredients</h2>
      <NumberInput 
        label={'Pre-Ferment (levain/starter)'}
        id={'pre-ferment'}
        value={preFerment}
        updateValue={n => setPreFerment(n)}
      />
      <NumberInput 
        label={'Flour'}
        id={'flour'}
        value={flour}
        updateValue={n => setFlour(n)}
      />
      <NumberInput 
        label={'Water'}
        id={'water'}
        value={water}
        updateValue={n => setWater(n)}
      />
      <NumberInput 
        label={'Salt'}
        id={'salt'}
        value={salt}
        updateValue={n => setSalt(n)}
      />
    </>
  )
}
