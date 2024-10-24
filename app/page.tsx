"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Rotor, Structure } from "@/src/types";
import RotorSet from "../components/RotorSet";
import Plugboard from "../components/Plugboard";
import History from "../components/History";
import { makePlugboard, translatePlugboard } from "@/src/plugboard";

// import { makeRotor, spin, translate } from "@/src/rotors";
import {
  makeStructure,
  translateStruct,
  spinRotors,
} from "@/src/rotorStructure";
import { translate } from "@/src/rotors";
// const structure = config

export default function Home() {
  const [lastPressed, setLastPressed] = useState(35);
  const [translatedLetter, setTranslatedLetter] = useState("#");

  const [structure, setStructure] = useState(
    makeStructure(["III", "II", "I"], "AAA", "B")
  );

  const [plugboard, setPlugboard] = useState(
    makePlugboard("CS DV KU IM LR QY WZ")
  );

  const [history, setHistory] = useState<{
    keysPressed: string[];
    cipher: string[];
    path: string[];
  }>({
    keysPressed: [],
    cipher: [],
    path: [],
  });

  const letter = String.fromCharCode(lastPressed);

  const handleTranslate = (letter: string, structure: Structure) => {
    // rotors are spun BEFORE electricity goes through
    const newStructure = spinRotors(structure);

    // swap letters using the plugboard
    const plugBoardTranslated = translatePlugboard(letter, plugboard);

    // translate letter and swap with plugboard
    const translated = translatePlugboard(
      translateStruct(plugBoardTranslated, newStructure),
      plugboard
    );

    // update state
    setStructure({ ...newStructure });
    setTranslatedLetter(translated);

    setHistory((prev) => {
      return {
        keysPressed: [...prev.keysPressed, letter],
        cipher: [...prev.cipher, translated],
        path: [...prev.path, structure.path],
      };
    });

    return translated;
  };

  interface KeyDownEvent extends KeyboardEvent {
    keyCode: number;
  }

  function handleKeyDown(e: KeyDownEvent): void {
    if (e.keyCode < 65 || e.keyCode > 90) return;
    setLastPressed(e.keyCode);
    const letter = String.fromCharCode(e.keyCode);
    handleTranslate(letter, structure);
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [structure]);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen pt-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {lastPressed && (
        <div className="text-4xl font-bold text-center text-white flex flex-col">
          <span>
            {letter} {"->"} {translatedLetter}
          </span>
          <div className="font-mono">
            <span className="text-green-500">{letter}</span>
            <span className="text-blue-400">
              {structure.path.slice(0, structure.rotors.length)}
            </span>
            <span className="text-red-400">
              {structure.path.slice(
                structure.rotors.length,
                structure.rotors.length + 2
              )}
            </span>
            <span className="text-blue-400">
              {structure.path.slice(structure.rotors.length + 2)}
            </span>

            <span className="text-green-500">{translatedLetter}</span>
          </div>
        </div>
      )}
      <div className="flex flex-row items-start gap-16 h-full w-full justify-center">
        <div className="w-1/2 flex flex-row h-full justify-end">
          <div className="flex flex-col justify-end">
            <div className="flex flex-row font-mono">
              {structure.rotors
                .slice()
                .reverse()
                .map((rotor: Rotor, idx: number) => {
                  return (
                    <div key={idx} className="flex flex-row items-end">
                      {/* {String.fromCharCode(rotor.offset + 25)} */}
                      {`${Math.abs(+rotor.offset)}\- `}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Plugboard
              plugboard={plugboard}
              highlight={letter + translatePlugboard(letter, plugboard)}
            ></Plugboard>
            <RotorSet
              rotorSet={structure}
              path={structure.innerPath}
            ></RotorSet>
            <Plugboard
              plugboard={plugboard}
              highlight={
                translatedLetter !== "#"
                  ? structure.innerPath?.split(",")[5][3] +
                    translatePlugboard(
                      structure.innerPath?.split(",")[5][3],
                      plugboard
                    )
                  : ""
              }
            ></Plugboard>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <History history={history}></History>
        </div>
      </div>
    </div>
  );
}
