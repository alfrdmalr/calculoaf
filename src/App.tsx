import React, { useCallback, useEffect, useState } from "react";
import { FormulaForm } from "./components/formulaForm";
import styles from "./app.module.css";
import { Formula, validateFormula } from "./types/formula";
import {
  emptyIngredients,
  Ingredients,
  validateIngredients,
} from "./types/ingredients";
import { Nullable } from "./types/nullable";
import { TotalIngredients } from "./components/totalIngredients";
import { IngredientsForm } from "./components/ingredientsForm";
import { applyFormula, applyFormulaTDM } from "./functions/applyFormula";
import { getTotalDoughMass } from "./functions/getTotalMass";

const unit: string = "g";

export const App = () => {
  const [formula, setFormula] = useState<Nullable<Formula>>({
    hydrationPercent: 80,
    levainPercent: 25,
    saltPercent: 2,
    mixins: [],
  });
  const [ingredients, setIngredients] = useState<Nullable<Ingredients>>(
    emptyIngredients(formula)
  );

  const updateFormula = useCallback(
    (formula: Nullable<Formula>) => {
      setFormula(formula);
      // make sure ingredients schema matches formula
      setIngredients(emptyIngredients(formula));

      if (!validateFormula(formula) || !validateIngredients(ingredients)) {
        return;
      }

      // TODO using dough mass, but should allow user to hold an arbitrary
      // ingredient constant
      const doughMass = getTotalDoughMass(ingredients);
      if (doughMass !== null) {
        setIngredients(applyFormulaTDM(formula, doughMass));
      }
    },
    [ingredients, setIngredients]
  );

  return (
    <div className={styles.main}>
      <h1>Calculoaf</h1>
      <p>
        A simple tool for adjusting bread formulas based on ingredient
        measurements, or vice versa.
      </p>

      <div className={styles.forms}>
        <div className={styles.formContainer}>
          <IngredientsForm
            formula={formula}
            ingredients={ingredients}
            updateIngredients={setIngredients}
          />
        </div>
        <div className={styles.formContainer}>
          <FormulaForm updateFormula={updateFormula} formula={formula} />
        </div>
      </div>
      <div className={styles.formContainer}>
        <TotalIngredients ingredients={ingredients} />
      </div>
    </div>
  );
};
