import React, {useCallback, useEffect, useState} from 'react';
import {FormulaForm} from './components/formulaForm';
import {IngredientsForm} from './components/ingredientsForm';
import styles from "./app.module.css";
import {Formula, validateFormula} from './types/formula';
import {emptyIngredients, Ingredients, validateIngredients} from './types/ingredients';
import {NumberInput} from './components/numberInput';
import {applyFormulaTDM} from './functions/applyFormula';
import { Nullable } from './types/nullable';
import { isValid, Numberish } from './types/numberish';
import { TotalIngredients } from './components/totalIngredients';

if (module.hot) {
  module.hot.accept();
}

export const App = () => {
  const [totalDoughMass, setTotalDoughMass] = useState<Numberish>(null);
  const [ingredients, setIngredients] = useState<Nullable<Ingredients>>(emptyIngredients());
  const [formula, setFormula] = useState<Nullable<Formula>>({
    hydrationPercent: 80,
    levainPercent: 25,
    saltPercent: 2
  });

  const updateIngredients = useCallback((i: Nullable<Ingredients>) => {
    // needs to be already adjusted 
    setIngredients(i);
    if (validateIngredients(i)) {
      const newTDM = i.saltMass + i.flourMass + i.waterMass + i.levainMass;
      setTotalDoughMass(newTDM);
    } else {
      setTotalDoughMass(null);
    }
  }, [validateIngredients]);

  useEffect(() => {
    if (!validateFormula(formula) || 
      !isValid(totalDoughMass)) {
      setIngredients(emptyIngredients());
    } else {
      setIngredients(applyFormulaTDM(formula, totalDoughMass));
    }
  }, [formula, totalDoughMass]);

  return(
    <div className={styles.main}>
      <h1>Calculoaf</h1>
      <p>A simple tool for adjusting bread formulas based on ingredient measurements, or vice versa.</p>
        <NumberInput 
            label={
            <>
              <span className="fas fa-star" />
              <b> Total Dough Mass</b>
            </>
            }
          id={'dough-mass'}
          value={totalDoughMass}
          min={0}
          enforceBounds
          precision={0}
          setValue={setTotalDoughMass}
        />
      <div className={styles.forms}>
        <div className={styles.formContainer}>
          <IngredientsForm 
            formula={formula}
            updateIngredients={updateIngredients}
            ingredients={ingredients}
          />
        </div>
        <div className={styles.formContainer}>
          <FormulaForm 
            updateFormula={setFormula}
            formula={formula}
          />
        </div>
      </div>
      <div className={styles.formContainer}>
        <TotalIngredients 
          ingredients={ingredients}
        />
      </div>
    </div>
  )
}
