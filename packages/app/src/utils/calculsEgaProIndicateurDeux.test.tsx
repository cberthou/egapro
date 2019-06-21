import {
  calculValiditeGroupe,
  calculEcartTauxAugmentation,
  calculIndicateurCalculable,
  calculIndicateurEcartAugmentation,
  calculNote
} from "./calculsEgaProIndicateurDeux";

//////////////////
// INDICATEUR 2 //
//////////////////

it("calculValiditeGroupe", () => {
  expect(calculValiditeGroupe(-1, -2)).toEqual(false);
  expect(calculValiditeGroupe(4, -2)).toEqual(false);

  expect(calculValiditeGroupe(0, 0)).toEqual(false);
  expect(calculValiditeGroupe(1, 1)).toEqual(false);
  expect(calculValiditeGroupe(4, 6)).toEqual(false);
  expect(calculValiditeGroupe(9, 10)).toEqual(false);
  expect(calculValiditeGroupe(11, 8)).toEqual(false);

  expect(calculValiditeGroupe(10, 10)).toEqual(true);
  expect(calculValiditeGroupe(11, 10)).toEqual(true);
  expect(calculValiditeGroupe(11, 21)).toEqual(true);
});

it("calculEcartTauxAugmentation", () => {
  expect(calculEcartTauxAugmentation(-1, -2)).toEqual(undefined);
  expect(calculEcartTauxAugmentation(4, -2)).toEqual(undefined);

  expect(calculEcartTauxAugmentation(0, 0)).toEqual(0);
  expect(calculEcartTauxAugmentation(0.12, 0.12)).toEqual(0);
  expect(calculEcartTauxAugmentation(0.12, 0.19)).toEqual(0.07);
  expect(calculEcartTauxAugmentation(0.2, 0.3)).toEqual(0.1);
  expect(calculEcartTauxAugmentation(0.28, 0.215)).toEqual(-0.065);
  expect(calculEcartTauxAugmentation(0.25, 0.5)).toEqual(0.25);
});

it("calculIndicateurCalculable", () => {
  expect(calculIndicateurCalculable(false, 100, 40, 0, 0.23)).toEqual(false);

  expect(calculIndicateurCalculable(true, 100, 39, 0.12, 0.23)).toEqual(false);
  expect(calculIndicateurCalculable(true, 100, 39, 0, 0.23)).toEqual(false);
  expect(calculIndicateurCalculable(true, 100, 40, 0, 0.23)).toEqual(true);
  expect(calculIndicateurCalculable(true, 100, 40, 0.12, 0.23)).toEqual(true);

  expect(calculIndicateurCalculable(true, 500, 199, 0.12, 0.23)).toEqual(false);
  expect(calculIndicateurCalculable(true, 500, 199, 0.12, 0)).toEqual(false);
  expect(calculIndicateurCalculable(true, 500, 400, 0.12, 0)).toEqual(true);
  expect(calculIndicateurCalculable(true, 1000, 400, 0.12, 0.23)).toEqual(true);

  expect(calculIndicateurCalculable(true, 600, 200, 0.12, 0.23)).toEqual(false);
  expect(calculIndicateurCalculable(true, 600, 200, 0, 0)).toEqual(false);
  expect(calculIndicateurCalculable(true, 700, 350, 0, 0)).toEqual(false);
  expect(calculIndicateurCalculable(true, 700, 350, 0.12, 0.23)).toEqual(true);
});

it("calculIndicateurEcartAugmentation", () => {
  expect(calculIndicateurEcartAugmentation(false, undefined)).toEqual(
    undefined
  );
  expect(calculIndicateurEcartAugmentation(true, undefined)).toEqual(undefined);

  expect(calculIndicateurEcartAugmentation(false, 0.01)).toEqual(undefined);
  expect(calculIndicateurEcartAugmentation(true, 0.01)).toEqual(1);

  expect(calculIndicateurEcartAugmentation(false, 0.022)).toEqual(undefined);
  expect(calculIndicateurEcartAugmentation(true, 0.022)).toEqual(2.2);

  expect(calculIndicateurEcartAugmentation(false, 0.505)).toEqual(undefined);
  expect(calculIndicateurEcartAugmentation(true, 0.505)).toEqual(50.5);
});

it("calculNote", () => {
  expect(calculNote(undefined, undefined, undefined, undefined)).toEqual(
    undefined
  );
  expect(calculNote(-2, undefined, undefined, undefined)).toEqual(20);
  expect(calculNote(-0.5, undefined, undefined, undefined)).toEqual(20);
  expect(calculNote(0, undefined, undefined, undefined)).toEqual(20);
  expect(calculNote(0.1, undefined, undefined, undefined)).toEqual(20);
  expect(calculNote(0.5, undefined, undefined, undefined)).toEqual(20);
  expect(calculNote(1, undefined, undefined, undefined)).toEqual(20);
  expect(calculNote(2, undefined, undefined, undefined)).toEqual(20);
  expect(calculNote(2.1, undefined, undefined, undefined)).toEqual(10);
  expect(calculNote(3.2, undefined, undefined, undefined)).toEqual(10);
  expect(calculNote(4, undefined, undefined, undefined)).toEqual(10);
  expect(calculNote(5, undefined, undefined, undefined)).toEqual(10);
  expect(calculNote(5.1, undefined, undefined, undefined)).toEqual(5);
  expect(calculNote(7, undefined, undefined, undefined)).toEqual(5);
  expect(calculNote(7.1, undefined, undefined, undefined)).toEqual(5);
  expect(calculNote(8, undefined, undefined, undefined)).toEqual(5);
  expect(calculNote(10, undefined, undefined, undefined)).toEqual(5);
  expect(calculNote(10.1, undefined, undefined, undefined)).toEqual(0);
  expect(calculNote(13.2, undefined, undefined, undefined)).toEqual(0);
  expect(calculNote(50.5, undefined, undefined, undefined)).toEqual(0);

  expect(calculNote(2.1, undefined, undefined, undefined)).toEqual(10);
  expect(calculNote(2.09, undefined, undefined, undefined)).toEqual(10);
  expect(calculNote(2.06, undefined, undefined, undefined)).toEqual(10);
  expect(calculNote(2.05, undefined, undefined, undefined)).toEqual(10); // round to 2.1
  expect(calculNote(2.04, undefined, undefined, undefined)).toEqual(20); // round to 2.0
  expect(calculNote(2.01, undefined, undefined, undefined)).toEqual(20);
  expect(calculNote(2.0, undefined, undefined, undefined)).toEqual(20);

  expect(calculNote(2.1, 40, "femmes", "hommes")).toEqual(10);
  expect(calculNote(8.1, 36, "hommes", "hommes")).toEqual(5);
  expect(calculNote(2.1, 39, "femmes", "hommes")).toEqual(20);
  expect(calculNote(8.1, 36, "hommes", "femmes")).toEqual(20);
});
