import React, {useEffect, useState} from 'react';
import {parseString} from '../../functions/parseString';
import './numberInput.module.css';

export interface NumberInputProps {
  label: string;
  id: string;
  value: number | undefined;
  // undefined for empty; number (including NaN) for all other.
  updateValue: (n: number | undefined) => void;
  cannotBeEmpty?: boolean;
  min?: number;
  max?: number;
  enforceBounds?: boolean;
  step?: number;
}

// more flexible, uses string
export const NumberInput = (props: NumberInputProps) => {
  const {label, id, value, updateValue, min, max, cannotBeEmpty, 
    step, enforceBounds} = props;
  const [val, setVal] = useState<string>("");
  const [error, setError] = useState<{state: boolean, msg?: string}>({state: false});

  // onchange/input handler
  const maskInput = (s: string): string => {
    let re = /^-?[0-9]*[\.,]?[0-9]*$/;
    if (re.test(s)) {
      return s;
    }
    return val;
  }

  const onInputChange = (s: string): void => {
    setVal(maskInput(s));
  }

  // runs on blur
  const validateInput = (s: string) => {
    // empty case
    if (s === "") {
      if (cannotBeEmpty) {
        setError({
          state: true,
          msg: "Field must not be empty"
        });
        return;
      } 
      updateValue(undefined);
      setError({state: false});
      return;
    }

    //let re = /-?^[0-9]*[\.,]?[0-9]+$/; regex for valid number
    const parsedVal = parseFloat(s);
    // doesn't parse to a number
    if (isNaN(parsedVal)) {
      setError({
        state: true,
        msg: "Invalid number"
      })
      updateValue(undefined);
      return;
    }

    updateValue(parseString(s));

    if (min !== undefined && parsedVal < min) {
      if (enforceBounds) {
        updateValue(min);
        setError({state: false});
        return;
      }
      setError({
        state: true,
        msg: `Value must not be less than ${min}.` 
      })
      return;
    }

    if (max !== undefined && parsedVal > max) {
      if (enforceBounds) {
        updateValue(max);
        setError({state: false});
        return;
      }
      setError({
        state: true,
        msg: `Value must not be greater than ${max}.`
      })
      return;
    }

    setError({ state: false});
  }

  useEffect(() => {
    if (value === undefined) {
      setVal("");
      return;
    }

    validateInput(value.toString());
    setVal(value.toString());
  }, [value])

  return(
    <>
      <label htmlFor={id}>
        {label}
      </label>
      {error.state &&
        <p 
          id={`${id}-error`}
          className={'errorMsg'}
        >
          {error.msg}
        </p>
      }
      <input 
        id={id}
        inputMode={'numeric'}
        type='tel' 
        pattern={"^-?[0-9]+[\.,]?[0-9]*$"}
        value={val} 
        max={max}
        min={min}
        step={step || 0.1}
        onChange={e => onInputChange(e.currentTarget.value)}
        onBlur={() => validateInput(val)}
        required={cannotBeEmpty}
        aria-describedby={`${id}-error`}
      />
    </>
  )
}
