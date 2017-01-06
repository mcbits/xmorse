import {
    Notify, Listen,
    WPM, VOLUME, CHAR_SPACING, PITCH, LETTERS_ENABLED, NUMBERS_ENABLED,
    SYMBOLS_ENABLED, LETTER, PATTERN_COMPLETE, VOICE_ENABLED, START, STOP,
    TEXT_BUFFER, STORY, OUTPUT
} from "./events";
import { CharacterInfo } from "./morsetable";
import { Query, QueryId, QueryAll } from "./query";

// Page elements
const start = Query<HTMLButtonElement>(".btn-start");
const stop = Query<HTMLButtonElement>(".btn-stop");
const paste = Query(".btn-paste");
const stories = Query(".btn-stories");
const letterElement = Query(".letter");
const outputBuffer = Query(".outputBuffer");
const storyLinks = QueryAll(".story a");

// Settings text labels
const volumeText = Query<HTMLInputElement>(".volumeText");
const charWPMText = Query<HTMLInputElement>(".charWPMText");
const pitchText = Query<HTMLInputElement>(".pitchText");
const charSpacingText = Query<HTMLInputElement>(".charSpacingText");

// Settings inputs
const volume = QueryId<HTMLInputElement>("volume");
const charWPM = QueryId<HTMLInputElement>("charWPM");
const pitch = QueryId<HTMLInputElement>("pitch");
const charSpacing = QueryId<HTMLInputElement>("charSpacing");
const voiceEnabled = QueryId<HTMLInputElement>("voiceEnabled");
const pasteTextBox = QueryId<HTMLTextAreaElement>("pasteText");
const lettersEnabled = QueryId<HTMLInputElement>("lettersEnabled");
const numbersEnabled = QueryId<HTMLInputElement>("numbersEnabled");
const symbolsEnabled = QueryId<HTMLInputElement>("symbolsEnabled");

function view(selector: string) {
    const views = QueryAll(".view");

    for (let i = 0; i < views.length; ++i) {
        const view = views[i];
        if (!view.classList.contains("disabled"))
            view.classList.add("disabled");
    }

    const viewToShow = Query(selector);
    viewToShow.classList.remove("disabled");
}

volume.addEventListener("input",
    () => Notify(VOLUME, parseFloat(volume.value)));

charWPM.addEventListener("input",
    () => Notify(WPM, parseInt(charWPM.value)));

charSpacing.addEventListener("input",
    () => Notify(CHAR_SPACING, parseInt(charSpacing.value)));

pitch.addEventListener("input",
    () => Notify(PITCH, parseInt(pitch.value)));

pasteTextBox.addEventListener("input",
    () => Notify(TEXT_BUFFER, pasteTextBox.value));

voiceEnabled.addEventListener("change",
    () => Notify(VOICE_ENABLED, voiceEnabled.checked));

lettersEnabled.addEventListener("change",
    () => Notify(LETTERS_ENABLED, lettersEnabled.checked));

numbersEnabled.addEventListener("change",
    () => Notify(NUMBERS_ENABLED, numbersEnabled.checked));

symbolsEnabled.addEventListener("change",
    () => Notify(SYMBOLS_ENABLED, symbolsEnabled.checked));

paste.addEventListener("click",
    () => view(".paste"));

stories.addEventListener("click",
    () => view(".stories"));

start.addEventListener("click",
    () => Notify(START, null));

stop.addEventListener("click",
    () => Notify(STOP, null));

for (let i = 0; i < storyLinks.length; ++i) {
    const storyLink = storyLinks[i];
    storyLink.addEventListener("click", (evt: MouseEvent) => {
        evt.preventDefault();
        const anchor = <HTMLAnchorElement>evt.target;
        const href = anchor.href;
        Notify(STORY, href);
    });
}

Listen(START, () => {
    outputBuffer.innerHTML = "";
    view(".view.playing");
    start.disabled = true;
    stop.disabled = false;
});

Listen(STOP, () => {
    letterElement.innerHTML = "";
    start.disabled = false;
    stop.disabled = true;
    view(".view.main");
});

Listen(TEXT_BUFFER,
    (value: string) => pasteTextBox.value = value);

Listen(VOLUME,
    (value: number) => volumeText.value = Math.floor(value * 100).toString());

Listen(WPM,
    (value: number) => charWPMText.value = value.toString());

Listen(CHAR_SPACING,
    (value: number) => charSpacingText.value = value.toString());

Listen(PITCH,
    (value: number) => pitchText.value = value.toString());

Listen(LETTER,
    (value: string) => letterElement.innerHTML = value);

Listen(OUTPUT,
    (value: string) => {
        outputBuffer.innerHTML += value
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    });

Listen(PATTERN_COMPLETE,
    (char: CharacterInfo) => {
        outputBuffer.innerHTML += char == null ? " " : char.name;
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    });

// Trigger events to initialize state
Notify(VOLUME, volume.value);
Notify(WPM, charWPM.value);
Notify(CHAR_SPACING, charSpacing.value);
Notify(VOICE_ENABLED, voiceEnabled.checked);
Notify(PITCH, pitch.value);
Notify(LETTERS_ENABLED, lettersEnabled.checked);
Notify(NUMBERS_ENABLED, numbersEnabled.checked);
Notify(SYMBOLS_ENABLED, symbolsEnabled.checked);
