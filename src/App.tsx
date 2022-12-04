import React, {useCallback, useEffect, useState} from 'react';
import {FormulaForm} from './components/formulaForm';
import styles from "./app.module.css";
import {Formula, validateFormula} from './types/formula';
import {emptyIngredients, Ingredients} from './types/ingredients';
import {NumberInput} from './components/numberInput';
import {applyFormula, applyFormulaTDM, getFlourMass} from './functions/applyFormula';
import { Nullable } from './types/nullable';
import { isValid } from './types/numberish';
import { TotalIngredients } from './components/totalIngredients';
import { getReagentLabel, Reagent } from './types/reagent';

const unit: string = "g";

export const App = () => {
  const [limitingReagent, setLimitingReagent] = useState<Reagent>({
    value: 2070, 
    key: 'totalDoughMass'
  });
  const [ingredients, setIngredients] = useState<Nullable<Ingredients>>(emptyIngredients());
  const [formula, setFormula] = useState<Nullable<Formula>>({
    hydrationPercent: 80,
    levainPercent: 25,
    saltPercent: 2
  });

  const handleReagentChange = useCallback((r: Reagent, formula: Formula) => {
    let newIngredients = emptyIngredients();

    if (!isValid(r.value)) {
      setIngredients(newIngredients);
      return;
    }

    switch(r.key) {
      case 'totalDoughMass':
        newIngredients = applyFormulaTDM(formula, r.value);
        break;
      case 'flourMass':
        newIngredients = applyFormula(formula, r.value);
        break;
      case 'levainMass':
        newIngredients = applyFormula(formula, getFlourMass(r.value, formula.levainPercent));
        break;
      case 'waterMass':
        newIngredients = applyFormula(formula, getFlourMass(r.value, formula.hydrationPercent));
        break;
      case 'saltMass':
        newIngredients = applyFormula(formula, getFlourMass(r.value, formula.saltPercent));
        break;
      default:
        break;
    }

    setIngredients(newIngredients)
  }, []);


  useEffect(() => {
    const {key, value} = limitingReagent;

    if (!validateFormula(formula) || 
      !isValid(value)) {
      setIngredients(emptyIngredients());
    } else {
      handleReagentChange({key, value}, formula);
    }
  }, [formula, limitingReagent]);

  return(
    <div className={styles.main}>
      <h1>Calculoaf</h1>
      <p>A simple tool for adjusting bread formulas based on ingredient measurements, or vice versa.</p>

      <NumberInput 
        label={
          <>
            <span className="fas fa-star" />
            <b> {getReagentLabel(limitingReagent.key)} Mass ({unit})</b>
          </>
        }
        id={'dough-mass'}
        value={limitingReagent.value}
        min={0}
        enforceBounds
        precision={0}
        setValue={n => setLimitingReagent(prev => ({key: prev.key, value: n}))}
      />

      <div className={styles.forms}>
        <div className={styles.formContainer}>
          <TotalIngredients 
            ingredients={ingredients}
            setLimitingReagent={setLimitingReagent}
            limitingReagent={limitingReagent.key}
          />
        </div>
        <div className={styles.formContainer}>
          <FormulaForm 
            updateFormula={setFormula}
            formula={formula}
          />
        </div>
      </div>
    </div>
  )
}
