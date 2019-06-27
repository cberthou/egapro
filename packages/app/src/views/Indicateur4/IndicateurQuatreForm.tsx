/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { memo, Fragment } from "react";
import { useForm } from "react-final-form-hooks";
import {
  AppState,
  FormState,
  ActionIndicateurQuatreData
} from "../../globals.d";

import {
  parseIntFormValue,
  parseIntStateValue,
  required,
  mustBeNumber,
  maxNumber
} from "../../utils/formHelpers";

import { BlocFormLight } from "../../components/BlocForm";
import FieldInput, {
  HEIGHT as FieldInputHeight,
  MARGIN_TOP as FieldInputMarginTop
} from "../../components/FieldInput";
import RadiosBoolean from "../../components/RadiosBoolean";
import ActionBar from "../../components/ActionBar";
import FormSubmit from "../../components/FormSubmit";
import { ButtonSimulatorLink } from "../../components/SimulatorLink";

const validate = (value: string) => {
  const requiredError = required(value);
  const mustBeNumberError = mustBeNumber(value);
  if (!requiredError && !mustBeNumberError) {
    return undefined;
  } else {
    return { required: requiredError, mustBeNumber: mustBeNumberError };
  }
};

const validateWithPreviousField = (
  value: string,
  valuePreviousField: string
) => {
  const requiredError = required(value);
  const mustBeNumberError = mustBeNumber(value);
  const maxNumberError = maxNumber(value, Number(valuePreviousField));
  if (!requiredError && !mustBeNumberError && !maxNumberError) {
    return undefined;
  } else {
    return {
      required: requiredError,
      mustBeNumber: mustBeNumberError,
      previousField: maxNumberError
    };
  }
};

const validateForm = ({
  presenceCongeMat,
  nombreSalarieesPeriodeAugmentation,
  nombreSalarieesAugmentees
}: {
  presenceCongeMat: string;
  nombreSalarieesPeriodeAugmentation: string;
  nombreSalarieesAugmentees: string;
}) => {
  if (presenceCongeMat === "false") {
    return null;
  }
  return {
    nombreSalarieesPeriodeAugmentation: validate(
      nombreSalarieesPeriodeAugmentation
    ),
    nombreSalarieesAugmentees: validateWithPreviousField(
      nombreSalarieesAugmentees,
      nombreSalarieesPeriodeAugmentation
    )
  };
};

///////////////

interface Props {
  indicateurQuatre: AppState["indicateurQuatre"];
  readOnly: boolean;
  updateIndicateurQuatre: (data: ActionIndicateurQuatreData) => void;
  validateIndicateurQuatre: (valid: FormState) => void;
}

function IndicateurQuatreForm({
  indicateurQuatre,
  readOnly,
  updateIndicateurQuatre,
  validateIndicateurQuatre
}: Props) {
  const initialValues = {
    presenceCongeMat: String(indicateurQuatre.presenceCongeMat),
    nombreSalarieesPeriodeAugmentation: parseIntStateValue(
      indicateurQuatre.nombreSalarieesPeriodeAugmentation
    ),
    nombreSalarieesAugmentees: parseIntStateValue(
      indicateurQuatre.nombreSalarieesAugmentees
    )
  };

  const saveForm = (formData: any) => {
    const {
      presenceCongeMat,
      nombreSalarieesPeriodeAugmentation,
      nombreSalarieesAugmentees
    } = formData;

    updateIndicateurQuatre({
      presenceCongeMat: presenceCongeMat === "true",
      nombreSalarieesPeriodeAugmentation: parseIntFormValue(
        nombreSalarieesPeriodeAugmentation
      ),
      nombreSalarieesAugmentees: parseIntFormValue(nombreSalarieesAugmentees)
    });
  };

  const onSubmit = (formData: any) => {
    saveForm(formData);
    validateIndicateurQuatre("Valid");
  };

  const {
    form,
    values,
    handleSubmit,
    hasValidationErrors,
    submitFailed
  } = useForm({
    initialValues,
    onSubmit,
    validate: validateForm
  });

  form.subscribe(
    ({ values, dirty }) => {
      if (dirty) {
        saveForm(values);
      }
    },
    { values: true, dirty: true }
  );

  return (
    <form onSubmit={handleSubmit} css={styles.container}>
      <RadiosBoolean
        form={form}
        fieldName="presenceCongeMat"
        readOnly={readOnly}
        labelTrue={
          <Fragment>
            <strong>il y a eu des retours de congé maternité</strong> pendant la
            période de référence
          </Fragment>
        }
        labelFalse={
          <Fragment>
            <strong>il n’y a pas eu de retour de congé maternité</strong>{" "}
            pendant la période de référence
          </Fragment>
        }
      />

      {values.presenceCongeMat === "true" && (
        <BlocFormLight>
          <FieldInput
            form={form}
            fieldName="nombreSalarieesPeriodeAugmentation"
            label="parmi ces retours, combien étaient en congé maternité pendant qu'il y a eu une/ou des augmentations salariales dans l'entreprise ?"
            readOnly={readOnly}
          />
          <div css={styles.spacer} />
          <FieldInput
            form={form}
            fieldName="nombreSalarieesAugmentees"
            label="parmi ces salariées, combien ont bénéficié d’une augmentation à leur retour de congé maternité ?"
            readOnly={readOnly}
          />
        </BlocFormLight>
      )}

      {readOnly ? (
        <ActionBar>
          <ButtonSimulatorLink to="/indicateur5" label="suivant" />
        </ActionBar>
      ) : (
        <ActionBar>
          <FormSubmit
            hasValidationErrors={hasValidationErrors}
            submitFailed={submitFailed}
            errorMessage="vous ne pouvez pas valider l’indicateur tant que vous n’avez pas rempli tous les champs"
          />
        </ActionBar>
      )}
    </form>
  );
}

const styles = {
  container: css({
    display: "flex",
    flexDirection: "column"
  }),
  spacer: css({
    height: 8
  }),
  emptyFields: css({
    height: (FieldInputHeight + FieldInputMarginTop) * 2
  })
};

export default memo(
  IndicateurQuatreForm,
  (prevProps, nextProps) => prevProps.readOnly === nextProps.readOnly
);
