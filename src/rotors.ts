"use client";
import { Rotor, Connections } from "./types";

const rotors = {
  I: {
    turnover: ["Q"],
    wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
  },
  II: {
    turnover: ["E"],
    wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
  },
  III: {
    turnover: ["V"],
    wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
  },
  IV: {
    turnover: ["J"],
    wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB",
  },
  V: {
    turnover: ["Z"],
    wiring: "VZBRGITYUPSDNHLXAWMJQOFECK",
  },
  VI: {
    turnover: ["Z", "M"],
    wiring: "JPGVOUMFYQBENHZRDKASXLICTW",
  },
  VII: {
    turnover: ["Z", "M"],
    wiring: "NZJHGRCXMYSWBOUFAIVLPEKQDT",
  },
  VIII: {
    turnover: ["Z", "M"],
    wiring: "FKQHTLXOCBJSPDZRAMEWNIUYGV",
  },
};

const wiringStringToConnections = (wiring: string): Connections => {
  const connections: Connections = {};

  for (let i = 0; i < wiring.length; i++) {
    connections[String.fromCharCode(65 + i)] = wiring[i];
  }

  return connections;
};


const reverseWiringString = (wiring: string): string => {
  const connections = wiringStringToConnections(wiring);
  const entries = Object.entries(connections);
  const sorted = entries.sort((a, b) => {
    return a[1].charCodeAt(0) - b[1].charCodeAt(0);
  });
  return sorted.map((entry) => entry[0]).join("");
};

const makeRotor = (rotorKey: string, offset: number): Rotor => {
  const rotor = rotors[rotorKey as keyof typeof rotors];

  if (!rotor) {
    throw new Error(`Rotor ${rotorKey} not found`);
  }

  const connections: Connections = wiringStringToConnections(rotor.wiring);
  const reverseConnections: Connections = Object.keys(connections).reduce(
    (acc: Connections, key: string) => {
      acc[connections[key]] = key;
      return acc;
    },
    {}
  );

  return {
    ...rotor,
    name: rotorKey,
    offset,
    connections,
    reverseConnections,
    wiring: rotor.wiring,
    reverseWiring: reverseWiringString(rotor.wiring),
    hasSpunNextRotor: false, // this ensures that the rotor only spins the next rotor once
  };
};

const translate = (
  letterIdx: number,
  rotor: Rotor,
  reverse: boolean
) => {
  let innerPath = "";

  const inputIdx = (letterIdx + rotor.offset) % 26;
  const inputLetter = String.fromCharCode(65 + inputIdx);
  const outputLetter = reverse
    ? rotor.reverseConnections[inputLetter]
    : rotor.connections[inputLetter];
  let outputIdx = outputLetter.charCodeAt(0) - 65;

  outputIdx = (outputIdx - rotor.offset + 26) % 26;
  console.log(
    `${String.fromCharCode(65 + letterIdx)} -> (${String.fromCharCode(
      65 + inputIdx
    )} => ${outputLetter}) -> ${String.fromCharCode(65 + outputIdx)}`
  );
  innerPath +=
    String.fromCharCode(65 + letterIdx) +
    String.fromCharCode(65 + inputIdx) +
    outputLetter +
    String.fromCharCode(65 + outputIdx) +
    ",";
  return { outputIdx, innerPath };
};

const spin = (rotor: Rotor): Rotor => {
  // rotor.wiring = rotateString(rotor.wiring, 1);
  rotor.offset = (rotor.offset + 1) % 26;
  if (rotor.offset > 25 || rotor.offset < 0) {
    throw new Error("Rotor offset out of bounds");
  }
  return rotor;
};

////////////////////////////////////////

export { makeRotor, translate, spin };
