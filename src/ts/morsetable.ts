import { Listen, LETTERS_ENABLED, NUMBERS_ENABLED, SYMBOLS_ENABLED } from "./events";

export interface CharacterInfo {
    name: string;
    pattern: string;
    fileName: string;
}

const letterPatterns: { [char: string]: CharacterInfo } = {
    "A": { name: "A", pattern: ".-", fileName: "A.mp3" },
    "B": { name: "B", pattern: "-...", fileName: "B.mp3" },
    "C": { name: "C", pattern: "-.-.", fileName: "C.mp3" },
    "D": { name: "D", pattern: "-..", fileName: "D.mp3" },
    "E": { name: "E", pattern: ".", fileName: "E.mp3" },
    "F": { name: "F", pattern: "..-.", fileName: "F.mp3" },
    "G": { name: "G", pattern: "--.", fileName: "G.mp3" },
    "H": { name: "H", pattern: "....", fileName: "H.mp3" },
    "I": { name: "I", pattern: "..", fileName: "I.mp3" },
    "J": { name: "J", pattern: ".---", fileName: "J.mp3" },
    "K": { name: "K", pattern: "-.-", fileName: "K.mp3" },
    "L": { name: "L", pattern: ".-..", fileName: "L.mp3" },
    "M": { name: "M", pattern: "--", fileName: "M.mp3" },
    "N": { name: "N", pattern: "-.", fileName: "N.mp3" },
    "O": { name: "O", pattern: "---", fileName: "O.mp3" },
    "P": { name: "P", pattern: ".--.", fileName: "P.mp3" },
    "Q": { name: "Q", pattern: "--.-", fileName: "Q.mp3" },
    "R": { name: "R", pattern: ".-.", fileName: "R.mp3" },
    "S": { name: "S", pattern: "...", fileName: "S.mp3" },
    "T": { name: "T", pattern: "-", fileName: "T.mp3" },
    "U": { name: "U", pattern: "..-", fileName: "U.mp3" },
    "V": { name: "V", pattern: "...-", fileName: "V.mp3" },
    "W": { name: "W", pattern: ".--", fileName: "W.mp3" },
    "X": { name: "X", pattern: "-..-", fileName: "X.mp3" },
    "Y": { name: "Y", pattern: "-.--", fileName: "Y.mp3" },
    "Z": { name: "Z", pattern: "--..", fileName: "Z.mp3" }
};

const numberPatterns: { [char: string]: CharacterInfo } = {
    "0": { name: "0", pattern: "-----", fileName: "0.mp3" },
    "1": { name: "1", pattern: ".----", fileName: "1.mp3" },
    "2": { name: "2", pattern: "..---", fileName: "2.mp3" },
    "3": { name: "3", pattern: "...--", fileName: "3.mp3" },
    "4": { name: "4", pattern: "....-", fileName: "4.mp3" },
    "5": { name: "5", pattern: ".....", fileName: "5.mp3" },
    "6": { name: "6", pattern: "-....", fileName: "6.mp3" },
    "7": { name: "7", pattern: "--...", fileName: "7.mp3" },
    "8": { name: "8", pattern: "---..", fileName: "8.mp3" },
    "9": { name: "9", pattern: "----.", fileName: "9.mp3" }
};

const symbolPatterns: { [char: string]: CharacterInfo } = {
    ".": { name: ".", pattern: ".-.-.-", fileName: "PERIOD.mp3" },
    "?": { name: "?", pattern: "..--..", fileName: "QUESTION.mp3" },
    "!": { name: "!", pattern: "-.-.--", fileName: "EXCLAMATION.mp3" },
    ",": { name: ",", pattern: "--..--", fileName: "COMMA.mp3" },
    ":": { name: ":", pattern: "---...", fileName: "COLON.mp3" },
    ";": { name: ";", pattern: "-.-.-.", fileName: "SEMICOLON.mp3" },
    "'": { name: "'", pattern: ".----.", fileName: "APOSTROPHE.mp3" },
    "-": { name: "-", pattern: "-....-", fileName: "DASH.mp3" },
    "/": { name: "/", pattern: "-..-.", fileName: "SLASH.mp3" },
    "(": { name: "(", pattern: "-.--.", fileName: "OPEN_BRACKET.mp3" },
    ")": { name: ")", pattern: "-.--.-", fileName: "CLOSE_BRACKET.mp3" },
    "@": { name: "@", pattern: ".--.-.", fileName: "AT.mp3" },
    "=": { name: "=", pattern: "-...-", fileName: "EQUALS.mp3" },
    "+": { name: "+", pattern: ".-.-.", fileName: "PLUS.mp3" },
    "\"": { name: "\"", pattern: ".-..-.", fileName: "QUOTE.mp3" }
};

const letters = Object.keys(letterPatterns);

const numbers = Object.keys(numberPatterns);

const symbols = Object.keys(symbolPatterns);

let lettersEnabled = true;

let numbersEnabled = false;

let symbolsEnabled = false;

export function RandomCharacter(): CharacterInfo {
    let chars = [];

    if (lettersEnabled)
        chars = chars.concat(letters);

    if (numbersEnabled)
        chars = chars.concat(numbers);

    if (symbolsEnabled)
        chars = chars.concat(symbols);

    if (chars.length > 0) {
        const char = chars[Math.floor(Math.random() * chars.length)];

        return letterPatterns[char] || numberPatterns[char] || symbolPatterns[char];
    }

    return null;
}

export function GetCharacter(char: string): CharacterInfo {
    char = char.toUpperCase();

    let found = letterPatterns[char];
    if (found)
        return found;

    found = numberPatterns[char];
    if (found)
        return found;

    found = symbolPatterns[char];
    if (found)
        return found;

    return undefined;
}

Listen(LETTERS_ENABLED, (value: boolean) => lettersEnabled = value);
Listen(NUMBERS_ENABLED, (value: boolean) => numbersEnabled = value);
Listen(SYMBOLS_ENABLED, (value: boolean) => symbolsEnabled = value);
