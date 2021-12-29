import React, { useCallback, useEffect, useState } from 'react';
import {Formula} from '../../types/formula';
import { Inclusion } from '../../types/inclusion';
import { Numberish } from '../../types/numberish';
import {NumberInput} from '../numberInput';

export interface FormulaFormProps {
  formula: Formula;
  updateFormula: (f: Formula | ((f: Formula) => Formula)) => void;
}

export const FormulaForm = (props: FormulaFormProps) => {
  const {updateFormula, formula} = props;
  const {hydrationPercent, levainPercent, saltPercent} = formula;

  const updateFormulaParameter = useCallback((key: keyof Formula, n: Numberish) => {
    const f: Formula = {
      ...formula,
      [key]: n
    };

    updateFormula(f);
  }, [formula, updateFormula]);

  const updateInclusion = useCallback((id: number, n: Numberish) => {
    const f: Formula = {
      ...formula,
      inclusions: formula.inclusions.map((i: Inclusion) => {
        if (i.id === id) {
          return {
            ...i,
            value: n
          }
        } else {
          return i;
        }
      })
    };
    updateFormula(f);
  }, [formula, updateFormula]);

  const unit = '%';

  return(
    <>
      <h2>Formula</h2>
      <NumberInput 
        label={`Pre-Ferment (${unit})`}
        id={'pre-ferment-formula'}
        value={levainPercent}
        setValue={n => updateFormulaParameter('levainPercent', n)}
        required
        enforceBounds
        min={0}
        max={100}
        precision={2}
      />
      <NumberInput 
        label={`Hydration (${unit})`}
        id={'hydration'}
        value={hydrationPercent}
        setValue={n => updateFormulaParameter('hydrationPercent', n)}
        required
        enforceBounds
        min={0}
        max={100}
        precision={2}
      />
      <NumberInput 
        label={`Salt (${unit})`}
        id={'salt'}
        value={saltPercent}
        setValue={n => updateFormulaParameter('saltPercent', n)}
        required
        enforceBounds
        min={0}
        max={100}
        precision={2}
      />
      <NumberInput 
        label={`Flour (${unit})`}
        id={'flour'}
        value={100}
        setValue={() => {}}
        disabled
        required
        enforceBounds
        min={0}
        max={100}
        precision={2}
      />
      
      {formula?.inclusions?.map(e => (
        <NumberInput 
          label={`${e.name} (%)`}
          //label={
            //<TextInput
              //label=""
              //id={`${e.id}-label`}
              //value={'test'}
              //onChange={() => console.log('test')}
              ///>
          //}
          id={`inclusion-${e.id}`}
          key={e.id}
          value={e.value}
          setValue={n => updateInclusion(e.id, n)}
          required
          enforceBounds
          precision={2}
          min={0}
          max={100}
        />
      ))}
    </>
  );
}
