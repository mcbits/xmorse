import { CharacterInfo } from "./morsetable";
import { query, queryId, queryAll } from "./query";

// Page elements
const startButton = query<HTMLButtonElement>(".btn-start");
const stopButton = query<HTMLButtonElement>(".btn-stop");
const pasteButton = query<HTMLButtonElement>(".btn-paste");
const storiesButton = query<HTMLButtonElement>(".btn-stories");
const letterElement = query<HTMLElement>(".letter");
const outputBufferElement = query<HTMLElement>(".outputBuffer");

// Settings text labels
const volumeText = query<HTMLInputElement>(".volumeText");
const charWPMText = query<HTMLInputElement>(".charWPMText");
const pitchText = query<HTMLInputElement>(".pitchText");
const charSpacingText = query<HTMLInputElement>(".charSpacingText");

// Settings inputs
const volumeSlider = queryId<HTMLInputElement>("volume");
const charWPMSlider = queryId<HTMLInputElement>("charWPM");
const pitchSlider = queryId<HTMLInputElement>("pitch");
const charSpacingSlider = queryId<HTMLInputElement>("charSpacing");
const voiceEnabledCheckbox = queryId<HTMLInputElement>("voiceEnabled");
const pasteTextBox = queryId<HTMLTextAreaElement>("pasteText");
const lettersEnabledCheckbox = queryId<HTMLInputElement>("lettersEnabled");
const numbersEnabledCheckbox = queryId<HTMLInputElement>("numbersEnabled");
const symbolsEnabledCheckbox = queryId<HTMLInputElement>("symbolsEnabled");

function fullScreenAvailable() {
    return document.fullscreenEnabled
        || document["webkitFullscreenEnabled"]
        || document["mozFullScreenEnabled"];
}

function showPasteView() {
    view(".paste");
}

function showStoriesView() {
    view(".stories");
}

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
    volumeSlider.addEventListener("input", () => {
        const value = parseFloat(volumeSlider.value);
        document.dispatchEvent(new CustomEvent("volumechange", { detail: value }));
        volumeText.value = Math.floor(value * 100).toString();
    });

    charWPMSlider.addEventListener("input", () => {
        const value = parseInt(charWPMSlider.value);
        document.dispatchEvent(new CustomEvent("wpmchange", { detail: value }));
        charWPMText.value = value.toString();
    });

    charSpacingSlider.addEventListener("input", () => {
        const value = parseInt(charSpacingSlider.value);
        document.dispatchEvent(new CustomEvent("charspacingchange", { detail: value }));
        charSpacingText.value = value.toString();
    });

    pitchSlider.addEventListener("input", () => {
        const value = parseInt(pitchSlider.value);
        document.dispatchEvent(new CustomEvent("pitchchange", { detail: value }));
        pitchText.value = value.toString();
    });

    pasteTextBox.addEventListener("input", () =>
        document.dispatchEvent(new CustomEvent("textbufferchange", { detail: pasteTextBox.value })));

    voiceEnabledCheckbox.addEventListener("change", () =>
        document.dispatchEvent(new CustomEvent("voiceenabledchange", { detail: voiceEnabledCheckbox.checked })));

    lettersEnabledCheckbox.addEventListener("change", () =>
        document.dispatchEvent(new CustomEvent("lettersenabledchange", { detail: lettersEnabledCheckbox.checked })));

    numbersEnabledCheckbox.addEventListener("change", () =>
        document.dispatchEvent(new CustomEvent("numbersenabledchange", { detail: numbersEnabledCheckbox.checked })));

    symbolsEnabledCheckbox.addEventListener("change", () =>
        document.dispatchEvent(new CustomEvent("symbolsenabledchange", { detail: numbersEnabledCheckbox.checked })));

    document.addEventListener("patterncomplete", (evt: CustomEvent) => {
        const char = <CharacterInfo>evt.detail;

        outputBufferElement.innerHTML += char == null ? " " : char.name;
        outputBufferElement.scrollTop = outputBufferElement.scrollHeight;
    });

    startButton.addEventListener("click", () => {
        view(".view.playing");
        startButton.disabled = true;
        stopButton.disabled = false;
        document.dispatchEvent(new Event("startrequested"));
    });

    stopButton.addEventListener("click", () => {
        document.dispatchEvent(new Event("stoprequested"));
        letterElement.innerHTML = "";
        startButton.disabled = false;
        stopButton.disabled = true;
        view(".view.main");
    });

    pasteButton.addEventListener("click", showPasteView);

    storiesButton.addEventListener("click", showStoriesView);

    document.addEventListener("letterchange", (evt: CustomEvent) => letterElement.innerHTML = <string>evt.detail);
}
