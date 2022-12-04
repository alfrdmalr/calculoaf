import React from "react";

export interface TextInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (s: string) => void;
}

export const TextInput = (props: TextInputProps) => {
  const { label, id, value, onChange } = props;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};
