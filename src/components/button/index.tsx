import React from 'react';

export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {label, onClick, disabled} = props;

  return(
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
