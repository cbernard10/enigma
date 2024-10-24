import React from "react";

function History({ history }) {
  const splitSegments = (str, segmentLength) => {
    const segments = [];
    for (let i = 0; i < str.length; i += segmentLength) {
      segments.push(str.slice(i, i + segmentLength));
    }
    return segments;
  };

  const keysPressedSegments = splitSegments(history.keysPressed.join(""), 28);
  const cipherSegments = splitSegments(history.cipher.join(""), 28);

const addSpacesEveryFiveChars = (str) => {
    return str.replace(/(.{4})/g, "$1 ");
};

return (
    <div className="h-full flex items-start font-mono flex-col min-w-full">
        {keysPressedSegments.map((segment, i) => {
            const formattedKeysPressed = addSpacesEveryFiveChars(keysPressedSegments[i]);
            const formattedCipher = addSpacesEveryFiveChars(cipherSegments[i]);
            return (
                <div key={i} className="flex flex-col">
                    <div className="text-neutral-500 select-none">{formattedKeysPressed}</div>
                    <div className="text-white">{formattedCipher}</div>
                </div>
            );
        })}
    </div>
);
}

export default History;
