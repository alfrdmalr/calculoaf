import React, { useCallback } from "react";
import { Formula } from "../../types/formula";
import { Nullable } from "../../types/nullable";
import { Numberish } from "../../types/numberish";
import { Button } from "../button";
import { NumberInput } from "../numberInput";

export interface FormulaFormProps {
  formula: Nullable<Formula>;
  updateFormula: (f: Nullable<Formula>) => void;
}

export const FormulaForm = (props: FormulaFormProps) => {
  const { updateFormula, formula } = props;
  const { hydrationPercent, levainPercent, saltPercent } = formula;

  const updateFormulaInclusion = useCallback(
    (id: string, n: Numberish) => {
      let inclusions = formula.inclusions?.slice();
      if (!inclusions || inclusions.length <= 0) {
        // no inclusions to update
        console.error(
          `tried to update inclusion ${id} but no inclusions in formula`
        );
        return;
      }
      const index = inclusions.findIndex((m) => m.name === id);
      if (index < 0) {
        return `No inclusion with name '${id}'`;
      }
      inclusions[index] = {
        ...inclusions[index],
        percentage: n,
      };

      const f: Nullable<Formula> = {
        ...formula,
        inclusions: inclusions,
      };

      updateFormula(f);
    },
    [formula, updateFormula]
  );

  const updateBaseFormulaParameter = useCallback(
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
        setValue={(n) => updateBaseFormulaParameter("levainPercent", n)}
        required
        enforceBounds
        min={0}
        max={100}
      />
      <NumberInput
        label={`Hydration (${unit})`}
        id={"hydration"}
        value={hydrationPercent}
        setValue={(n) => updateBaseFormulaParameter("hydrationPercent", n)}
        required
        enforceBounds
        min={0}
        max={100}
      />
      <NumberInput
        label={`Salt (${unit})`}
        id={"salt"}
        value={saltPercent}
        setValue={(n) => updateBaseFormulaParameter("saltPercent", n)}
        required
        enforceBounds
        min={0}
        max={100}
      />
      {formula.inclusions?.map((inclusion, i) => (
        <NumberInput
          key={`inclusion-${i}`}
          label={`${inclusion.name} (${unit})`}
          id={inclusion.name}
          value={inclusion.percentage}
          setValue={(n) => updateFormulaInclusion(inclusion.name, n)}
          required
          enforceBounds
          min={0}
          max={100}
        />
      ))}

      <Button
        onClick={() => {
          updateFormula({
            ...formula,
            inclusions: [
              ...(formula?.inclusions ?? []),
              {
                name: `Inclusion ${(formula.inclusions?.length ?? 0) + 1}`,
                percentage: 0,
              },
            ],
          });
        }}
      >
        + inclusion
      </Button>
    </>
  );
};
