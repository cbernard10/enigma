import React from "react";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rotateString = (str, amount) => {
  return str.slice(amount) + str.slice(0, amount);
};

function StringHighlightLetter({
  str,
  letter,
  alphabetColor,
  highlightColor,
  underlineRingSetting,
}) {
  let highlightNone = false;

  if (!letter || letter === "#") {
    highlightNone = true;
  }

  const letterIdx = str.indexOf(letter);
  const left = str.slice(0, letterIdx);
  const right = str.slice(letterIdx + 1);

  return !highlightNone ? (
    <div className="text-neutral-600 flex flex-col">
      {left.split("").map((char, index) => (
        <span
          key={index}
          style={{
            color: alphabetColor,
            backgroundColor:
              underlineRingSetting && index === 0 ? "#000099" : "",
          }}
        >
          {char}
        </span>
      ))}
      {highlightNone ? (
        <span>{letter}</span>
      ) : (
        <span
          className="font-bold"
          style={{
            color:
              left.length === 0 && underlineRingSetting
                ? highlightColor
                : highlightColor,
            backgroundColor:
              underlineRingSetting && left.length === 0 ? "#000099" : "",
          }}
        >
          {letter}
        </span>
      )}
      {right.split("").map((char, index) => (
        <span key={index} style={{ color: alphabetColor }}>
          {char}
        </span>
      ))}
    </div>
  ) : (
    <div className="text-neutral-600 flex flex-col">
      {str.split("").map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </div>
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
    <div className="flex flex-row font-mono justify-end text-neutral-600 gap-2">
      {/* FORWARD */}
      {rotorSet.rotors.map((rotor, index) => {
        return (
          <div
            className="flex flex-col gap-6 justify-end items-center"
            key={index}
          >
            <div className="text-blue-400 text-end w-fit">{rotor.name}</div>
            <div className="flex flex-col items-center">
              <div className="border border-blue-950 flex flex-row items-center p-2">
                <StringHighlightLetter
                  str={alphabet}
                  letter={splitPaths[index][0]}
                  highlightColor={"#cccccc"}
                />
                <StringHighlightLetter
                  str={rotateString(alphabet, rotor.offset)}
                  letter={splitPaths[index][1]}
                  alphabetColor={"#770000"}
                  highlightColor={"#FF0000"}
                  underlineRingSetting={true}
                />
                <StringHighlightLetter
                  str={rotateString(rotor.wiring, rotor.offset)}
                  letter={splitPaths[index][2]}
                  alphabetColor={"#770000"}
                  highlightColor={"#FF0000"}
                />
                <StringHighlightLetter
                  str={rotateString(alphabet, 0 * rotor.offset)}
                  letter={splitPaths[index][3]}
                  highlightColor={"#cccccc"}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* REFLECTOR */}
      <div className="flex flex-col gap-6 justify-center items-center">
        <div className="text-blue-400 text-end w-fit">
          {rotorSet.reflector.name}
        </div>
        <div className="flex flex-row border border-blue-950 p-2">
          {/* <span>{rotateString(alphabet, 0)}</span>
          <span>{rotorSet.reflector.wiring}</span> */}
          <StringHighlightLetter
            str={alphabet}
            letter={splitPaths[2]?.[3]}
            alphabetColor={"#770077"}
            highlightColor={"#ff00ff"}
          />
          <StringHighlightLetter
            str={rotorSet.reflector.wiring}
            letter={splitPaths[3]?.[0]}
            alphabetColor={"#770077"}
            highlightColor={"#ff00ff"}
          />
        </div>
      </div>

      {/* REVERSE */}

      {rotorSet.rotors
        .slice()
        .reverse()
        .map((rotor, index) => (
          <div
            className="flex flex-col gap-6 justify-center items-center"
            key={index}
          >
            <div className="text-blue-400 text-end w-fit">{rotor.name}</div>
            <div className="flex flex-col items-center">
              <div className="border border-blue-950 flex flex-row p-2">
                <StringHighlightLetter
                  str={alphabet}
                  letter={splitPaths?.[index + 3]?.[0]}
                  highlightColor={"#cccccc"}
                />
                <StringHighlightLetter
                  str={rotateString(alphabet, rotor.offset)}
                  letter={splitPaths?.[index + 3]?.[1]}
                  alphabetColor={"#770000"}
                  highlightColor={"#FF0000"}
                  underlineRingSetting={true}
                />
                <StringHighlightLetter
                  str={rotateString(rotor.reverseWiring, rotor.offset)}
                  letter={splitPaths?.[index + 3]?.[2]}
                  alphabetColor={"#770000"}
                  highlightColor={"#FF0000"}
                />
                <StringHighlightLetter
                  str={alphabet}
                  letter={splitPaths?.[index + 3]?.[3]}
                  highlightColor={"#cccccc"}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default RotorSet;
