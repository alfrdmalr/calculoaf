import React, { useCallback, useMemo } from 'react';
import { getReagentLabel, Reagent, ReagentType } from '../../types/reagent';
import {Ingredients, validateIngredients} from '../../types/ingredients';
import { Nullable } from '../../types/nullable';
import styles from './totals.module.css'

export interface TotalIngredientsProps {
  ingredients: Nullable<Ingredients>;
}

export const TotalIngredients = (props: TotalIngredientsProps) => {
  const {ingredients} = props;

  const {
    levainMass,
    flourMass,
    waterMass,
    saltMass,
  } = ingredients;

  //todo
  const unit: string = "g";

  const totalDoughMass = useMemo(() => {
    if (validateIngredients(ingredients)) {
      return (0
        + ingredients.levainMass
        + ingredients.flourMass
        + ingredients.saltMass
        + ingredients.waterMass
      );
    } else {
      return null;
    }

  }, [ingredients])

  return(
    <div className={styles.container}>
      <h2>Total Ingredients</h2>
      <table className={styles.table}> 
        <tbody>
          <tr>
            <th>Ingredient Name</th> 
            <th>Mass ({unit})</th> 
          </tr>

          <tr>
            <td>{getReagentLabel('flourMass')}</td>
            <td>
              {flourMass?.toFixed(2)}
            </td>
          </tr>
           
          <tr>
            <td>{getReagentLabel('waterMass')}</td>
            <td>{waterMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>{getReagentLabel('levainMass')}</td>
            <td>{levainMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>{getReagentLabel('saltMass')}</td>
            <td>{saltMass?.toFixed(2)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total Dough</td>
            <td>{totalDoughMass?.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

