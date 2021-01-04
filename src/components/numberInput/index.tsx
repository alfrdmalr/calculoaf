import React, {useEffect, useState} from 'react';
import {parseString} from '../../functions/parseString';
import './numberInput.module.css';

export interface NumberInputProps {
  label: string;
  id: string;
  value: number | undefined;
  updateValue: (n: number | undefined) => void;
  cannotBeEmpty?: boolean;
  required?: boolean;
  disableInputMask?: boolean;
  precision?: number;
  min?: number;
  max?: number;
  enforceBounds?: boolean;
  step?: number;
}

// more flexible, uses string
export const NumberInput = (props: NumberInputProps) => {
  const {label, id, value, updateValue, min, max, cannotBeEmpty, 
    step, enforceBounds, required, disableInputMask, precision} = props;
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
    if (disableInputMask) {
      setVal(s);
      return;
    }
    setVal(maskInput(s));
  }

  // runs on blur
  const validateInput = (s: string) => {
    setError({ state: false});
    updateValue(parseString(s));

    // empty case
    if (s === "") {
      if (required) {
        setError({
          state: true,
          msg: "Field must not be empty"
        });
        return;
      } 
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
      });
      return;
    }

    if (min !== undefined && parsedVal < min) {
      console.log('less than min')
      if (enforceBounds) {
        updateValue(min);
        setVal(min.toString());
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
        setVal(max.toString());
        setError({state: false});
        return;
      }
      setError({
        state: true,
        msg: `Value must not be greater than ${max}.`
      })
      return;
    }
  }

  useEffect(() => {
    if (value === undefined) {
      setVal("");
      validateInput("");
      return;
    }
    setVal(value.toString());
    validateInput(value.toString());
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
        pattern={"(^-?[0-9]+[\.,]?[0-9]*$)|(^-?[0-9]*[\.,]?[0-9]+$)"}
        value={val} 
        max={max}
        min={min}
        step={step || 0.1}
        onChange={e => onInputChange(e.currentTarget.value)}
        onKeyDown={(e: React.KeyboardEvent) => {
          // if (disableMask) {
          //    return;
          // }
          if (val !== "NaN") {
            return;
          }

          if (e.code === "Backspace" || e.code === "Delete") {
            //special case, treat "NaN" as single character
            setVal("");
          }
        }}
        onBlur={() => validateInput(val)}
        required={required}
        aria-describedby={`${id}-error`}
      />
    </>
  )
}
