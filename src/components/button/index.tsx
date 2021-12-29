import React from 'react';

export interface ButtonProps {
  children: string | JSX.Element;
  onClick: () => void;
  disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {onClick, disabled} = props;

  return(
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {props.children}
    </button>
  )
}
