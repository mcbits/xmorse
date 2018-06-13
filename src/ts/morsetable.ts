export const enum CharType
{
	None = 0,
	WhiteSpace = 1,
	Letter = 2,
	Number = 4,
	Symbol = 8
}

export class Char
{
	public type: CharType;
	public name: string;
	public pattern: string;
	public voiceFileName?: string;
	public voiceAudioBuffer?: AudioBuffer;
	public toneAudioBuffer?: AudioBuffer;

	constructor(charType, name, pattern, voiceFileName?)
	{
		this.type = charType;
		this.name = name;
		this.pattern = pattern;

		if (voiceFileName)
			this.voiceFileName = voiceFileName;
	}
}

// 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z . ? ! , : ; ' - / ( ) @ = + "
const lookup: { [char: string]: Char } = {
	"":  new Char(CharType.WhiteSpace, "", ""),
	" ": new Char(CharType.WhiteSpace, " ", " "),
	"A": new Char(CharType.Letter, "A", ".-", "A.mp3"),
	"B": new Char(CharType.Letter, "B", "-...", "B.mp3"),
	"C": new Char(CharType.Letter, "C", "-.-.", "C.mp3"),
	"D": new Char(CharType.Letter, "D", "-..", "D.mp3"),
	"E": new Char(CharType.Letter, "E", ".", "E.mp3"),
	"F": new Char(CharType.Letter, "F", "..-.", "F.mp3"),
	"G": new Char(CharType.Letter, "G", "--.", "G.mp3"),
	"H": new Char(CharType.Letter, "H", "....", "H.mp3"),
	"I": new Char(CharType.Letter, "I", "..", "I.mp3"),
	"J": new Char(CharType.Letter, "J", ".---", "J.mp3"),
	"K": new Char(CharType.Letter, "K", "-.-", "K.mp3"),
	"L": new Char(CharType.Letter, "L", ".-..", "L.mp3"),
	"M": new Char(CharType.Letter, "M", "--", "M.mp3"),
	"N": new Char(CharType.Letter, "N", "-.", "N.mp3"),
	"O": new Char(CharType.Letter, "O", "---", "O.mp3"),
	"P": new Char(CharType.Letter, "P", ".--.", "P.mp3"),
	"Q": new Char(CharType.Letter, "Q", "--.-", "Q.mp3"),
	"R": new Char(CharType.Letter, "R", ".-.", "R.mp3"),
	"S": new Char(CharType.Letter, "S", "...", "S.mp3"),
	"T": new Char(CharType.Letter, "T", "-", "T.mp3"),
	"U": new Char(CharType.Letter, "U", "..-", "U.mp3"),
	"V": new Char(CharType.Letter, "V", "...-", "V.mp3"),
	"W": new Char(CharType.Letter, "W", ".--", "W.mp3"),
	"X": new Char(CharType.Letter, "X", "-..-", "X.mp3"),
	"Y": new Char(CharType.Letter, "Y", "-.--", "Y.mp3"),
	"Z": new Char(CharType.Letter, "Z", "--..", "Z.mp3"),
	"0": new Char(CharType.Number, "0", "-----", "0.mp3"),
	"1": new Char(CharType.Number, "1", ".----", "1.mp3"),
	"2": new Char(CharType.Number, "2", "..---", "2.mp3"),
	"3": new Char(CharType.Number, "3", "...--", "3.mp3"),
	"4": new Char(CharType.Number, "4", "....-", "4.mp3"),
	"5": new Char(CharType.Number, "5", ".....", "5.mp3"),
	"6": new Char(CharType.Number, "6", "-....", "6.mp3"),
	"7": new Char(CharType.Number, "7", "--...", "7.mp3"),
	"8": new Char(CharType.Number, "8", "---..", "8.mp3"),
	"9": new Char(CharType.Number, "9", "----.", "9.mp3"),
	".": new Char(CharType.Symbol, ".", ".-.-.-", "PERIOD.mp3"),
	"?": new Char(CharType.Symbol, "?", "..--..", "QUESTION.mp3"),
	"!": new Char(CharType.Symbol, "!", "-.-.--", "EXCLAMATION.mp3"),
	",": new Char(CharType.Symbol, ",", "--..--", "COMMA.mp3"),
	":": new Char(CharType.Symbol, ":", "---...", "COLON.mp3"),
	";": new Char(CharType.Symbol, ";", "-.-.-.", "SEMICOLON.mp3"),
	"'": new Char(CharType.Symbol, "'", ".----.", "APOSTROPHE.mp3"),
	"-": new Char(CharType.Symbol, "-", "-....-", "DASH.mp3"),
	"/": new Char(CharType.Symbol, "/", "-..-.", "SLASH.mp3"),
	"(": new Char(CharType.Symbol, "(", "-.--.", "OPEN_BRACKET.mp3"),
	")": new Char(CharType.Symbol, ")", "-.--.-", "CLOSE_BRACKET.mp3"),
	"@": new Char(CharType.Symbol, "@", ".--.-.", "AT.mp3"),
	"=": new Char(CharType.Symbol, "=", "-...-", "EQUALS.mp3"),
	"+": new Char(CharType.Symbol, "+", ".-.-.", "PLUS.mp3"),
	"\"": new Char(CharType.Symbol, "\"", ".-..-.", "QUOTE.mp3"),
};

export const allCharacters = Object.values(lookup).filter(char => char.type & (CharType.Letter | CharType.Number | CharType.Symbol));

let enabledCharTypes: CharType = CharType.None;

let enabledCharacters: Char[] = [];

export function RandomCharacter(): Char
{
	const chars = Object.values(lookup).filter(char => char.type & enabledCharTypes);

	if (chars.length > 0)
		return chars[Math.floor(Math.random() * chars.length)];

	return lookup[""];
}

export function GetCharacter(char: string): Char
{
	char = char.toUpperCase();

	return (lookup[char])
		? lookup[char]
		: undefined;
}

export function EnableCharType(charType: CharType, value: boolean): void
{
	enabledCharTypes ^= (-value ^ enabledCharTypes) & charType;
}
