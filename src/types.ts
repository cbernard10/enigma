export type Rotor = {
  turnover: string[];
  offset: number;
  connections: Connections;
  reverseConnections: Connections;
  name: string;
  hasSpunNextRotor: boolean;
  wiring: string;
  reverseWiring: string;
};

export type Reflector = {
  wiring: string;
  name: string;
  connections: Connections;
};

export type Structure = {
  rotors: Rotor[];
  reflector: Reflector;
  path: string;
  innerPath: string;
};

export type Plugboard = { [key: string]: string };

export type Connections = { [key: string]: string };
