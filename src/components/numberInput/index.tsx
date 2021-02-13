import React, {useEffect, useState} from 'react';
import styles from './numberInput.module.css';

export interface ValidatorPayload {
  input: number;
  errorMsg?: string;
  allowContinue?: boolean;
}

export interface NumberInputProps {
  label: string;
  id: string;
  value: number | undefined;
  disabled?: boolean;
  updateValue: (n: number | undefined) => void;
  customValidator?: (input: string) => ValidatorPayload;
  required?: boolean;
  disableInputMask?: boolean;
  precision?: number;
  min?: number;
  max?: number;
  enforceBounds?: boolean;
}

export const NumberInput = (props: NumberInputProps) => {
  const {label, id, value, updateValue, min, max,
    enforceBounds, required, disableInputMask, precision,
    customValidator, disabled } = props;
  const [val, setVal] = useState<string>("");
  const [error, setError] = useState<{state: boolean, msg?: string}>({state: false});

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

  const handleEmpty = () => {
    updateValue(undefined);
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

  const handleNaN = () => {
    setError({
      state: true,
      msg: "Invalid number"
    });
    return;
  }

  const updateNumber = (n: number) => {
    let updateNum = n;
    let updateStr = n.toString();

    if (precision) {
      updateStr = n.toFixed(precision);
      updateNum = parseFloat(updateStr);
    }

    setVal(updateStr);
    updateValue(updateNum);
  }

  const handleMin = (minNum: number) => {
    if (enforceBounds) {
      updateNumber(minNum);
      setError({state: false});
      return;
    }
    setError({
      state: true,
      msg: `Value must not be less than ${minNum}.` 
    })
    return;
  }
  
  const handleMax = (maxNum: number) => {
    if (enforceBounds) {
      updateValue(max);
      setVal(maxNum.toString());
      setError({state: false});
      return;
    }
    setError({
      state: true,
      msg: `Value must not be greater than ${maxNum}.`
    })
    return;
  }

  const handleCustom = (v: ValidatorPayload): boolean => {
    const {input, errorMsg, allowContinue}: ValidatorPayload = v;

    updateNumber(input);

    if (errorMsg) {
      setError({
        state: true,
        msg: errorMsg
      });
    }

    if (!allowContinue) {
      return false;  
    }

    return true;
  }

  // runs on blur
  const validateInput = (s: string) => {
    // empty case
    if (s === "") {
      handleEmpty();
      return;
    }

    if (customValidator) {
      const keepValidating = handleCustom(customValidator(s));
      if (!keepValidating) {
        return;
      }
    }
    
    const parsedVal = parseFloat(s);

    // doesn't parse to a number
    if (isNaN(parsedVal)) {
      handleNaN();
      return;
    }
    
    if (min !== undefined && parsedVal < min) {
      handleMin(min);
      return;
    }

    if (max !== undefined && parsedVal > max) {
      handleMax(max);
      return;
    }

    updateNumber(parsedVal);
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
    <div className={styles.container}>
      <label htmlFor={id}>
        {label}
      </label>
      {error.state &&
        <p 
          id={`${id}-error`}
          className={styles.errorMsg}
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
        disabled={disabled}
        onChange={e => onInputChange(e.currentTarget.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (disableInputMask) {
            return;
          }
          if (val !== "NaN") {
            return;
          }
          // using 'nativeEvent.code' because react's syntheticevent does not
          // yet have the 'code' property
          if (e.nativeEvent.code === "Backspace" || e.nativeEvent.code === "Delete") {
            //special case, treat "NaN" as single character
            setVal("");
          }
        }}
        onBlur={() => validateInput(val)}
        required={required}
        aria-describedby={`${id}-error`}
      />
    </div>
  )
}
