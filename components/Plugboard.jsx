import React from "react";

function StringHighlightLetter({ str, letter }) {

  if (!letter || letter === "#") {
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

function Plugboard({ plugboard, highlight }) {

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let outputs = "";

  alphabet.split("").forEach((letter) => {
    outputs += plugboard[letter] ?? letter;
  });

  return (
    <div className="flex flex-col font-mono text-neutral-700 text-sm justify-end items-end">
      <div className="flex flex-col items-end border border-yellow-700 p-2 w-fit">
        <StringHighlightLetter
          str={alphabet}
          letter={highlight?.[0]}
        />
        <StringHighlightLetter
          str={outputs}
          letter={highlight?.[1]}
        />
      </div>
    </div>
  );
}

export default Plugboard;
