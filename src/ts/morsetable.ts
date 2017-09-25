/// <reference path="events.ts"/>

namespace Morse
{
	export interface Char
	{
		name: string;
		pattern: string;
	}

	// 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z . ? ! , : ; ' - / ( ) @ = + "

	const letterPatterns: { [char: string]: Char } = {
		"A": { name: "A", pattern: ".-" },
		"B": { name: "B", pattern: "-..." },
		"C": { name: "C", pattern: "-.-." },
		"D": { name: "D", pattern: "-.." },
		"E": { name: "E", pattern: "." },
		"F": { name: "F", pattern: "..-." },
		"G": { name: "G", pattern: "--." },
		"H": { name: "H", pattern: "...." },
		"I": { name: "I", pattern: ".." },
		"J": { name: "J", pattern: ".---" },
		"K": { name: "K", pattern: "-.-" },
		"L": { name: "L", pattern: ".-.." },
		"M": { name: "M", pattern: "--" },
		"N": { name: "N", pattern: "-." },
		"O": { name: "O", pattern: "---" },
		"P": { name: "P", pattern: ".--." },
		"Q": { name: "Q", pattern: "--.-" },
		"R": { name: "R", pattern: ".-." },
		"S": { name: "S", pattern: "..." },
		"T": { name: "T", pattern: "-" },
		"U": { name: "U", pattern: "..-" },
		"V": { name: "V", pattern: "...-" },
		"W": { name: "W", pattern: ".--" },
		"X": { name: "X", pattern: "-..-" },
		"Y": { name: "Y", pattern: "-.--" },
		"Z": { name: "Z", pattern: "--.." }
	};

	const numberPatterns: { [char: string]: Char } = {
		"0": { name: "0", pattern: "-----" },
		"1": { name: "1", pattern: ".----" },
		"2": { name: "2", pattern: "..---" },
		"3": { name: "3", pattern: "...--" },
		"4": { name: "4", pattern: "....-" },
		"5": { name: "5", pattern: "....." },
		"6": { name: "6", pattern: "-...." },
		"7": { name: "7", pattern: "--..." },
		"8": { name: "8", pattern: "---.." },
		"9": { name: "9", pattern: "----." }
	};

	const symbolPatterns: { [char: string]: Char } = {
		".": { name: ".", pattern: ".-.-.-" },
		"?": { name: "?", pattern: "..--.." },
		"!": { name: "!", pattern: "-.-.--" },
		",": { name: ",", pattern: "--..--" },
		":": { name: ":", pattern: "---..." },
		";": { name: ";", pattern: "-.-.-." },
		"'": { name: "'", pattern: ".----." },
		"-": { name: "-", pattern: "-....-" },
		"/": { name: "/", pattern: "-..-." },
		"(": { name: "(", pattern: "-.--." },
		")": { name: ")", pattern: "-.--.-" },
		"@": { name: "@", pattern: ".--.-." },
		"=": { name: "=", pattern: "-...-" },
		"+": { name: "+", pattern: ".-.-." },
		"\"": { name: "\"", pattern: ".-..-." }
	};

	const symbolNames: { [char: string]: string } = {
		".": "PERIOD",
		"?": "QUESTION",
		"!": "EXCLAMATION",
		",": "COMMA",
		":": "COLON",
		";": "SEMICOLON",
		"'": "APOSTROPHE",
		"-": "DASH",
		"/": "SLASH",
		"(": "OPEN_BRACKET",
		")": "CLOSE_BRACKET",
		"@": "AT",
		"=": "EQUALS",
		"+": "PLUS",
		"\"": "QUOTE"
	};

	const letters = Object.keys(letterPatterns);

	const numbers = Object.keys(numberPatterns);

	const symbols = Object.keys(symbolPatterns);

	let lettersEnabled = true;

	let numbersEnabled = false;

	let symbolsEnabled = false;

	export function RandomCharacter(): Char
	{
		let chars = [];

		if (lettersEnabled)
			chars = chars.concat(letters);

		if (numbersEnabled)
			chars = chars.concat(numbers);

		if (symbolsEnabled)
			chars = chars.concat(symbols);

		if (chars.length > 0)
		{
			const char = chars[Math.floor(Math.random() * chars.length)];

			return letterPatterns[char] || numberPatterns[char] || symbolPatterns[char];
		}

		return null;
	}

	export function GetCharacter(char: string): Char
	{
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

	export function fileName(char: Char)
	{
		let fileName = symbolNames[char.name];

		if (!fileName)
			fileName = char.name;

		fileName += ".mp3";

		return fileName;
	}

	Listen(SET_LETTERS, (value: boolean) => lettersEnabled = value);
	Listen(SET_NUMBERS, (value: boolean) => numbersEnabled = value);
	Listen(SET_SYMBOLS, (value: boolean) => symbolsEnabled = value);
}
