import React, {useEffect, useState} from 'react';
import {Button} from './components/button';
import {FormulaForm} from './components/formulaForm';
import {IngredientsForm} from './components/ingredientsForm';
import {NumberInput} from './components/numberInput';
import "./styles.css";
import {Formula} from './types/formula';
import {Ingredients} from './types/ingredients';

if (module.hot) {
  module.hot.accept();
}

export const App = () => {
  const [ingredients, setIngredients] = useState<Ingredients>({})
  const [formula, setFormula] = useState<Formula>({
    hydrationPercent: 74,
    preFermentPercent: 25,
    saltPercent: 2
  })

  useEffect(() => {
    if (ingredients.totalDoughMass !== undefined) {
      setIngredients(applyFormulaTDM(formula, ingredients.totalDoughMass))
    }
  }, [ingredients.totalDoughMass, formula])

  useEffect(() => {
    if (ingredients.saltMass !== undefined) {
      setIngredients(applyFormulaSalt(formula, ingredients.saltMass))
    }
  }, [ingredients.saltMass, formula])
  
  useEffect(() => {
    if (ingredients.flourMass !== undefined) {
      setIngredients(applyFormula(formula, ingredients.flourMass))
    }
  }, [ingredients.flourMass, formula])

  useEffect(() => {
    if (ingredients.preFermentMass !== undefined) {
      setIngredients(applyFormulaPreFerment(formula, ingredients.preFermentMass))
    }
  }, [ingredients.preFermentMass, formula])

  useEffect(() => {
    if (ingredients.waterMass !== undefined) {
      setIngredients(applyFormulaWater(formula, ingredients.waterMass))
    }
  }, [ingredients.waterMass, formula])

  return(
    <div className="main">
      <h1>Calculoaf</h1>
      <p>A simple tool for adjusting bread formulas based on ingredient measurements, or vice versa.</p>
      <NumberInput 
        label={"Total Dough Mass"}
        id={'dough-mass'}
        value={ingredients.totalDoughMass}
        updateValue={n => {
          setIngredients({
            ...ingredients,
            totalDoughMass: parseFloat(n)
          });
        }}
      />
      <Button 
        label={"Apply Formula"}
        disabled={!ingredients.totalDoughMass}
        onClick={() => setIngredients(applyFormulaTDM(formula, ingredients.totalDoughMass as number))}
      />
      <div className="forms">
        <div className="form-container">
          <IngredientsForm 
            updateIngredients={setIngredients}
            {...ingredients}
          />
        </div>
        <div className="form-container">
          <FormulaForm 
            updateFormula={setFormula}
            {...formula}
          />
        </div>
      </div>
    </div>
  )
}

function applyFormulaTDM(formula: Formula, totalDoughMass: number): Ingredients {
  const hydrationDecimal = formula.hydrationPercent / 100;
  const preFermentDecimal = formula.preFermentPercent / 100;
  const saltDecimal = formula.saltPercent / 100;
  if (totalDoughMass < 1) {
    throw new Error("Dough mass must be at least 1 gram.")
  }

  const flourMass = totalDoughMass / (1 + (hydrationDecimal + saltDecimal + preFermentDecimal));
  return applyFormula(formula, flourMass);
}

function applyFormulaPreFerment(formula: Formula, preFermentMass: number): Ingredients {
  const preFermentDecimal = formula.preFermentPercent / 100;
  const flourMass = preFermentMass / preFermentDecimal;
  return applyFormula(formula, flourMass)
}

function applyFormulaSalt(formula: Formula, saltMass: number): Ingredients {
  const saltDecimal = formula.saltPercent / 100;
  const flourMass = saltMass / saltDecimal;
  return applyFormula(formula, flourMass)
}

function applyFormulaWater(formula: Formula, waterMass: number): Ingredients {
  const waterDecimal = formula.hydrationPercent / 100;
  const flourMass = waterMass / waterDecimal;
  return applyFormula(formula, flourMass)
}

// assumes valid formula
export function applyFormula(formula: Formula, flourMass: number): Ingredients {  
  const hydrationDecimal = formula.hydrationPercent / 100;
  const preFermentDecimal = formula.preFermentPercent / 100;
  const saltDecimal = formula.saltPercent / 100;
  
  const saltMass = flourMass * saltDecimal;
  const preFermentMass = flourMass * preFermentDecimal;
  const waterMass = flourMass * hydrationDecimal; // not strictly true since the levain has some water
  
  return {
    saltMass,
    preFermentMass,
    flourMass,
    waterMass,
    totalDoughMass: flourMass + saltMass + waterMass + preFermentMass
  }
} 


// general formula:
// TDM = water + flour + salt + levain
// both water and flour can be expressed in terms of hydration and the other:
// water = flour * hydration
// flour = water / hydration
// meaning we only need one of these terms to generate a full set of
// ingredients, provided we have a formula (and a tdm)
//
// for example:
// flour = (TDM - salt - levain) / (1 + hydration)
// even better, we can get flour from just a TDM and recipe:
// TDM = FLOUR + FLOUR*water% + FLOUR*salt% + FLOUR*levain%
// so FLOUR = TDM / (1 + (waterPercent + saltPercent + preFermentPercent))
// hydration is a bit trickier though...
// we can still always find the flour percentage though
// if we don't have a TDM, we can just backcalculate the total flour amount from any single ingredient, because bakers percentage
