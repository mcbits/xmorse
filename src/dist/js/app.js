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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(1);
__webpack_require__(4);
__webpack_require__(5);
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
var frequency = 700;
var volume = 0.25;
var speed = 75;
var ramp = 0.015;
var audioCtx = new (AudioContext || window["webkitAudioContext"])();
var oscillator = audioCtx.createOscillator();
oscillator.frequency.value = frequency;
oscillator.start(0);
var gainNode = audioCtx.createGain();
gainNode.gain.value = 0;
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
var startButton = document.querySelector(".btn-start");
var pauseButton = document.querySelector(".btn-pause");
var stopButton = document.querySelector(".btn-stop");
var patternCompleteEvent = new Event("patterncomplete");
var currentLetter = "";
var currentPattern = "";
function random(first, second) {
    return Math.floor(Math.random() * (second - first)) + first + 1;
}
function setVolume(value) {
    gainNode.gain.setTargetAtTime(value, audioCtx.currentTime, ramp);
}
function playPattern(pattern) {
    function playBlip(index) {
        var blip = pattern.charAt(index++);
        if (blip === " ") {
            setVolume(0);
            setTimeout(function () { return playBlip(index); }, speed * 5);
        }
        else {
            setVolume(volume);
            var time = void 0;
            if (blip === ".")
                time = speed;
            else if (blip === "-")
                time = speed * 3.5;
            setTimeout(function () { return setVolume(0); }, time);
            if (index < pattern.length)
                setTimeout(function () { return playBlip(index); }, time + speed);
            else
                setTimeout(function () { return document.dispatchEvent(patternCompleteEvent); }, time + speed);
        }
    }
    playBlip(0);
}
function playSequence(chars) {
    function playChar(index) {
        var char = chars.charAt(index++);
        var pattern = charPatterns[char];
        playPattern(pattern);
    }
}
function nextPattern() {
    var letters = Object.keys(charPatterns);
    currentLetter = letters[Math.floor(Math.random() * letters.length)];
    currentPattern = charPatterns[currentLetter];
}
document.addEventListener("patterncomplete", function (evt) {
    var letterElement = document.querySelector(".letter");
    letterElement.innerHTML = currentLetter;
});
startButton.addEventListener("click", function () {
    nextPattern();
    playPattern(currentPattern);
});


/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "favicon.ico";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "robots.txt";

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map