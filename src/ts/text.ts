import { Listen, Notify, START, STORY, TEXT_BUFFER } from "./events";
import { CharacterInfo, RandomCharacter, GetCharacter } from "./morsetable";
import { Load } from "./xhr";

let textBuffer = "";
let textBufferIndex = -1;

function updateTextBuffer(text: string) {
    textBuffer = text.toUpperCase() + "\n";
    textBufferIndex = textBuffer.length > 0 ? 0 : -1;
}

async function loadBook(href: string) {
    const response = await Load(href, "text");

    Notify(TEXT_BUFFER, response);
    Notify(START, null);
}

export function Next(): [string, CharacterInfo] {
    if (textBuffer.length > 0) {
        const startingIndex = textBufferIndex;
        let text = "";

        do {
            text += textBuffer[textBufferIndex];
            const morseChar = GetCharacter(textBuffer[textBufferIndex]);

            // Increment and wrap around if necessary
            ++textBufferIndex;
            if (textBufferIndex === textBuffer.length)
                textBufferIndex = 0;

            if (morseChar)
                return [text, morseChar];
        }
        while (textBufferIndex !== startingIndex);

        return ["", null];
    }

    const char = RandomCharacter();

    return [char.name, char];
}

Listen(TEXT_BUFFER, updateTextBuffer);
Listen(STORY, loadBook);
