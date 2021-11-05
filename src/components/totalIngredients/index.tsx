import React, { useCallback, useMemo } from 'react';
import { getReagentLabel, Reagent, ReagentType } from '../../types/reagent';
import {Ingredients, validateIngredients} from '../../types/ingredients';
import { Nullable } from '../../types/nullable';
import { Numberish } from '../../types/numberish';
import styles from './totals.module.css'
import { NumberInput } from '../numberInput';

export interface TotalIngredientsProps {
  ingredients: Nullable<Ingredients>;
  setLimitingReagent: (r: Reagent) => void;
  limitingReagent: Reagent;
}

export const TotalIngredients = (props: TotalIngredientsProps) => {
  const {setLimitingReagent, limitingReagent, ingredients} = props;

  const {
    levainMass,
    flourMass,
    waterMass,
    saltMass,
  } = ingredients;

  //todo
  const unit: string = "g";

  const reagentButton = useCallback((key: ReagentType, value: Numberish) => {
    return (
      <>
        {limitingReagent.key !== key &&
        <button onClick={() => setLimitingReagent({key: key, value: value})}>
          <span className="fas fa-star" />
        </button>
        }
      </>
    );

  }, [limitingReagent, setLimitingReagent]);

  /*
  const reagentInput = useCallback((props: Reagent) => {
    const {key, value} = props;
    console.log('reagent input');
    return (
      <>
        {limitingReagent.key === key 
          ? (
          <NumberInput
            id={key}
            value={value}
            setValue={v => setLimitingReagent({key: key, value: v})}
            label={''}
          />
          )
          : <span>{value?.toFixed(2)}</span>
        }
      </>
    );
  }, [limitingReagent, setLimitingReagent]);
  */

  const totalDoughMass = useMemo(() => {
    if (validateIngredients(ingredients)) {
      return (0
        + ingredients.levainMass
        + ingredients.flourMass
        + ingredients.saltMass
        + ingredients.waterMass
      );
    } else {
      return null;
    }

  }, [ingredients])

  return(
    <div className={styles.container}>
      <h2>Total Ingredients</h2>
      <table className={styles.table}> 
        <tbody>
          <tr>
            <th>Ingredient Name</th> 
            <th>Mass ({unit})</th> 
            <th></th>
          </tr>

          <tr>
            <td>{getReagentLabel('flourMass')}</td>
            <td>
              {/* reagentInput({key: 'flourMass', value: flourMass}) */}
              {flourMass?.toFixed(2)}
            </td>
            <td>
              {reagentButton('flourMass', flourMass)}
            </td>
          </tr>
           
          <tr>
            <td>{getReagentLabel('waterMass')}</td>
            <td>{waterMass?.toFixed(2)}</td>
            <td>
              {reagentButton('waterMass', waterMass)}
            </td>
          </tr>

          <tr>
            <td>{getReagentLabel('levainMass')}</td>
            <td>{levainMass?.toFixed(2)}</td>
            <td>
              {reagentButton('levainMass', levainMass)}
            </td>
          </tr>

          <tr>
            <td>{getReagentLabel('saltMass')}</td>
            <td>{saltMass?.toFixed(2)}</td>
            <td>
              {reagentButton('saltMass', saltMass)}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total Dough</td>
            <td>{totalDoughMass?.toFixed(2)}</td>
            <td>
              {reagentButton('totalDoughMass', totalDoughMass)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

