"use client";

import { useEffect, useState } from "react";
import { Rotor, Structure } from "@/src/types";
import RotorSet from "../components/RotorSet";
import Plugboard from "../components/Plugboard";
import History from "../components/History";
import { makePlugboard, translatePlugboard } from "@/src/plugboard";

import {
  makeStructure,
  translateStruct,
  spinRotors,
} from "@/src/rotorStructure";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function Home() {
  const [lastPressed, setLastPressed] = useState(35);
  const [translatedLetter, setTranslatedLetter] = useState("#");

  const [selectedRotors, setSelectedRotors] = useState<string[]>([
    "III",
    "II",
    "I",
  ]);

  const [ringSettings, setRingSettings] = useState("AAA");

  const [structure, setStructure] = useState(
    makeStructure(selectedRotors, "AAA", "B")
  );

  const [plugboard] = useState(makePlugboard("CS DV KU IM LR QY WZ"));

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

  useEffect(() => {
    setStructure(makeStructure(selectedRotors, ringSettings, "B"));
    setHistory((prev) => {
      return {
        keysPressed: [],
        cipher: [],
        path: [],
      };
    });
    setTranslatedLetter("#");
    setLastPressed(35);
  }, [selectedRotors, ringSettings]);

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
        <div className="flex flex-col h-full items-end gap-6 w-1/2 ">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-row font-mono">
              <div className="flex flex-col items-center">
                <span>L rotor</span>
                <Select
                  onValueChange={(value) => {
                    setSelectedRotors((prev) => {
                      prev[2] = value;
                      return [...prev];
                    });
                  }}
                >
                  <SelectTrigger className="w-[100px] rounded-none border-neutral-500">
                    <SelectValue placeholder="I" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="II">II</SelectItem>
                    <SelectItem value="III">III</SelectItem>
                    <SelectItem value="IV">IV</SelectItem>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="VI">VI</SelectItem>
                    <SelectItem value="VII">VII</SelectItem>
                    <SelectItem value="VIII">VIII</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center">
                <span>M rotor</span>
                <Select
                  onValueChange={(value) => {
                    setSelectedRotors((prev) => {
                      prev[1] = value;
                      return [...prev];
                    });
                  }}
                >
                  <SelectTrigger className="w-[100px] rounded-none border-neutral-500">
                    <SelectValue placeholder="II" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="II">II</SelectItem>
                    <SelectItem value="III">III</SelectItem>
                    <SelectItem value="IV">IV</SelectItem>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="VI">VI</SelectItem>
                    <SelectItem value="VII">VII</SelectItem>
                    <SelectItem value="VIII">VIII</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center">
                <span>R rotor</span>
                <Select
                  onValueChange={(value) => {
                    setSelectedRotors((prev) => {
                      prev[0] = value;
                      return [...prev];
                    });
                  }}
                >
                  <SelectTrigger className="w-[100px] rounded-none border-neutral-500">
                    <SelectValue placeholder="III" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="II">II</SelectItem>
                    <SelectItem value="III">III</SelectItem>
                    <SelectItem value="IV">IV</SelectItem>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="VI">VI</SelectItem>
                    <SelectItem value="VII">VII</SelectItem>
                    <SelectItem value="VIII">VIII</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* <div className="flex flex-row font-mono text-xl font-bold">
              {structure.rotors
                .slice()
                .reverse()
                .map((rotor: Rotor, idx: number) => {
                  return (
                    <div key={idx} className="flex flex-row items-end">
                      {`${String.fromCharCode(Math.abs(rotor.offset) + 65)}`}
                    </div>
                  );
                })}
            </div> */}

            <div className="flex flex-row gap-1">
              <Select
                onValueChange={(value) => {
                  setRingSettings(
                    (prev) => `${ringSettings[0]}${ringSettings[1]}${value}`
                  );
                }}
              >
                <SelectTrigger className="w-[50px] rounded-none border-neutral-500">
                  <SelectValue placeholder="A" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {alphabet.split("").map((letter) => {
                    return <SelectItem key={letter} value={letter}>{letter}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => {
                  setRingSettings(
                    (prev) => `${ringSettings[0]}${value}${ringSettings[2]}`
                  );
                }}
              >
                <SelectTrigger className="w-[50px] rounded-none border-neutral-500">
                  <SelectValue placeholder="A" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {alphabet.split("").map((letter) => {
                    return <SelectItem key={letter} value={letter}>{letter}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => {
                  setRingSettings(
                    (prev) => `${value}${ringSettings[1]}${ringSettings[2]}`
                  );
                }}
              >
                <SelectTrigger className="w-[50px] rounded-none border-neutral-500">
                  <SelectValue placeholder="I" />
                </SelectTrigger>
                <SelectContent className="rounded-none w-[50px]">
                  {alphabet.split("").map((letter) => {
                    return <SelectItem key={letter} className="" value={letter}>{letter}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row gap-1">
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
        </div>
        <div className="w-1/2 flex flex-col">
          <History history={history}></History>
        </div>
      </div>
    </div>
  );
}
