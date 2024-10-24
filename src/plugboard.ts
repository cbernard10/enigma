import { Plugboard } from "./types";

// input 'ab cd ef' -> {a: b, c: d, e: f, b: a, d: c, f: e}
const makePlugboard = (connections: string): Plugboard => {
  const output: { [key: string]: string } = {};
  const splitted = connections.split(" ");

  for (const pair of splitted) {
    if (pair.length !== 2) {
      throw new Error(`Invalid plugboard connection: ${pair}`);
    }
    output[pair[0]] = pair[1];
    output[pair[1]] = pair[0];
  }

  return output;
};

const translatePlugboard = (letter: string, plugboard: Plugboard) => {
  letter = letter?.toUpperCase() ?? "";
  return plugboard[letter] || letter;
};

export { makePlugboard, translatePlugboard };
