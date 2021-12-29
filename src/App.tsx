import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FormulaForm} from './components/formulaForm';
import {Formula, validateFormula} from './types/formula';
import {Ingredients} from './types/ingredients';
import {NumberInput} from './components/numberInput';
import {applyFormula, applyFormulaTDM, getFlourMass} from './functions/applyFormula';
import { isValid} from './types/numberish';
import { TotalIngredients } from './components/totalIngredients';
import { getReagentLabel, Reagent } from './types/reagent';
import { IngredientsForm } from './components/ingredientsForm';
import { Inclusion } from './types/inclusion';
import { Button } from './components/button';

import styles from "./app.module.css";
import { emptyIngredients } from './functions/emptyIngredients';

if (module.hot) {
  module.hot.accept();
}

const unit: string = "g";

export const App = () => {
  const [limitingReagent, setLimitingReagent] = useState<Reagent>({
    value: 2070, 
    key: 'totalDoughMass'
  });
  const [formula, setFormula] = useState<Formula>({
    hydrationPercent: 80,
    levainPercent: 25,
    saltPercent: 2,
    inclusions: []
  });
  const inclusions = useMemo(() => formula.inclusions, [formula]);
  const setInclusions = (inclusions: Inclusion[]) => {
    setFormula(prev => {
      return {
        ...prev,
        inclusions: inclusions
      }
    });
  }
  const [ingredients, setIngredients] = useState<Ingredients>(emptyIngredients(formula));
  const [mixinName, setMixinName] = useState<string>('');

  const handleReagentChange = useCallback((r: Reagent, f: Formula) => {
    let newIngredients = emptyIngredients(f);

    if (!isValid(r.value)) {
      // need a 'null everything' function
      setIngredients(newIngredients);
      return;
    }

    switch(r.key) {
      case 'totalDoughMass':
        newIngredients = applyFormulaTDM(f, r.value);
        break;
      case 'flourMass':
        newIngredients = applyFormula(f, r.value);
        break;
      case 'levainMass':
        newIngredients = applyFormula(f, getFlourMass(r.value, f.levainPercent));
        break;
      case 'waterMass':
        newIngredients = applyFormula(f, getFlourMass(r.value, f.hydrationPercent));
        break;
      case 'saltMass':
        newIngredients = applyFormula(f, getFlourMass(r.value, f.saltPercent));
        break;
      default:
        break;
    }

    setIngredients(prev => ({
      ...prev,
      ...newIngredients,
    }));
  }, []);

  useEffect(() => {
    const {key, value} = limitingReagent;

    if (!validateFormula(formula) || 
      !isValid(value)) {
      setIngredients(emptyIngredients(formula));
    } else {
      handleReagentChange({key, value}, formula);
    }
  }, [formula, limitingReagent]);

  /*
  const isValidInclusionName = (s: string): boolean => {
    return s !== "" && (inclusions.findIndex((i: Inclusion) => i.name === s) < 0);
  }
   */

  return(
    <div className={styles.main}>
      <h1>Calculoaf</h1>
      <p>A simple tool for adjusting bread formulas based on ingredient measurements, or vice versa.</p>

      <NumberInput 
        label={
            <b> {getReagentLabel(limitingReagent.key)} Mass ({unit})</b>
        }
        id={'dough-mass'}
        value={limitingReagent.value}
        min={0}
        enforceBounds
        precision={0}
        setValue={n => setLimitingReagent(prev => ({key: prev.key, value: n}))}
        disabled={!validateFormula(formula)}
      />

    <Button 
      onClick={() => {
        setInclusions([
          ...inclusions,
          {name: 'New Inclusion', value: null, id: Date.now()} // better id system
        ]);
      }}
    >
      <>
        <span className='fas fa-plus' /><span> Add Inclusion</span>
      </>
      </Button>

      <div className={styles.forms}>
        <div className={styles.formContainer}>
          <IngredientsForm
            updateIngredients={setIngredients}
            ingredients={ingredients}
            formula={formula}
          />
        </div>
        <div className={styles.formContainer}>
          <FormulaForm 
            updateFormula={setFormula}
            formula={formula}
          />
        </div>
      </div>

      <div>
        <TotalIngredients 
          ingredients={ingredients}
        />
      </div>

    </div>
  )
}
