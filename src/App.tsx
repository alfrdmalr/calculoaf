import React, {useState} from 'react';
import {Button} from './components/button';
import {TotalIngredients} from './components/totalIngredients';
import {FormulaForm} from './components/formulaForm';
import {IngredientsForm} from './components/ingredientsForm';
import {NumberInput} from './components/numberInput';
import {applyFormulaTDM} from './functions/applyFormula';
import styles from "./app.module.css";
import {Formula} from './types/formula';
import {Ingredients} from './types/ingredients';

if (module.hot) {
  module.hot.accept();
}

export const App = () => {
  const [totalDoughMass, setTotalDoughMass] = useState<number | undefined>(undefined);
  const [ingredients, setIngredients] = useState<Ingredients>({});
  const [formula, setFormula] = useState<Formula>({
    hydrationPercent: 74,
    preFermentPercent: 25,
    saltPercent: 2
  });

  const updateIngredients = (i: Ingredients) => {
    setIngredients(i);
    if (validateIngredients(i)) {
      const newTDM = i.saltMass + i.flourMass + i.waterMass + i.preFermentMass;
      setTotalDoughMass(newTDM);
    }
  }

  const validateIngredients = (i: Ingredients): i is {
      saltMass: number, 
      flourMass: number, 
      waterMass: number, 
      preFermentMass: number
  } => {
    if (i.saltMass === undefined) {
      return false;      
    }
    if (i.flourMass === undefined) {
      return false;
    }
    if (i.waterMass === undefined) {
      return false;
    }
    if (i.preFermentMass === undefined) {
      return false;
    }
    return true;
  }
  
  const isValidFormula = (f: Formula): boolean => {
    if (isNaN(f.saltPercent) || f.saltPercent === undefined) {
      return false;
    }
    if (isNaN(f.hydrationPercent) || f.hydrationPercent === undefined) {
      return false;
    }
    if (isNaN(f.preFermentPercent) || f.preFermentPercent === undefined) {
      return false;
    }
    return true;
  }


  return(
    <div className={styles.main}>
      <h1>Calculoaf</h1>
      <p>A simple tool for adjusting bread formulas based on ingredient measurements, or vice versa.</p>
      <NumberInput 
        label={"Total Dough Mass"}
        id={'dough-mass'}
        value={totalDoughMass}
        min={0}
        enforceBounds
        updateValue={(n) => setTotalDoughMass(n)}
      />
      <Button 
        label={"Apply Formula"}
        disabled={!totalDoughMass || !isValidFormula(formula)}
        onClick={() => setIngredients(applyFormulaTDM(formula, totalDoughMass as number))}
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
