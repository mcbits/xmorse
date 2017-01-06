import {
    Trigger, Handle,
    WPM, VOLUME, CHAR_SPACING, PITCH, LETTERS_ENABLED, NUMBERS_ENABLED,
    SYMBOLS_ENABLED, LETTER, PATTERN_COMPLETE, VOICE_ENABLED, START, STOP,
    TEXT_BUFFER, BOOK, OUTPUT
} from "./events";
import { CharacterInfo } from "./morsetable";
import { query, queryId, queryAll } from "./query";

// Page elements
const start = query<HTMLButtonElement>(".btn-start");
const stop = query<HTMLButtonElement>(".btn-stop");
const paste = query<HTMLButtonElement>(".btn-paste");
const stories = query<HTMLButtonElement>(".btn-stories");
const letterElement = query<HTMLElement>(".letter");
const outputBuffer = query<HTMLElement>(".outputBuffer");
const bookLinks = queryAll<HTMLAnchorElement>(".story a");

// Settings text labels
const volumeText = query<HTMLInputElement>(".volumeText");
const charWPMText = query<HTMLInputElement>(".charWPMText");
const pitchText = query<HTMLInputElement>(".pitchText");
const charSpacingText = query<HTMLInputElement>(".charSpacingText");

// Settings inputs
const volume = queryId<HTMLInputElement>("volume");
const charWPM = queryId<HTMLInputElement>("charWPM");
const pitch = queryId<HTMLInputElement>("pitch");
const charSpacing = queryId<HTMLInputElement>("charSpacing");
const voiceEnabled = queryId<HTMLInputElement>("voiceEnabled");
const pasteTextBox = queryId<HTMLTextAreaElement>("pasteText");
const lettersEnabled = queryId<HTMLInputElement>("lettersEnabled");
const numbersEnabled = queryId<HTMLInputElement>("numbersEnabled");
const symbolsEnabled = queryId<HTMLInputElement>("symbolsEnabled");

function view(selector: string) {
    const views = document.querySelectorAll(".view");

    for (let i = 0; i < views.length; ++i) {
        const view = views[i];
        if (!view.classList.contains("disabled"))
            view.classList.add("disabled");
    }

    const viewToShow = document.querySelector(selector);
    viewToShow.classList.remove("disabled");
}

volume.addEventListener("input",
    () => Trigger(VOLUME, parseFloat(volume.value)));

charWPM.addEventListener("input",
    () => Trigger(WPM, parseInt(charWPM.value)));

charSpacing.addEventListener("input",
    () => Trigger(CHAR_SPACING, parseInt(charSpacing.value)));

pitch.addEventListener("input",
    () => Trigger(PITCH, parseInt(pitch.value)));

pasteTextBox.addEventListener("input",
    () => Trigger(TEXT_BUFFER, pasteTextBox.value));

voiceEnabled.addEventListener("change",
    () => Trigger(VOICE_ENABLED, voiceEnabled.checked));

lettersEnabled.addEventListener("change",
    () => Trigger(LETTERS_ENABLED, lettersEnabled.checked));

numbersEnabled.addEventListener("change",
    () => Trigger(NUMBERS_ENABLED, numbersEnabled.checked));

symbolsEnabled.addEventListener("change",
    () => Trigger(SYMBOLS_ENABLED, symbolsEnabled.checked));

paste.addEventListener("click",
    () => view(".paste"));

stories.addEventListener("click",
    () => view(".stories"));

start.addEventListener("click",
    () => Trigger(START, null));

stop.addEventListener("click",
    () => Trigger(STOP, null));

for (let i = 0; i < bookLinks.length; ++i) {
    const bookLink = bookLinks[i];
    bookLink.addEventListener("click", (evt: MouseEvent) => {
        evt.preventDefault();
        const anchor = <HTMLAnchorElement>evt.target;
        const href = anchor.href;
        Trigger(BOOK, href);
    });
}

Handle(START, () => {
    outputBuffer.innerHTML = "";
    view(".view.playing");
    start.disabled = true;
    stop.disabled = false;
});

Handle(STOP, () => {
    letterElement.innerHTML = "";
    start.disabled = false;
    stop.disabled = true;
    view(".view.main");
});

Handle(TEXT_BUFFER,
    (value: string) => pasteTextBox.value = value);

Handle(VOLUME,
    (value: number) => volumeText.value = Math.floor(value * 100).toString());

Handle(WPM,
    (value: number) => charWPMText.value = value.toString());

Handle(CHAR_SPACING,
    (value: number) => charSpacingText.value = value.toString());

Handle(PITCH,
    (value: number) => pitchText.value = value.toString());

Handle(LETTER,
    (value: string) => letterElement.innerHTML = value);

Handle(OUTPUT,
    (value: string) => {
        outputBuffer.innerHTML += value
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    });

Handle(PATTERN_COMPLETE,
    (char: CharacterInfo) => {
        outputBuffer.innerHTML += char == null ? " " : char.name;
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    });

// Trigger events to initialize state
Trigger(VOLUME, volume.value);
Trigger(WPM, charWPM.value);
Trigger(CHAR_SPACING, charSpacing.value);
Trigger(VOICE_ENABLED, voiceEnabled.checked);
Trigger(PITCH, pitch.value);
Trigger(LETTERS_ENABLED, lettersEnabled.checked);
Trigger(NUMBERS_ENABLED, numbersEnabled.checked);
Trigger(SYMBOLS_ENABLED, symbolsEnabled.checked);
