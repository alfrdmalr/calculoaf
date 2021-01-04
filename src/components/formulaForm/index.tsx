import React from 'react';
import {Formula} from '../../types/formula';
import {NumberInput} from '../numberInput';

export interface FormulaFormProps {
  formula: Formula;
  updateFormula: (f: Formula) => void;
}

export const FormulaForm = (props: FormulaFormProps) => {
  const {updateFormula, formula} = props;
  const {hydrationPercent, preFermentPercent, saltPercent} = formula;
  const updatePartial = (part: Partial<Formula>) => {
    updateFormula({
      ...formula,
      ...part
    });
  }
  const unit = '%';

  return(
    <>
      <h2>Formula</h2>
      <NumberInput 
        label={`Pre-Ferment (${unit})`}
        id={'pre-ferment-formula'}
        value={preFermentPercent}
        updateValue={n => updatePartial({preFermentPercent: n})}
        required
        enforceBounds
        min={0}
        max={100}
      />
      <NumberInput 
        label={`Hydration (${unit})`}
        id={'hydration'}
        value={hydrationPercent}
        updateValue={n => updatePartial({hydrationPercent: n})}
        required
        enforceBounds
        min={0}
        max={100}
      />
      <NumberInput 
        label={`Salt (${unit})`}
        id={'salt'}
        value={saltPercent}
        updateValue={n => updatePartial({saltPercent: n})}
        required
        enforceBounds
        min={0}
        max={100}
      />
    </>
  )
}
