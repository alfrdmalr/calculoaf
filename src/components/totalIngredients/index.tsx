import React, { useCallback, useMemo } from "react";
import { getReagentLabel, Reagent, ReagentType } from "../../types/reagent";
import { Ingredients, validateIngredients } from "../../types/ingredients";
import { Nullable } from "../../types/nullable";
import { Numberish } from "../../types/numberish";
import styles from "./totals.module.css";
import { Button } from "../button";

export interface TotalIngredientsProps {
  ingredients: Nullable<Ingredients>;
  setLimitingReagent: (r: Reagent) => void;
  limitingReagent: ReagentType;
}

export const TotalIngredients = (props: TotalIngredientsProps) => {
  const { setLimitingReagent, limitingReagent, ingredients } = props;

  const { levainMass, flourMass, waterMass, saltMass } = ingredients;

  //todo
  const unit: string = "g";

  const reagentButton = useCallback(
    (key: ReagentType, value: Numberish) => {
      return null;
      return (
        <Button
          disabled={limitingReagent === key}
          onClick={() => setLimitingReagent({ key: key, value: value })}
        >
          <span className="fas fa-star" />
        </Button>
      );
    },
    [limitingReagent, setLimitingReagent]
  );

  const totalDoughMass = useMemo(() => {
    if (validateIngredients(ingredients)) {
      return (
        0 +
        ingredients.levainMass +
        ingredients.flourMass +
        ingredients.saltMass +
        ingredients.waterMass
      );
    } else {
      return null;
    }
  }, [ingredients]);

  return (
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
            <td>{reagentButton("flourMass", flourMass)}</td>
            <td>{getReagentLabel("flourMass")}</td>
            <td>{flourMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>{reagentButton("waterMass", waterMass)}</td>
            <td>{getReagentLabel("waterMass")}</td>
            <td>{waterMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>{reagentButton("levainMass", levainMass)}</td>
            <td>{getReagentLabel("levainMass")}</td>
            <td>{levainMass?.toFixed(2)}</td>
          </tr>

          <tr>
            <td>{reagentButton("saltMass", saltMass)}</td>
            <td>{getReagentLabel("saltMass")}</td>
            <td>{saltMass?.toFixed(2)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>{reagentButton("totalDoughMass", totalDoughMass)}</td>
            <td>Total Dough</td>
            <td>{totalDoughMass?.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
