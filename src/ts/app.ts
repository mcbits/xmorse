declare let require;
require("file-loader?name=index.html!../index.html");
require("file-loader?name=favicon.ico!../favicon.ico");
require("file-loader?name=robots.txt!../robots.txt");
require("../less/site.less");

import * as Morse from "./morsetable";
import * as Audio from "./audio";

function updateTextBuffer(evt: Event) {
    this.textBuffer = pasteTextBox.value;
    this.textBufferIndex = 0;
}

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
const player = new Audio.Player(letterElement, morseTable);

function setButtonStates() {
    startButton.disabled = player.playing && !player.paused;
    pauseButton.disabled = player.paused || !player.playing;
    stopButton.disabled = !player.playing;
}

function showPasteView() {
    view(".paste");
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

// Settings events
volumeSlider.addEventListener("input", () => {
    player.updateVolume(parseFloat(volumeSlider.value));
    volumeText.value = Math.floor(player.mainVolume * 100).toString();
});

charWPMSlider.addEventListener("input", () => {
    player.updateWPM(parseInt(charWPMSlider.value));
    charWPMText.value = player.wpm.toString();
});

charSpacingSlider.addEventListener("input", () => {
    player.updateCharSpacing(parseInt(charSpacingSlider.value));
    charSpacingText.value = player.charSpacing.toString();
});

pitchSlider.addEventListener("input", () => {
    player.updatePitch(parseInt(pitchSlider.value));
    pitchText.value = player.pitch.toString();
});

pasteTextBox.addEventListener("input", updateTextBuffer);

voiceEnabledCheckbox.addEventListener("change", () => {
    player.voiceEnabled = voiceEnabledCheckbox.checked;
});

// Playback events
document.addEventListener("patterncomplete", (evt: CustomEvent) => {
    const char = <Morse.Character>evt.detail;
    player.patternComplete(char);
});

document.addEventListener("audioloaded", player.playVoice);

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
