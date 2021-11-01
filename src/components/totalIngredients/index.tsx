import React from 'react';
import {Ingredients} from '../../types/ingredients';
import { Nullable } from '../../types/nullable';
import styles from './totals.module.css'

export interface TotalIngredientsProps {
  ingredients: Nullable<Ingredients>;
}

export const TotalIngredients = (props: TotalIngredientsProps) => {
  const {levainMass, flourMass, waterMass, saltMass} = props.ingredients;

  //todo
  const unit: string = "g";

  return(
    <div className={styles.container}>
      <h2>Total Ingredients</h2>
      <table className={styles.table}> 
        <tbody>
          <tr>
            <th></th>
            <th>Ingredient Name</th> 
            <th>Mass ({unit})</th> 
          </tr>

          <tr>
            <td>
              <button>
                <span className="fas fa-star" />
              </button>
            </td>
            <td>Flour</td>
            <td>{flourMass?.toFixed(2)}</td>
          </tr>
           
          <tr>
            <td>
              <button>
                <span className="fas fa-star" />
              </button>
            </td>
            <td>Water</td>
            <td>{waterMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>
              <button>
                <span className="fas fa-star" />
              </button>
            </td>
            <td>Preferment</td>
            <td>{levainMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>
              <button>
                <span className="fas fa-star" />
              </button>
            </td>
            <td>Salt</td>
            <td>{saltMass?.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

