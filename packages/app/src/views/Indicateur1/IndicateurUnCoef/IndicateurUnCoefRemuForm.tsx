/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useCallback } from "react";
import {
  FormState,
  ActionIndicateurUnCoefData,
  GroupTranchesAgesIndicateurUn
} from "../../../globals";

import { effectifEtEcartRemuGroupCoef } from "../../../utils/calculsEgaProIndicateurUn";

import LayoutFormAndResult from "../../../components/LayoutFormAndResult";
import InfoBloc from "../../../components/InfoBloc";
import ActionBar from "../../../components/ActionBar";
import ActionLink from "../../../components/ActionLink";
import { ButtonSimulatorLink } from "../../../components/SimulatorLink";

import IndicateurUnFormRaw from "../IndicateurUnFormRaw";
import IndicateurUnResult from "../IndicateurUnResult";

interface Props {
  ecartRemuParTrancheAge: Array<effectifEtEcartRemuGroupCoef>;
  readOnly: boolean;
  updateIndicateurUnCoef: (data: ActionIndicateurUnCoefData) => void;
  validateIndicateurUn: (valid: FormState) => void;
  coefficientEffectifFormValidated: FormState;
  effectifsIndicateurCalculable: boolean;
  indicateurEcartRemuneration: number | undefined;
  indicateurSexeSurRepresente: "hommes" | "femmes" | undefined;
  noteIndicateurUn: number | undefined;
  navigateToEffectif: () => void;
}

function IndicateurUnCoefEffectifForm({
  ecartRemuParTrancheAge,
  readOnly,
  updateIndicateurUnCoef,
  validateIndicateurUn,
  coefficientEffectifFormValidated,
  effectifsIndicateurCalculable,
  indicateurEcartRemuneration,
  indicateurSexeSurRepresente,
  noteIndicateurUn,
  navigateToEffectif
}: Props) {
  const updateIndicateurUnRaw = useCallback(
    (
      data: Array<{
        id: any;
        tranchesAges: Array<GroupTranchesAgesIndicateurUn>;
      }>
    ) => {
      const coefficient = data.map(({ id, tranchesAges }) => ({
        tranchesAges
      }));
      updateIndicateurUnCoef({ coefficient });
    },
    [updateIndicateurUnCoef]
  );

  // le formulaire d'effectif n'est pas validé
  if (coefficientEffectifFormValidated !== "Valid") {
    return (
      <InfoBloc
        title="vous devez renseignez vos effectifs avant d’avoir accès à cet indicateur"
        text={
          <ActionLink onClick={navigateToEffectif}>
            renseigner les effectifs
          </ActionLink>
        }
      />
    );
  }

  // les effectifs ne permettent pas de calculer l'indicateur
  if (!effectifsIndicateurCalculable) {
    return (
      <div>
        <InfoBloc
          title="Malheureusement votre indicateur n’est pas calculable"
          text="car l’ensemble des groupes valables (c’est-à-dire comptant au
              moins 3 femmes et 3 hommes), représentent moins de 40% des
              effectifs."
        />
        <ActionBar>
          <ButtonSimulatorLink to="/indicateur2" label="suivant" />
        </ActionBar>
      </div>
    );
  }

  return (
    <LayoutFormAndResult
      childrenForm={
        <IndicateurUnFormRaw
          ecartRemuParTrancheAge={ecartRemuParTrancheAge}
          readOnly={readOnly}
          updateIndicateurUn={updateIndicateurUnRaw}
          validateIndicateurUn={validateIndicateurUn}
          nextLink={<ButtonSimulatorLink to="/indicateur2" label="suivant" />}
        />
      }
      childrenResult={
        readOnly && (
          <IndicateurUnResult
            indicateurEcartRemuneration={indicateurEcartRemuneration}
            indicateurSexeSurRepresente={indicateurSexeSurRepresente}
            noteIndicateurUn={noteIndicateurUn}
            validateIndicateurUn={validateIndicateurUn}
          />
        )
      }
    />
  );
}

export default IndicateurUnCoefEffectifForm;
