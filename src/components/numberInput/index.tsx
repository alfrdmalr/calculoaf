import React from 'react';

export interface NumberInputProps {
  label: string;
  id: string;
  value: number | undefined;
  updateValue: (v: number | undefined) => void;
  min?: number;
  max?: number;
}

export const NumberInput = (props: NumberInputProps) => {
  const {label, id, value, updateValue, min, max} = props;

  const ensureNumber = (s: string): void => {
    let re = /^[0-9]*\.?[0-9]*$/;
    if (re.test(s)) {
      updateValue(parseFloat(s))
    }
  }

  const val = value === undefined ? "" : value;

  return(
    <>
      <label htmlFor={id}>
        {label}
      </label>
      <input 
        min={min}
        max={max}
        type='text' 
        value={val} 
        onChange={e => ensureNumber(e.target.value)}
      />
    </>
  )
}
