import React, {useEffect, useState} from 'react';
import './numberInput.module.css';

export interface NumberInputProps {
  label: string;
  id: string;
  value: string | number | undefined;
  // undefined for empty; number (including NaN) for all other. Need to check
  // for NaN 
  updateValue: (s: string) => void;
  disableInputMask?: boolean;
  liveUpdate?: boolean;
  cannotBeEmpty?: boolean;
  min?: number;
  max?: number;
  enforceBounds?: boolean;
  step?: number;
}

export const NumberInput = (props: NumberInputProps) => {
  const {label, id, value, updateValue, min, max, cannotBeEmpty, 
    step, disableInputMask, liveUpdate, enforceBounds} = props;
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
    let newVal = s;
    if (!disableInputMask) {
      newVal = maskInput(s);
    }
    setVal(newVal);

    if (liveUpdate) {
      updateValue(newVal);
    }
  }

  // onblur handler
  const validateInput = (s: string) => {
    if (s === "") {
      if (cannotBeEmpty) {
        setError({
          state: true,
          msg: "Field must not be empty"
        });
        return;
      } 
      setError({state: false});
      return;
    }

    updateValue(s);

    const parsedVal = parseFloat(s);
    // doesn't parse to a number
    if (isNaN(parsedVal)) {
      setError({
        state: true,
        msg: "Invalid number"
      })
      return;
    }

    if (min !== undefined && parsedVal < min) {
      if (enforceBounds) {
        const minString = min.toString();
        setVal(minString);
        updateValue(minString);
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
        const maxString = max.toString();
        setVal(maxString);
        updateValue(maxString);
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
