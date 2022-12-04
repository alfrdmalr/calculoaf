import React, { useCallback } from "react";
import { Formula } from "../../types/formula";
import { Nullable } from "../../types/nullable";
import { Numberish } from "../../types/numberish";
import { NumberInput } from "../numberInput";

export interface FormulaFormProps {
  formula: Nullable<Formula>;
  updateFormula: (f: Nullable<Formula>) => void;
}

export const FormulaForm = (props: FormulaFormProps) => {
  const { updateFormula, formula } = props;
  const { hydrationPercent, levainPercent, saltPercent } = formula;

  const updateFormulaParameter = useCallback(
    (key: keyof Formula, n: Numberish) => {
      const f: Nullable<Formula> = {
        ...formula,
        [key]: n,
      };

      updateFormula(f);
    },
    [formula, updateFormula]
  );

  const unit = "%";

  return (
    <>
      <h2>Formula</h2>
      <NumberInput
        label={`Pre-Ferment (${unit})`}
        id={"pre-ferment-formula"}
        value={levainPercent}
        setValue={(n) => updateFormulaParameter("levainPercent", n)}
        required
        enforceBounds
        min={0}
        max={100}
      />
      <NumberInput
        label={`Hydration (${unit})`}
        id={"hydration"}
        value={hydrationPercent}
        setValue={(n) => updateFormulaParameter("hydrationPercent", n)}
        required
        enforceBounds
        min={0}
        max={100}
      />
      <NumberInput
        label={`Salt (${unit})`}
        id={"salt"}
        value={saltPercent}
        setValue={(n) => updateFormulaParameter("saltPercent", n)}
        required
        enforceBounds
        min={0}
        max={100}
      />
    </>
  );
};
