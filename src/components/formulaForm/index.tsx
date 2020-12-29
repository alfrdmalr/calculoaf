import React, {useState} from 'react';
import {Formula} from '../../types/formula';
import {NumberInput} from '../numberInput';

export interface FormulaFormProps extends Formula {
  updateFormula: (f: Formula) => void;
}

export const FormulaForm = (props: FormulaFormProps) => {
  const {hydrationPercent, preFermentPercent, saltPercent, updateFormula} = props;
  const updatePartial = (part: Partial<Formula>) => {
    updateFormula({
      hydrationPercent,
      preFermentPercent,
      saltPercent,
      ...part
    });
  }

  return(
    <>
      <h2>Formula</h2>
      <NumberInput 
        label={'Pre-Ferment (%)'}
        id={'pre-ferment-formula'}
        value={preFermentPercent}
        updateValue={n => updatePartial({preFermentPercent: parseFloat(n)})}
        cannotBeEmpty
        enforceBounds
        min={0}
        max={100}
      />
      <NumberInput 
        label={"Hydration (%)"}
        id={'hydration'}
        value={hydrationPercent}
        updateValue={n => updatePartial({hydrationPercent: parseFloat(n)})}
        cannotBeEmpty
        enforceBounds
        min={0}
        max={100}
      />
      <NumberInput 
        label={'Salt (%)'}
        id={'salt'}
        value={saltPercent}
        updateValue={n => updatePartial({saltPercent: parseFloat(n)})}
        cannotBeEmpty
        enforceBounds
        min={0}
        max={100}
      />
      <button onClick={() => {
        updatePartial({
          hydrationPercent: undefined, 
          preFermentPercent: undefined,
          saltPercent: undefined
        });
      }}
      > 
        clear
      </button>
    </>
  )
}
