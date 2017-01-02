declare let require;
require("file-loader?name=index.html!../index.html");
require("file-loader?name=favicon.ico!../favicon.ico");
require("file-loader?name=robots.txt!../robots.txt");
require("../less/site.less");

import * as Morse from "./morsetable";

const audioSources: { [char: string]: AudioBuffer } = {};

let morseTable = new Morse.Table();

let pitch = 700;
let mainVolume = 0.5;
let oscillatorVolume = 0.9;
let wpm = 18;
let charSpacing = 25;
let timeUnit = () => 1.2 / wpm * 1000;
let ramp = 0.01;
let playing = false;
let paused = false;
let currentCharacter: Morse.Character = null;
//let currentPattern: string = null;

// Events
const patternCompleteEvent = new Event("patterncomplete");
const audioLoadedEvent = new Event("audioloaded");

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
const letterElement = query(".letter");

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

// Audio parts
const audioCtx: AudioContext = new (AudioContext || window["webkitAudioContext"])();
const oscillator = audioCtx.createOscillator();
const oscillatorGain = audioCtx.createGain();
const voiceGain = audioCtx.createGain();
const masterGain = audioCtx.createGain();

// Wire up audio parts
oscillator.frequency.value = pitch;
oscillatorGain.gain.value = 0;
oscillator.connect(oscillatorGain);
oscillatorGain.connect(masterGain);

voiceGain.gain.value = 0.6;
voiceGain.connect(masterGain);

masterGain.gain.value = mainVolume;
masterGain.connect(audioCtx.destination);

oscillator.start(0);

function random(first, second) {
    return Math.floor(Math.random() * (second - first)) + first + 1;
}


function setOscillatorVolume(value: number) {
    oscillatorGain.gain.setTargetAtTime(value, audioCtx.currentTime, ramp);
}

function setMainVolume(value: number) {
    masterGain.gain.setTargetAtTime(value, audioCtx.currentTime, 0.01);
}

function setButtonStates() {
    startButton.disabled = playing && !paused;
    pauseButton.disabled = paused || !playing;
    stopButton.disabled = !playing;
}

function playPattern(pattern: string): void {
    letterElement.innerHTML = pattern;

    function playBlip(index: number) {
        const blip = pattern.charAt(index++);

        setOscillatorVolume(oscillatorVolume);

        let time: number;
        if (blip === ".")
            time = timeUnit();
        else if (blip === "-")
            time = timeUnit() * 3;

        setTimeout(() => setOscillatorVolume(0), time);

        if (index < pattern.length)
            setTimeout(() => playBlip(index), time + timeUnit());
        else
            setTimeout(() => document.dispatchEvent(patternCompleteEvent), time + timeUnit());
    }

    playBlip(0)
}

function nextPattern() {
    currentCharacter = morseTable.randomCharacter();
}

function updateVolume() {
    mainVolume = parseFloat(volumeSlider.value);
    setMainVolume(mainVolume);
    volumeText.value = Math.floor(mainVolume * 100).toString();
}

function updateWPM(evt: Event) {
    wpm = parseInt(charWPMSlider.value);
    charWPMText.value = wpm.toString();
}

function updatePitch(evt: Event) {
    pitch = parseInt(pitchSlider.value);
    oscillator.frequency.value = pitch;
    pitchText.value = pitch.toString();
}

function updateCharSpacing(evt: Event) {
    charSpacing = parseInt(charSpacingSlider.value);
    charSpacingText.value = charSpacing.toString();
}

function startPlaying() {
    view(".view.letter");
    playing = true;
    paused = false;
    setButtonStates();
    nextPattern();
    playPattern(currentCharacter.pattern);
}

function stopPlaying() {
    playing = false;
    paused = false;
    setButtonStates();
    view(".view.main");
}

function patternComplete() {
    letterElement.innerHTML = currentCharacter.name;

    if (playing && !paused) {
        if (voiceEnabledCheckbox.checked)
            loadAudio(currentCharacter);
        else {
            nextPattern();
            setTimeout(function () {
                playPattern(currentCharacter.pattern);
            }, timeUnit() * charSpacing);
        }
    }
}

function loadAudio(charDef: Morse.Character) {
    const char = charDef.name;

    if (typeof audioSources[char] !== "undefined") {
        document.dispatchEvent(audioLoadedEvent);
        return audioSources[char];
    }
    else {
        const filename = char.replace(/\W/g, "") + ".mp3";
        const request = new XMLHttpRequest();
        request.open("GET", "/audio/" + filename, true);
        request.responseType = "arraybuffer";

        request.addEventListener("load", () => {
            const response = request.response;
            audioCtx.decodeAudioData(response, (buffer: AudioBuffer) => {
                const audioSource = audioCtx.createBufferSource();
                audioSources[char] = buffer;
                document.dispatchEvent(audioLoadedEvent);
            }, (err) => console.log("Error loading audio source: ", err));
        });

        request.send();
    }
}

function playAudio() {
    if (playing && !paused) {
        setTimeout(function () {
            if (playing && !paused) {
                const char = currentCharacter.name;
                const buffer = audioSources[char];
                if (typeof buffer !== "undefined") {
                    const audioSource = audioCtx.createBufferSource();
                    audioSource.addEventListener("ended", (evt) => {
                        if (playing && !paused) {
                            nextPattern();
                            setTimeout(function () {
                                playPattern(currentCharacter.pattern);
                            }, timeUnit() * charSpacing);
                        }
                    });
                    audioSource.buffer = buffer;
                    audioSource.connect(voiceGain);
                    audioSource.start(0);
                }
            }
        }, timeUnit() * charSpacing);
    }
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
volumeSlider.addEventListener("input", updateVolume);
charWPMSlider.addEventListener("input", updateWPM);
charSpacingSlider.addEventListener("input", updateCharSpacing);
pitchSlider.addEventListener("input", updatePitch);

// Playback events
document.addEventListener("patterncomplete", patternComplete);
document.addEventListener("audioloaded", playAudio);
startButton.addEventListener("click", startPlaying);
stopButton.addEventListener("click", stopPlaying);
