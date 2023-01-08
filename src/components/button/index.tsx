import React, { ReactNode } from "react";
import styles from "./button.module.css";

export interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { children, onClick, disabled } = props;

  return (
    <button className={styles.button} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
