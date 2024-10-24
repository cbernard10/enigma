import { makeRotor, spin, translate } from "./rotors";
import makeReflector from "./reflectors";

import { Structure } from "./types";

const makeStructure = (
  rotorKeys: string[],
  ringSetting: string,
  reflectorKey: string
): Structure => {
  // const rotors = [...rotorSet];

  const ringSettingInt = ringSetting.split("").map((letter) => {
    return letter.charCodeAt(0) - 65;
  });

  const rotors = rotorKeys.map((rotorKey, i) => {
    return makeRotor(rotorKey, ringSettingInt[i]);
  });

  const reflector = makeReflector(reflectorKey);

  return {
    rotors,
    reflector,
    path: "",
    innerPath: "",
  };
};

const translateStruct = (letter: string, structure: Structure): string => {
  // convert the letter to its index before entering the rotor set

  let letterIdx = letter.charCodeAt(0) - 65;
  structure.path = letter;
  structure.innerPath = "";

  for (const rotor of structure.rotors) {
    const { outputIdx, innerPath } = translate(letterIdx, rotor, false);
    letterIdx = outputIdx;
    structure.path += `${String.fromCharCode(letterIdx + 65)}`;
    structure.innerPath += innerPath
  }

  // REFLECT LETTER
  // letterIdx = structure.reflector.wiring[letterIdx];
  letterIdx =
    structure.reflector.connections[
      String.fromCharCode(letterIdx + 65)
    ].charCodeAt(0) - 65;

  structure.path += `${String.fromCharCode(letterIdx + 65)}`;

  // SECOND PASS THROUGH THE THREE ROTORS, REVERSED
  for (const rotor of structure.rotors.slice().reverse()) {
    const { outputIdx, innerPath } = translate(letterIdx, rotor, true);
    letterIdx = outputIdx;
    structure.path += `${String.fromCharCode(letterIdx + 65)}`;
    structure.innerPath += innerPath
  }

  const output = String.fromCharCode(letterIdx + 65);
  // structure.path += output

  console.log(structure.innerPath);

  console.log("----------------------------------------------");
  return output;
};

const spinRotors = (structure: Structure): Structure => {
  // get the numerical position of the turnover: C -> 2

  const rotorTurnoversToInt = structure.rotors.map((rotor) => {
    return rotor.turnover.map((letter) => {
      return letter.charCodeAt(0) - 65;
    });
  });

  if (rotorTurnoversToInt[0].includes(structure.rotors[0].offset)) {
    structure.rotors[1] = spin(structure.rotors[1]);
  }

  if (
    !structure.rotors[1].hasSpunNextRotor &&
    rotorTurnoversToInt[1].includes(structure.rotors[1].offset - 1)
  ) {
    structure.rotors[2] = spin(structure.rotors[2]);
    structure.rotors[1].hasSpunNextRotor = true;
  }

  if (
    structure.rotors[1].hasSpunNextRotor &&
    !rotorTurnoversToInt[1].includes(structure.rotors[1].offset - 1)
  ) {
    structure.rotors[1].hasSpunNextRotor = false;
  }

  structure.rotors[0] = spin(structure.rotors[0]);

  return structure;
};

export { makeStructure, translateStruct, spinRotors };
