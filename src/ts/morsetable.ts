export interface Character {
    pattern: string,
    name: string
}

export class Table {
    public lettersEnabled = true;

    public numbersEnabled = false;

    public symbolsEnabled = false;
    
    private letterPatterns: { [char: string]: Character } = {
        "A": {pattern: ".-",     name: "A"},
        "B": {pattern: "-...",   name: "B"},
        "C": {pattern: "-.-.",   name: "C"},
        "D": {pattern: "-..",    name: "D"},
        "E": {pattern: ".",      name: "E"},
        "F": {pattern: "..-.",   name: "F"},
        "G": {pattern: "--.",    name: "G"},
        "H": {pattern: "....",   name: "H"},
        "I": {pattern: "..",     name: "I"},
        "J": {pattern: ".---",   name: "J"},
        "K": {pattern: "-.-",    name: "K"},
        "L": {pattern: ".-..",   name: "L"},
        "M": {pattern: "--",     name: "M"},
        "N": {pattern: "-.",     name: "N"},
        "O": {pattern: "---",    name: "O"},
        "P": {pattern: ".--.",   name: "P"},
        "Q": {pattern: "--.-",   name: "Q"},
        "R": {pattern: ".-.",    name: "R"},
        "S": {pattern: "...",    name: "S"},
        "T": {pattern: "-",      name: "T"},
        "U": {pattern: "..-",    name: "U"},
        "V": {pattern: "...-",   name: "V"},
        "W": {pattern: ".--",    name: "W"},
        "X": {pattern: "-..-",   name: "X"},
        "Y": {pattern: "-.--",   name: "Y"},
        "Z": {pattern: "--..",   name: "Z"}
    };

    private numberPatterns: { [char: string]: Character } = {
        "0": {pattern: "-----",  name: "0"},
        "1": {pattern: ".----",  name: "1"},
        "2": {pattern: "..---",  name: "2"},
        "3": {pattern: "...--",  name: "3"},
        "4": {pattern: "....-",  name: "4"},
        "5": {pattern: ".....",  name: "5"},
        "6": {pattern: "-....",  name: "6"},
        "7": {pattern: "--...",  name: "7"},
        "8": {pattern: "---..",  name: "8"},
        "9": {pattern: "----.",  name: "9"}
    };

    private symbolPatterns: { [char: string]: Character } = {
        ".": {pattern: ".-.-.-", name: "PERIOD"},
        "?": {pattern: "..--..", name: "QUESTION"},
        "!": {pattern: "-.-.--", name: "EXCLAMATION"},
        ",": {pattern: "--..--", name: "COMMA"},
        ":": {pattern: "---...", name: "COLON"},
        ";": {pattern: "-.-.-.", name: "SEMICOLON"},
        "'": {pattern: ".----.", name: "APOSTROPHE"},
        "-": {pattern: "-....-", name: "DASH"},
        "/": {pattern: "-..-.",  name: "SLASH"},
        "(": {pattern: "-.--.",  name: "OPEN BRACKET"},
        ")": {pattern: "-.--.-", name: "CLOSE BRACKET"},
        "@": {pattern: ".--.-.", name: "AT"},
        "=": {pattern: "-...-",  name: "EQUALS"},
        "+": {pattern: ".-.-.",  name: "PLUS"},
        "\"": {pattern: ".-..-.", name: "QUOTE"}
    };

    private letters = Object.keys(this.letterPatterns);

    private numbers = Object.keys(this.numberPatterns);

    private symbols = Object.keys(this.symbolPatterns);

    public randomCharacter(): Character {
        let chars = [];

        if (this.lettersEnabled)
            chars = chars.concat(this.letters);

        if (this.numbersEnabled)
            chars = chars.concat(this.numbers);

        if (this.symbolsEnabled)
            chars = chars.concat(this.symbols);

        if (chars.length > 0) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            return this.letterPatterns[char]
                || this.numberPatterns[char]
                || this.symbolPatterns[char];
        }
        
        throw "No Morse characters are enabled."
    }

    public getCharacter(char: string): Character {
        char = char.toUpperCase();
        let found = this.letterPatterns[char];
        if (found != null)
            return found;
        found = this.numberPatterns[char];
        if (found != null)
            return found;
        found = this.symbolPatterns[char];
        if (found != null)
            return found;
        return undefined;
    }
}
