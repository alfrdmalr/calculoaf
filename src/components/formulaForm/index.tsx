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

  const updateFormulaMixin = useCallback(
    (id: string, n: Numberish) => {
      let mixins = formula.mixins?.slice();
      if (!mixins || mixins.length <= 0) {
        // no mixins to update
        console.error(`tried to update mixin ${id} but no mixins in formula`);
        return;
      }
      const index = mixins.findIndex((m) => m.name === id);
      if (index < 0) {
        return `No mixin with name '${id}'`;
      }
      mixins[index] = {
        ...mixins[index],
        percentage: n,
      };

      const f: Nullable<Formula> = {
        ...formula,
        mixins: mixins,
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
      {formula.mixins?.map((mixin, i) => (
        <NumberInput
          key={`inclusion-${i}`}
          label={`${mixin.name} (${unit})`}
          id={mixin.name}
          value={mixin.percentage}
          setValue={(n) => updateFormulaMixin(mixin.name, n)}
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
            mixins: [
              ...(formula?.mixins ?? []),
              {
                name: `Mixin ${(formula.mixins?.length ?? 0) + 1}`,
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
