import React, {useState} from 'react';
import {TotalIngredients} from './components/totalIngredients';
import {FormulaForm} from './components/formulaForm';
import {IngredientsForm} from './components/ingredientsForm';
import styles from "./app.module.css";
import {Formula} from './types/formula';
import {Ingredients} from './types/ingredients';
import {TotalDoughModule} from './components/totalDoughModule';
import {NumberInput} from './components/numberInput';
import {applyFormulaTDM} from './functions/applyFormula';

if (module.hot) {
  module.hot.accept();
}

export const App = () => {
  const [totalDoughMass, setTotalDoughMass] = useState<number>();
  const [ingredients, setIngredients] = useState<Ingredients>();
  const [formula, setFormula] = useState<Formula>({
    hydrationPercent: 74,
    levainPercent: 25,
    saltPercent: 2
  });

  const updateIngredients = (i: Ingredients | null) => {
    if (i === null) {
      setIngredients(undefined);
      return;
    }
    setIngredients(i);
    if (validateIngredients(i)) {
      const newTDM = i.saltMass + i.flourMass + i.waterMass + i.levainMass;
      setTotalDoughMass(newTDM);
    }
  }

  const validateIngredients = (i: Ingredients): i is {
      saltMass: number, 
      flourMass: number, 
      waterMass: number, 
      levainMass: number
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
    if (i.levainMass === undefined) {
      return false;
    }
    return true;
  }

  const handleDoughMass = (n: number | undefined) => {
    if (n === undefined) {
      setIngredients(undefined); 
      return;
    }
    setIngredients(applyFormulaTDM(formula, n))
  }
  return(
    <div className={styles.main}>
      <h1>Calculoaf</h1>
      <p>A simple tool for adjusting bread formulas based on ingredient measurements, or vice versa.</p>
      <b><NumberInput 
        label={"Total Dough Mass"}
        id={'dough-mass'}
        value={totalDoughMass}
        min={0}
        enforceBounds
        precision={2}
        updateValue={(n) => {
          setTotalDoughMass(n)
          handleDoughMass(n);
        }}
      /></b>
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
      <TotalDoughModule
        totalDoughMass={totalDoughMass}
        setTotalDoughMass={setTotalDoughMass}
        formula={formula}
        updateIngredients={setIngredients}
      />
      <div className={styles.formContainer}>
        {/*
        total ingredients will go here
        <TotalIngredients 
          ingredients={ingredients}
        />
         */}
      </div>
    </div>
  )
}
