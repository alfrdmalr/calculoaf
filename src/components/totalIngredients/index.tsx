import React, { useMemo } from "react";
import { getReagentLabel } from "../../types/reagent";
import { Ingredients, validateIngredients } from "../../types/ingredients";
import { Nullable } from "../../types/nullable";
import { Numberish } from "../../types/numberish";
import styles from "./totals.module.css";
import { getTotalDoughMass } from "../../functions/getTotalMass";

export interface TotalIngredientsProps {
  ingredients: Nullable<Ingredients>;
}

export const TotalIngredients = (props: TotalIngredientsProps) => {
  const { ingredients } = props;

  const { levainMass, flourMass, waterMass, saltMass } = ingredients;

  //todo
  const unit: string = "g";

  const totalDoughMass: Numberish = useMemo(() => {
    return getTotalDoughMass(ingredients);
  }, [ingredients]);

  return (
    <div className={styles.container}>
      <h2>Ingredient Totals</h2>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Ingredient Name</th>
            <th>Mass ({unit})</th>
          </tr>

          <tr>
            <td>{getReagentLabel("flourMass")}</td>
            <td>{flourMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>{getReagentLabel("waterMass")}</td>
            <td>{waterMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>{getReagentLabel("levainMass")}</td>
            <td>{levainMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>{getReagentLabel("saltMass")}</td>
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
  );
};
