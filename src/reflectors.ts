import { Reflector, Connections } from "./types";

const reflectors = {
  B: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
  "UKW-B": "ENKQAUYWJICOPBLMDXZVFTHRGS",
  "UKW-C": "RDOBJNTKVEHMLFCWZAXGYIPSUQ",
};

const wiringStringToConnections = (wiring: string): Connections => {
  const connections: Connections = {};

  for (let i = 0; i < wiring.length; i++) {
    connections[String.fromCharCode(65 + i)] = wiring[i];
    connections[wiring[i]] = String.fromCharCode(65 + i);
  }

  return connections;
};

const makeReflector = (reflectorKey: string): Reflector => {
  const reflector = reflectors[reflectorKey as keyof typeof reflectors];

  if (!reflector) {
    throw new Error(`Reflector ${reflectorKey} not found`);
  }

  return {
    wiring: reflector,
    connections: wiringStringToConnections(reflector),
    name: reflectorKey,
  };
};

export default makeReflector;
