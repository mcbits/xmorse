declare let require;
require("file-loader?name=index.html!../index.html");
require("file-loader?name=favicon.ico!../favicon.ico");
require("file-loader?name=robots.txt!../robots.txt");
require("../less/site.less");

const charPatterns: { [char: string]: string } = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "V": "...-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    ".": ".-.-.-",
    "?": "..--..",
    "!": "-.-.--",
    ",": "--..--",
}

const allCharacters = Object.keys(charPatterns);

let pitch = 700;
let volume = 0.25;
let wpm = 18;
let timeUnit = () => 1.2 / wpm * 1000;
let ramp = 0.012;
let playing = false;
let paused = false;
let currentLetter: string = null;
let currentPattern: string = null;

// Events
const patternCompleteEvent = new Event("patterncomplete");

// Page elements
const startButton = <HTMLButtonElement>document.querySelector(".btn-start");
const pauseButton = <HTMLButtonElement>document.querySelector(".btn-pause");
const stopButton = <HTMLButtonElement>document.querySelector(".btn-stop");
const letterElement = document.querySelector(".letter");
const wpmSlider = <HTMLInputElement>document.getElementById("charWPM");
const volumeSlider = <HTMLInputElement>document.getElementById("volume");
const pitchSlider = <HTMLInputElement>document.getElementById("pitch");

// Audio parts
const audioCtx: AudioContext = new (AudioContext || window["webkitAudioContext"])();
const oscillator = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();

// Wire up audio parts
oscillator.frequency.value = pitch;
oscillator.start(0);
gainNode.gain.value = 0;
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

function random(first, second) {
    return Math.floor(Math.random() * (second - first)) + first + 1;
}

function randomCharacter() {
    return allCharacters[Math.floor(Math.random() * allCharacters.length)];
}

function setVolume(value: number) {
    gainNode.gain.setTargetAtTime(value, audioCtx.currentTime, ramp);
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

        setVolume(volume);

        let time: number;
        if (blip === ".")
            time = timeUnit();
        else if (blip === "-")
            time = timeUnit() * 3;

        setTimeout(() => setVolume(0), time);

        if (index < pattern.length)
            setTimeout(() => playBlip(index), time + timeUnit());
        else
            setTimeout(() => document.dispatchEvent(patternCompleteEvent), time + timeUnit());
    }

    playBlip(0)
}

function nextPattern() {
    currentLetter = randomCharacter();
    currentPattern = charPatterns[currentLetter];
}

function updateVolume() {
    volume = parseFloat(volumeSlider.value) / 100.0;
    (<HTMLInputElement>document.querySelector("#volumeText")).value = Math.floor(volume * 200).toString();
}

function updateWPM(evt: Event) {
    wpm = parseInt(wpmSlider.value);
    (<HTMLInputElement>document.querySelector("#charWPMText")).value = wpm.toString();
}

function updatePitch(evt: Event) {
    pitch = parseInt(pitchSlider.value);
    oscillator.frequency.value = pitch;
    (<HTMLInputElement>document.querySelector("#pitchText")).value = pitch.toString();
}

function startPlaying() {
    playing = true;
    paused = false;
    setButtonStates();
    nextPattern();
    playPattern(currentPattern);
}

function stopPlaying() {
    playing = false;
    paused = false;
    setButtonStates();
}

function patternComplete() {
    letterElement.innerHTML = currentLetter;
    if (playing && !paused) {
        nextPattern();
        setTimeout(function() {
            playPattern(currentPattern);
        }, timeUnit() * 25);
    }
}

wpmSlider.addEventListener("input", updateWPM);
volumeSlider.addEventListener("input", updateVolume);
pitchSlider.addEventListener("input", updatePitch);
document.addEventListener("patterncomplete", patternComplete);
startButton.addEventListener("click", startPlaying);
stopButton.addEventListener("click", stopPlaying);
