import {
    Trigger, Handle,
    WPM, VOLUME, CHAR_SPACING, PITCH, LETTERS_ENABLED, NUMBERS_ENABLED,
    SYMBOLS_ENABLED, LETTER, PATTERN_COMPLETE, VOICE_ENABLED, START, STOP,
    TEXT_BUFFER
} from "./events";
import { CharacterInfo } from "./morsetable";
import { query, queryId, queryAll } from "./query";
import * as FullScreen from "./fullscreen"; FullScreen

// Page elements
const start = query<HTMLButtonElement>(".btn-start");
const stop = query<HTMLButtonElement>(".btn-stop");
const paste = query<HTMLButtonElement>(".btn-paste");
const stories = query<HTMLButtonElement>(".btn-stories");
const letterElement = query<HTMLElement>(".letter");
const outputBuffer = query<HTMLElement>(".outputBuffer");

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

export function init() {
    volume.addEventListener("input", () => {
        const value = parseFloat(volume.value);
        Trigger(VOLUME, value);
        volumeText.value = Math.floor(value * 100).toString();
    });

    charWPM.addEventListener("input", () => {
        const value = parseInt(charWPM.value);
        Trigger(WPM, value);
        charWPMText.value = value.toString();
    });

    charSpacing.addEventListener("input", () => {
        const value = parseInt(charSpacing.value);
        Trigger(CHAR_SPACING, value);
        charSpacingText.value = value.toString();
    });

    pitch.addEventListener("input", () => {
        const value = parseInt(pitch.value);
        Trigger(PITCH, value);
        pitchText.value = value.toString();
    });

    pasteTextBox.addEventListener("input", () =>
        Trigger(TEXT_BUFFER, pasteTextBox.value));

    voiceEnabled.addEventListener("change", () =>
        Trigger(VOICE_ENABLED, voiceEnabled.checked));

    lettersEnabled.addEventListener("change", () =>
        Trigger(LETTERS_ENABLED, lettersEnabled.checked));

    numbersEnabled.addEventListener("change", () =>
        Trigger(NUMBERS_ENABLED, numbersEnabled.checked));

    symbolsEnabled.addEventListener("change", () =>
        Trigger(SYMBOLS_ENABLED, numbersEnabled.checked));

    start.addEventListener("click", () => {
        view(".view.playing");
        start.disabled = true;
        stop.disabled = false;
        document.dispatchEvent(new Event(START));
    });

    stop.addEventListener("click", () => {
        document.dispatchEvent(new Event(STOP));
        letterElement.innerHTML = "";
        start.disabled = false;
        stop.disabled = true;
        view(".view.main");
    });

    paste.addEventListener("click", () =>
        view(".paste"));

    stories.addEventListener("click", () =>
        view(".stories"));

    Handle(LETTER, (value: string) =>
        letterElement.innerHTML = value);

    Handle(PATTERN_COMPLETE, (char: CharacterInfo) => {
        outputBuffer.innerHTML += char == null ? " " : char.name;
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    });

    Trigger(VOLUME, volume.value);
    Trigger(WPM, charWPM.value);
    Trigger(CHAR_SPACING, charSpacing.value);
    Trigger(VOICE_ENABLED, voiceEnabled.checked);
    Trigger(PITCH, pitch.value);
    Trigger(LETTERS_ENABLED, lettersEnabled.checked);
    Trigger(NUMBERS_ENABLED, numbersEnabled.checked);
    Trigger(SYMBOLS_ENABLED, symbolsEnabled.checked);
}
