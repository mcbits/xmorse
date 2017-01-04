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

let isFullScreen = false;

// Page elements
const startButton = query<HTMLButtonElement>(".btn-start");
const pauseButton = query<HTMLButtonElement>(".btn-pause");
const stopButton = query<HTMLButtonElement>(".btn-stop");
const pasteButton = query<HTMLButtonElement>(".btn-paste");
const storiesButton = query<HTMLButtonElement>(".btn-stories");
const letterElement = query<HTMLElement>(".letter");
const enableFullScreenButton = query<HTMLButtonElement>(".btn-fullscreen");
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

const morseTable = new Morse.Table();
const morseParams = new MorseParams(letterElement);
const player = new Player(morseTable, morseParams);

function fullScreenAvailable() {
    return document.fullscreenEnabled
        || document["webkitFullscreenEnabled"]
        || document["mozFullScreenEnabled"];
}

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

lettersEnabledCheckbox.addEventListener("change", () => {
    morseTable.lettersEnabled = lettersEnabledCheckbox.checked;
});

numbersEnabledCheckbox.addEventListener("change", () => {
    morseTable.numbersEnabled = numbersEnabledCheckbox.checked;
});

symbolsEnabledCheckbox.addEventListener("change", () => {
    morseTable.symbolsEnabled = symbolsEnabledCheckbox.checked;
});

document.addEventListener("patterncomplete", (evt: CustomEvent) => {
    const char = <Morse.CharacterInfo>evt.detail;
    player.patternComplete(char);

    outputBufferElement.innerHTML += char == null ? " " : char.name;
    outputBufferElement.scrollTop = outputBufferElement.scrollHeight;
});

startButton.addEventListener("click", () => {
    enableFullScreenButton.classList.remove("disabled");
    view(".view.playing");
    player.startPlaying();
    setButtonStates();
});

pauseButton.addEventListener("click", () => {
    enableFullScreenButton.classList.add("disabled");
    player.stopPlaying();
    letterElement.innerHTML = "";
    setButtonStates();
});

stopButton.addEventListener("click", () => {
    enableFullScreenButton.classList.add("disabled");
    player.stopPlaying();
    letterElement.innerHTML = "";
    setButtonStates();
    view(".view.main");
});

pasteButton.addEventListener("click", showPasteView);

storiesButton.addEventListener("click", showStoriesView);

enableFullScreenButton.addEventListener("click", () => {
    if (isFullScreen) {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document["webkitExitFullscreen"])
            document["webkitExitFullscreen"]();
        else if (document["mozCancelFullScreen"]) {
            document["mozCancelFullScreen"]();
        }
    }
    else {
        if (document.fullscreenEnabled)
            query<HTMLElement>(".view.playing").requestFullscreen();
        else if (document["webkitFullscreenEnabled"])
            query<HTMLElement>(".view.playing")["webkitRequestFullscreen"]();
        else if (document["mozFullScreenEnabled"])
            query<HTMLElement>(".view.playing")["mozRequestFullScreen"]();
    }
});


function fullScreenChanged() {
    enableFullScreenButton.classList.toggle("disabled");
    isFullScreen = !isFullScreen;
}

["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange"].forEach(type =>
    document.addEventListener(type, fullScreenChanged));

let cursorHidingTimeout: number;
function revealOnMouseMove() {
    clearTimeout(cursorHidingTimeout);
    enableFullScreenButton.classList.remove("disabled");
    document.body.style.cursor = "default";

    cursorHidingTimeout = setTimeout(() => {
        if (isFullScreen) {
            document.body.style.cursor = "none"
            enableFullScreenButton.classList.add("disabled");
        }
    }, 1500);
}
document.addEventListener("mousemove", revealOnMouseMove);
