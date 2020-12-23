import React, {useState} from 'react';
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
  const [mass, setMass] = useState<number | undefined>();
  const [ingredients, setIngredients] = useState<Ingredients>({})
  const [formula, setFormula] = useState<Formula>({
    hydrationPercent: 74,
    levainPercent: 25,
    saltPercent: 2
  })

  return(
    <div className="main">
      <h1>testCalculoaf</h1>
      <p>A simple tool for adjusting bread formulas based on ingredient measurements, or vice versa.</p>
      <NumberInput 
        label={"Total Dough Mass"}
        id={'dough-mass'}
        value={mass}
        updateValue={n => {console.log('setting value: ', n); setMass(n)}}
      />
      <Button 
        label={"Apply Formula"}
        disabled={!mass}
        onClick={() => setIngredients(applyFormula(formula, mass as number))}
      />
      <div className="forms">
        <div className="form-container">
          <IngredientsForm />
        </div>
        <div className="form-container">
          <FormulaForm 
            {...formula}
          />
        </div>
      </div>
    </div>
  )
}

// assumes valid formula
function applyFormula(formula: Formula, mass: number): Ingredients {  
  const hydrationDecimal = formula.hydrationPercent / 100;
  const levainDecimal = formula.levainPercent / 100;
  const saltDecimal = formula.saltPercent / 100;
  if (mass < 1) {
    throw new Error("Dough mass must be at least 1 gram.")
  }
  
  const salt = mass * saltDecimal;
  const levain = mass * levainDecimal;
  const flour = (mass - (salt + levain)) / (1 + hydrationDecimal);
  const water = (flour * hydrationDecimal);
  
  return {
    salt,
    levain,
    flour,
    water
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
// hydration is a bit trickier though...
// we can still always find the flour percentage though
// if we don't have a TDM, we can just backcalculate the total flour amount from any single ingredient, because bakers percentage
