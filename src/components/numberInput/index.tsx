import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Numberish, isValid } from "../../types/numberish";
import styles from "./numberInput.module.css";

export interface NumberInputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "value"
  > {
  value: Numberish;
  setValue: (value: Numberish) => void;
  label: string | JSX.Element;
  id: string;
  disabled?: boolean;
  required?: boolean;
  precision?: number;
  min?: number;
  max?: number;
  enforceBounds?: boolean;
  allowNegative?: boolean;
}

export const NumberInput = (props: NumberInputProps) => {
  const {
    id,
    value,
    setValue,
    label,
    precision,
    required,
    enforceBounds,
    min,
    max,
    allowNegative,
    ...rest
  } = props;

  const [displayValue, setDisplayValue] = useState<string>("");
  const [internalValue, setInternalValue] = useState<Numberish>(null);
  const [error, setError] = useState<boolean>(false);

  const pattern = useMemo(() => {
    return RegExp(`^${allowNegative ? "-?" : ""}[0-9]*[\.,]?[0-9]*$`);
  }, [allowNegative]);

  const isValidFormat = useCallback(
    (s: string) => {
      return pattern.test(s);
    },
    [pattern]
  );

  const updateInternalValue = useCallback(
    (n: Numberish) => {
      if (!isValid(n)) {
        setInternalValue(n);
        return;
      }
      if (max != null && n > max) {
        if (enforceBounds) {
          setInternalValue(max);
        } else {
          setError(true);
        }
        return;
      }

      if (min != null && n < min) {
        if (enforceBounds) {
          setInternalValue(min);
        } else {
          setError(true);
        }
        return;
      }

      setInternalValue(n);
    },
    [enforceBounds, min, max]
  );

  // handle valid input strings
  const onDisplayChange = useCallback(
    (input: string) => {
      setDisplayValue(input);
      if (input === "") {
        setInternalValue(null);
      } else {
        const n: number = parseFloat(input);
        if (n !== internalValue) {
          updateInternalValue(n);
        }
      }
    },
    [internalValue]
  );

  // handle raw changes to the component
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val: string = e.target.value;
      if (isValidFormat(val)) {
        onDisplayChange(val);
      }
    },
    [isValidFormat, displayValue]
  );

  // update prop.value on blur; should trigger format indirectly via effect
  const onBlur = useCallback(() => {
    setValue(internalValue);
  }, [setValue, internalValue]);

  // formatting callback; if 'live' updating, can't do ToFixed
  const getDisplayValue = useCallback(
    (n: Numberish) => {
      if (n === null) {
        return "";
      } else if (isNaN(n)) {
        return displayValue;
      } else {
        return n.toFixed(precision);
      }
    },
    [displayValue]
  );

  const handleError = useCallback(
    (value: Numberish) => {
      if (value === null) {
        setError(!!required);
      } else if (isNaN(value)) {
        setError(true);
      } else {
        setError(false);
      }
    },
    [required]
  );

  // format and adjust ground truth whenever we receieve an updated prop value
  useEffect(() => {
    setDisplayValue(getDisplayValue(value));
    updateInternalValue(value);

    handleError(value);
  }, [value]);

  return (
    <div className={styles.container}>
      <label htmlFor={id}>{label}</label>
      <input
        {...rest}
        required={required}
        type="text"
        className={error ? styles.error : ""}
        inputMode="numeric"
        pattern={pattern.toString()}
        onChange={onInputChange}
        onBlur={onBlur}
        value={displayValue}
        aria-describedby={`${id}-error`}
      />
    </div>
  );
};
