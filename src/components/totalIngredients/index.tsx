import React from 'react';
import {Ingredients} from '../../types/ingredients';
import styles from './totals.module.css'

export interface TotalIngredientsProps {
  ingredients: Ingredients;
}

export const TotalIngredients = (props: TotalIngredientsProps) => {
  const {preFermentMass, flourMass, waterMass, saltMass} = props.ingredients;

  //todo
  const unit: string = "g";

  return(
    <>
      <h2>Total Ingredients</h2>
      <div className={styles.row}>
        <span>Flour</span>
        <span>300g</span>
      </div>
      <div className={styles.row}>
        <span>Water</span>
        <span>900g</span>
      </div>
    </>
  )
}

