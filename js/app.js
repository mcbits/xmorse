/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "favicon.ico";

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "robots.txt";

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(0);
var charPatterns = {
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
};
var audioSources = {};
var allCharacters = Object.keys(charPatterns);
var pitch = 700;
var mainVolume = 0.5;
var oscillatorVolume = 0.9;
var wpm = 18;
var charSpacing = 25;
var timeUnit = function () { return 1.2 / wpm * 1000; };
var ramp = 0.012;
var playing = false;
var paused = false;
var currentLetter = null;
var currentPattern = null;
// Events
var patternCompleteEvent = new Event("patterncomplete");
var audioLoadedEvent = new Event("audioloaded");
// Page elements
var startButton = document.querySelector(".btn-start");
var pauseButton = document.querySelector(".btn-pause");
var stopButton = document.querySelector(".btn-stop");
var letterElement = document.querySelector(".letter");
// Settings inputs
var volumeSlider = document.getElementById("volume");
var charWPMSlider = document.getElementById("charWPM");
var pitchSlider = document.getElementById("pitch");
var charSpacingSlider = document.getElementById("charSpacing");
var voiceEnabledCheckbox = document.getElementById("voiceEnabled");
// Settings text labels
var volumeText = document.querySelector(".volumeText");
var charWPMText = document.querySelector(".charWPMText");
var pitchText = document.querySelector(".pitchText");
var charSpacingText = document.querySelector(".charSpacingText");
// Audio parts
var audioCtx = new (AudioContext || window["webkitAudioContext"])();
var oscillator = audioCtx.createOscillator();
var oscillatorGain = audioCtx.createGain();
var voiceGain = audioCtx.createGain();
var masterGain = audioCtx.createGain();
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
function setOscillatorVolume(value) {
    // NOTE: The +0.05 is only there to (mostly) eliminate clicking due to a bug in Firefox.
    // It may not be needed in the future.
    oscillatorGain.gain.setTargetAtTime(value, audioCtx.currentTime + 0.05, 0.01);
}
function setMainVolume(value) {
    masterGain.gain.setTargetAtTime(value, audioCtx.currentTime, 0.01);
}
function setButtonStates() {
    startButton.disabled = playing && !paused;
    pauseButton.disabled = paused || !playing;
    stopButton.disabled = !playing;
}
function playPattern(pattern) {
    letterElement.innerHTML = pattern;
    function playBlip(index) {
        var blip = pattern.charAt(index++);
        setOscillatorVolume(oscillatorVolume);
        var time;
        if (blip === ".")
            time = timeUnit();
        else if (blip === "-")
            time = timeUnit() * 3;
        setTimeout(function () { return setOscillatorVolume(0); }, time);
        if (index < pattern.length)
            setTimeout(function () { return playBlip(index); }, time + timeUnit());
        else
            setTimeout(function () { return document.dispatchEvent(patternCompleteEvent); }, time + timeUnit());
    }
    playBlip(0);
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
function updateWPM(evt) {
    wpm = parseInt(charWPMSlider.value);
    charWPMText.value = wpm.toString();
}
function updatePitch(evt) {
    pitch = parseInt(pitchSlider.value);
    oscillator.frequency.value = pitch;
    pitchText.value = pitch.toString();
}
function updateCharSpacing(evt) {
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
            setTimeout(function () {
                playPattern(currentPattern);
            }, timeUnit() * charSpacing);
        }
    }
}
var charAudioBuffer;
function getCharName(char) {
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
function loadAudio(char) {
    char = getCharName(char);
    if (typeof audioSources[char] !== "undefined") {
        document.dispatchEvent(audioLoadedEvent);
        return audioSources[char];
    }
    else {
        var filename = char.replace(/\W/g, "") + ".mp3";
        var request_1 = new XMLHttpRequest();
        request_1.open("GET", "/audio/" + filename, true);
        request_1.responseType = "arraybuffer";
        request_1.addEventListener("load", function () {
            var response = request_1.response;
            audioCtx.decodeAudioData(response, function (buffer) {
                var audioSource = audioCtx.createBufferSource();
                audioSources[char] = buffer;
                document.dispatchEvent(audioLoadedEvent);
            }, function (err) { return console.log("Error loading audio source: ", err); });
        });
        request_1.send();
    }
}
function playAudio() {
    setTimeout(function () {
        var char = getCharName(currentLetter);
        var buffer = audioSources[char];
        if (typeof buffer !== "undefined") {
            var audioSource = audioCtx.createBufferSource();
            audioSource.addEventListener("ended", function (evt) {
                nextPattern();
                setTimeout(function () {
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


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map