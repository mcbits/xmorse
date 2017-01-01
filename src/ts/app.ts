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

const audioSources: {[char: string]: AudioBuffer} = { };

const allCharacters = Object.keys(charPatterns);

let pitch = 700;
let mainVolume = 0.5;
let oscillatorVolume = 0.9;
let wpm = 18;
let charSpacing = 25;
let timeUnit = () => 1.2 / wpm * 1000;
let ramp = 0.012;
let playing = false;
let paused = false;
let currentLetter: string = null;
let currentPattern: string = null;

// Events
const patternCompleteEvent = new Event("patterncomplete");
const audioLoadedEvent = new Event("audioloaded");

// Page elements
const startButton = <HTMLButtonElement>document.querySelector(".btn-start");
const pauseButton = <HTMLButtonElement>document.querySelector(".btn-pause");
const stopButton = <HTMLButtonElement>document.querySelector(".btn-stop");
const letterElement = document.querySelector(".letter");

// Settings inputs
const volumeSlider = <HTMLInputElement>document.getElementById("volume");
const charWPMSlider = <HTMLInputElement>document.getElementById("charWPM");
const pitchSlider = <HTMLInputElement>document.getElementById("pitch");
const charSpacingSlider = <HTMLInputElement>document.getElementById("charSpacing");
const voiceEnabledCheckbox = <HTMLInputElement>document.getElementById("voiceEnabled");

// Settings text labels
const volumeText = (<HTMLInputElement>document.querySelector(".volumeText"));
const charWPMText = (<HTMLInputElement>document.querySelector(".charWPMText"));
const pitchText = (<HTMLInputElement>document.querySelector(".pitchText"));
const charSpacingText = (<HTMLInputElement>document.querySelector(".charSpacingText"));

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

function randomCharacter() {
    return allCharacters[Math.floor(Math.random() * allCharacters.length)];
}

function setOscillatorVolume(value: number) {
    // NOTE: The +0.05 is only there to (mostly) eliminate clicking due to a bug in Firefox.
    // It may not be needed in the future.
    oscillatorGain.gain.setTargetAtTime(value, audioCtx.currentTime+0.05, 0.01);
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
    currentLetter = randomCharacter();
    currentPattern = charPatterns[currentLetter];
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
        if (voiceEnabledCheckbox.checked)
            loadAudio(currentLetter);
        else {
            nextPattern();
            setTimeout(function() {
                playPattern(currentPattern);
            }, timeUnit() * charSpacing);
        }
    }
}

let charAudioBuffer: AudioBuffer;

function getCharName(char: string): string {
    switch (char) {
        case "!":
            return "EXCLAMATION";
        case "?":
            return "QUESTION";
        case ".":
            return "PERIOD";
        case ",":
            return "COMMA";
        default:
            return char;
    }
}

function loadAudio(char: string) {
    char = getCharName(char);

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
    setTimeout(function() {
        const char = getCharName(currentLetter);
        const buffer = audioSources[char];
        if (typeof buffer !== "undefined") {
            const audioSource = audioCtx.createBufferSource();
            audioSource.addEventListener("ended", (evt) => {
                nextPattern();
                setTimeout(function() {
                    playPattern(currentPattern);
                }, timeUnit() * charSpacing);
            });
            audioSource.buffer = buffer;
            audioSource.connect(voiceGain);
            audioSource.start(0);
        }
    }, timeUnit() * charSpacing);
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
