import { Handle, TEXT_BUFFER } from "./events";
import { CharacterInfo, RandomCharacter, GetCharacter } from "./morsetable";

let textBuffer = "";
let textBufferIndex = -1;

function updateTextBuffer(text: string) {
    textBuffer = text.toUpperCase() + "\n";
    textBufferIndex = textBuffer.length > 0 ? 0 : -1;
}

export function Next(): [ string, CharacterInfo ] {
    if (textBuffer.length > 0) {
        const startingIndex = textBufferIndex - 1;
        let text = "";

        while (textBufferIndex != startingIndex) {
            text += textBuffer[textBufferIndex];
            const morseChar = GetCharacter(textBuffer[textBufferIndex]);

            // Increment and wrap around if necessary
            ++textBufferIndex;
            if (textBufferIndex == textBuffer.length)
                textBufferIndex = 0;

            if (morseChar)
                return [ text, morseChar ];
        }

    }

    const char = RandomCharacter();

    return [ char.name, char ];
}

export function MoveNext() {

}

Handle(TEXT_BUFFER, updateTextBuffer);
