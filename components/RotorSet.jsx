import React from "react";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rotateString = (str, amount) => {
  return str.slice(amount) + str.slice(0, amount);
};

function StringHighlightLetter({ str, letter }) {
  if (!letter) {
    return <span>{str}</span>;
  }

  const letterIdx = str.indexOf(letter);
  const left = str.slice(0, letterIdx);
  const right = str.slice(letterIdx + 1);

  return (
    <span className="text-neutral-600 text-sm">
      {left}
      <span className="text-green-500 font-bold">{letter}</span>
      {right}
    </span>
  );
}

function RotorSet({ rotorSet, path }) {
  let splitPaths = [];
  if (!path) {
    splitPaths = new Array(rotorSet.rotors.length).fill("");
  } else {
    splitPaths = path.split(",") ?? [];
  }

  return (
    <div className="flex flex-col font-mono justify-end text-neutral-600 gap-2 text-sm">
      {/* FORWARD */}
      {rotorSet.rotors.map((rotor, index) => {
        return (
          <div
            className="flex flex-row gap-6 justify-end items-center"
            key={index}
          >
            <div className="text-blue-400 text-end w-fit">{rotor.name}</div>
            <div className="flex flex-col items-center">
              <div className="border border-blue-950 flex flex-col items-center p-2">
                <StringHighlightLetter
                  str={alphabet}
                  letter={splitPaths[index][0]}
                />
                  <StringHighlightLetter
                    str={rotateString(alphabet, rotor.offset)}
                    letter={splitPaths[index][1]}
                  />
                  <StringHighlightLetter
                    str={rotateString(rotor.wiring, rotor.offset)}
                    letter={splitPaths[index][2]}
                  />
                <StringHighlightLetter
                  str={rotateString(alphabet, 0 * rotor.offset)}
                  letter={splitPaths[index][3]}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* REFLECTOR */}
      <div className="flex flex-row gap-6 justify-end">
        <div className="text-blue-400 text-end w-fit">
          {rotorSet.reflector.name}
        </div>
        <div className="flex flex-col border border-blue-950 p-2">
          {/* <span>{rotateString(alphabet, 0)}</span>
          <span>{rotorSet.reflector.wiring}</span> */}
          <StringHighlightLetter str={alphabet} letter={splitPaths[2]?.[3]} />
          <StringHighlightLetter
            str={rotorSet.reflector.wiring}
            letter={splitPaths[3]?.[0]}
          />
        </div>
      </div>

      {/* REVERSE */}

      {rotorSet.rotors
        .slice()
        .reverse()
        .map((rotor, index) => (
          <div
            className="flex flex-row gap-6 justify-end items-center"
            key={index}
          >
            <div className="text-blue-400 text-end w-fit">{rotor.name}</div>
            <div className="flex flex-col items-center">
              <div className="border border-blue-950 flex flex-col p-2">
                {/* <span>{alphabet}</span> */}
                {/* <span>{rotateString(rotor.reverseWiring, rotor.offset)}</span> */}
                <StringHighlightLetter
                  str={alphabet}
                  letter={splitPaths?.[index + 3]?.[0]}
                />
                <StringHighlightLetter
                  str={rotateString(alphabet, rotor.offset)}
                  letter={splitPaths?.[index + 3]?.[1]}
                />
                <StringHighlightLetter
                  str={rotateString(rotor.reverseWiring, rotor.offset)}
                  letter={splitPaths?.[index + 3]?.[2]}
                />
                <StringHighlightLetter
                  str={alphabet}
                  letter={splitPaths?.[index + 3]?.[3]}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default RotorSet;
