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

let frequency = 700;
let volume = 0.25;
let speed = 75;
let ramp = 0.015;

const audioCtx: AudioContext = new (AudioContext || window["webkitAudioContext"])();

const oscillator = audioCtx.createOscillator();
oscillator.frequency.value = frequency;
oscillator.start(0);

const gainNode = audioCtx.createGain();
gainNode.gain.value = 0;

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

const startButton = <HTMLButtonElement>document.querySelector(".btn-start");
const pauseButton = <HTMLButtonElement>document.querySelector(".btn-pause");
const stopButton = <HTMLButtonElement>document.querySelector(".btn-stop");

const patternCompleteEvent = new Event("patterncomplete");

let currentLetter: string = "";
let currentPattern: string = "";

function random(first, second) {
    return Math.floor(Math.random() * (second - first)) + first + 1;
}

function setVolume(value: number) {
    gainNode.gain.setTargetAtTime(value, audioCtx.currentTime, ramp);
}

function playPattern(pattern: string) {
    function playBlip(index: number) {
        const blip = pattern.charAt(index++);

        if (blip === " ") {
            setVolume(0)
            setTimeout(() => playBlip(index), speed * 5);
        }
        else {
            setVolume(volume);

            let time: number;
            if (blip === ".")
                time = speed;
            else if (blip === "-")
                time = speed * 3.5;

            setTimeout(() => setVolume(0), time);

            if (index < pattern.length)
                setTimeout(() => playBlip(index), time + speed);
            else
                setTimeout(() => document.dispatchEvent(patternCompleteEvent), time + speed);
        }
    }

    playBlip(0)
}

function playSequence(chars: string) {
    function playChar(index: number) {
        const char = chars.charAt(index++);
        const pattern = charPatterns[char];
        playPattern(pattern);
    }
}

function nextPattern() {
    const letters = Object.keys(charPatterns);
    currentLetter = letters[Math.floor(Math.random() * letters.length)];
    currentPattern = charPatterns[currentLetter];
}

document.addEventListener("patterncomplete", (evt: any) => {
    const letterElement = document.querySelector(".letter");
    letterElement.innerHTML = currentLetter;
});

startButton.addEventListener("click", () => {
    nextPattern();
    playPattern(currentPattern);
});
