import React, {useState} from 'react';
import {Formula} from '../../types/formula';
import {NumberInput} from '../numberInput';

export interface FormulaFormProps extends Formula {}

export const FormulaForm = (props: FormulaFormProps) => {
  const {hydrationPercent, levainPercent, saltPercent} = props;
  const [hydration, setHydration] = useState<number | undefined>()
  const [mass, setMass] = useState<number | undefined>()
  const [preFerment, setPreFerment] = useState<number | undefined>()
  const [salt, setSalt] = useState<number | undefined>()

  return(
    <>
      <h2>Formula</h2>
      <NumberInput 
        label={"Hydration (%)"}
        id={'hydration'}
        value={hydration}
        updateValue={n => setHydration(n)}
        min={0}
        max={100}
      />
      <NumberInput 
        label={'Pre-Ferment (%)'}
        id={'pre-ferment-formula'}
        value={preFerment}
        updateValue={n => setPreFerment(n)}
        min={0}
        max={100}
      />
      <NumberInput 
        label={'Salt (%)'}
        id={'salt'}
        value={salt}
        updateValue={n => setSalt(n)}
        min={0}
        max={100}
      />
    </>
  )
}
