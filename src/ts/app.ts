declare let require;
require("file-loader?name=index.html!../index.html");
require("file-loader?name=favicon.ico!../favicon.ico");
require("file-loader?name=robots.txt!../robots.txt");
require("../less/site.less");

import * as Morse from "./morsetable";
import { Player } from "./player";
import { MorseParams } from "./morseparams";

function query<T extends Element>(selector: string): T {
    return <T>document.querySelector(selector);
}

function queryAll<T extends Element>(selector: string): NodeListOf<T> {
    return <NodeListOf<T>>document.querySelectorAll(selector);
}

function queryId<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}

// Page elements
const startButton = query<HTMLButtonElement>(".btn-start");
const pauseButton = query<HTMLButtonElement>(".btn-pause");
const stopButton = query<HTMLButtonElement>(".btn-stop");
const pasteButton = query<HTMLButtonElement>(".btn-paste");
const storiesButton = query<HTMLButtonElement>(".btn-stories");
const letterElement = query<HTMLElement>(".letter");

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

const morseTable = new Morse.Table();
const morseParams = new MorseParams(letterElement);
const player = new Player(morseTable, morseParams);

function setButtonStates() {
    startButton.disabled = morseParams.nowPlaying();
    pauseButton.disabled = !morseParams.nowPlaying();
    stopButton.disabled = !morseParams.nowPlaying();
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

volumeSlider.addEventListener("input", () => {
    player.updateVolume(parseFloat(volumeSlider.value));
    volumeText.value = Math.floor(player.mainVolume * 100).toString();
});

charWPMSlider.addEventListener("input", () => {
    morseParams.updateWPM(parseInt(charWPMSlider.value));
    charWPMText.value = morseParams.wpm.toString();
});

charSpacingSlider.addEventListener("input", () => {
    morseParams.updateCharSpacing(parseInt(charSpacingSlider.value));
    charSpacingText.value = morseParams.charSpacing.toString();
});

pitchSlider.addEventListener("input", () => {
    morseParams.updatePitch(parseInt(pitchSlider.value));
    pitchText.value = morseParams.pitch.toString();
});

pasteTextBox.addEventListener("input", () => player.updateTextBuffer(pasteTextBox.value));

voiceEnabledCheckbox.addEventListener("change", () => {
    player.voiceEnabled = voiceEnabledCheckbox.checked;
});

document.addEventListener("patterncomplete", (evt: CustomEvent) => {
    const char = <Morse.CharacterInfo>evt.detail;
    player.patternComplete(char);
});

startButton.addEventListener("click", () => {
    view(".view.letter");
    player.startPlaying();
    setButtonStates();
});

stopButton.addEventListener("click", () => {
    player.stopPlaying();
    letterElement.innerHTML = "";
    setButtonStates();
    view(".view.main");
});

pasteButton.addEventListener("click", showPasteView);

storiesButton.addEventListener("click", showStoriesView);
