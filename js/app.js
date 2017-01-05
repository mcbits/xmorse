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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
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
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var events_1 = __webpack_require__(13);
var letterPatterns = {
    "A": { name: "A", pattern: ".-", fileName: "A.mp3" },
    "B": { name: "B", pattern: "-...", fileName: "B.mp3" },
    "C": { name: "C", pattern: "-.-.", fileName: "C.mp3" },
    "D": { name: "D", pattern: "-..", fileName: "D.mp3" },
    "E": { name: "E", pattern: ".", fileName: "E.mp3" },
    "F": { name: "F", pattern: "..-.", fileName: "F.mp3" },
    "G": { name: "G", pattern: "--.", fileName: "G.mp3" },
    "H": { name: "H", pattern: "....", fileName: "H.mp3" },
    "I": { name: "I", pattern: "..", fileName: "I.mp3" },
    "J": { name: "J", pattern: ".---", fileName: "J.mp3" },
    "K": { name: "K", pattern: "-.-", fileName: "K.mp3" },
    "L": { name: "L", pattern: ".-..", fileName: "L.mp3" },
    "M": { name: "M", pattern: "--", fileName: "M.mp3" },
    "N": { name: "N", pattern: "-.", fileName: "N.mp3" },
    "O": { name: "O", pattern: "---", fileName: "O.mp3" },
    "P": { name: "P", pattern: ".--.", fileName: "P.mp3" },
    "Q": { name: "Q", pattern: "--.-", fileName: "Q.mp3" },
    "R": { name: "R", pattern: ".-.", fileName: "R.mp3" },
    "S": { name: "S", pattern: "...", fileName: "S.mp3" },
    "T": { name: "T", pattern: "-", fileName: "T.mp3" },
    "U": { name: "U", pattern: "..-", fileName: "U.mp3" },
    "V": { name: "V", pattern: "...-", fileName: "V.mp3" },
    "W": { name: "W", pattern: ".--", fileName: "W.mp3" },
    "X": { name: "X", pattern: "-..-", fileName: "X.mp3" },
    "Y": { name: "Y", pattern: "-.--", fileName: "Y.mp3" },
    "Z": { name: "Z", pattern: "--..", fileName: "Z.mp3" }
};
var numberPatterns = {
    "0": { name: "0", pattern: "-----", fileName: "0.mp3" },
    "1": { name: "1", pattern: ".----", fileName: "1.mp3" },
    "2": { name: "2", pattern: "..---", fileName: "2.mp3" },
    "3": { name: "3", pattern: "...--", fileName: "3.mp3" },
    "4": { name: "4", pattern: "....-", fileName: "4.mp3" },
    "5": { name: "5", pattern: ".....", fileName: "5.mp3" },
    "6": { name: "6", pattern: "-....", fileName: "6.mp3" },
    "7": { name: "7", pattern: "--...", fileName: "7.mp3" },
    "8": { name: "8", pattern: "---..", fileName: "8.mp3" },
    "9": { name: "9", pattern: "----.", fileName: "9.mp3" }
};
var symbolPatterns = {
    ".": { name: ".", pattern: ".-.-.-", fileName: "PERIOD.mp3" },
    "?": { name: "?", pattern: "..--..", fileName: "QUESTION.mp3" },
    "!": { name: "!", pattern: "-.-.--", fileName: "EXCLAMATION.mp3" },
    ",": { name: ",", pattern: "--..--", fileName: "COMMA.mp3" },
    ":": { name: ":", pattern: "---...", fileName: "COLON.mp3" },
    ";": { name: ";", pattern: "-.-.-.", fileName: "SEMICOLON.mp3" },
    "'": { name: "'", pattern: ".----.", fileName: "APOSTROPHE.mp3" },
    "-": { name: "-", pattern: "-....-", fileName: "DASH.mp3" },
    "/": { name: "/", pattern: "-..-.", fileName: "SLASH.mp3" },
    "(": { name: "(", pattern: "-.--.", fileName: "OPEN_BRACKET.mp3" },
    ")": { name: ")", pattern: "-.--.-", fileName: "CLOSE_BRACKET.mp3" },
    "@": { name: "@", pattern: ".--.-.", fileName: "AT.mp3" },
    "=": { name: "=", pattern: "-...-", fileName: "EQUALS.mp3" },
    "+": { name: "+", pattern: ".-.-.", fileName: "PLUS.mp3" },
    "\"": { name: "\"", pattern: ".-..-.", fileName: "QUOTE.mp3" }
};
var letters = Object.keys(letterPatterns);
var numbers = Object.keys(numberPatterns);
var symbols = Object.keys(symbolPatterns);
var lettersEnabled = true;
var numbersEnabled = false;
var symbolsEnabled = false;
function RandomCharacter() {
    var chars = [];
    if (lettersEnabled)
        chars = chars.concat(letters);
    if (numbersEnabled)
        chars = chars.concat(numbers);
    if (symbolsEnabled)
        chars = chars.concat(symbols);
    if (chars.length > 0) {
        var char = chars[Math.floor(Math.random() * chars.length)];
        return letterPatterns[char] || numberPatterns[char] || symbolPatterns[char];
    }
    return null;
}
exports.RandomCharacter = RandomCharacter;
function GetCharacter(char) {
    char = char.toUpperCase();
    var found = letterPatterns[char];
    if (found)
        return found;
    found = numberPatterns[char];
    if (found)
        return found;
    found = symbolPatterns[char];
    if (found)
        return found;
    return undefined;
}
exports.GetCharacter = GetCharacter;
events_1.Handle(events_1.LETTERS_ENABLED, function (value) { return lettersEnabled = value; });
events_1.Handle(events_1.NUMBERS_ENABLED, function (value) { return numbersEnabled = value; });
events_1.Handle(events_1.SYMBOLS_ENABLED, function (value) { return symbolsEnabled = value; });


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var events_1 = __webpack_require__(13);
var audiocontext_1 = __webpack_require__(15);
var morsetable_1 = __webpack_require__(5);
var toneplayer_1 = __webpack_require__(7);
var voiceplayer_1 = __webpack_require__(8);
// State
var nowPlaying;
var charSpacing;
var unitTime;
var currentCharacter = null;
var voiceEnabled = true;
var textBuffer = "";
var textBufferIndex = 0;
function delay(milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
}
function playNextPattern() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!nowPlaying)
                        return [3 /*break*/, 3];
                    if (textBuffer.length > 0) {
                        if (textBufferIndex >= textBuffer.length)
                            textBufferIndex = 0;
                        currentCharacter = morsetable_1.GetCharacter(textBuffer[textBufferIndex]);
                    }
                    else {
                        currentCharacter = morsetable_1.RandomCharacter();
                    }
                    return [4 /*yield*/, delay(unitTime * charSpacing)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, toneplayer_1.playPattern(currentCharacter)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updateVolume(value) {
    audiocontext_1.MasterGain.gain.setTargetAtTime(value, audiocontext_1.Audio.currentTime, 0.01);
}
function startPlaying() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!nowPlaying)
                        return [3 /*break*/, 2];
                    events_1.Trigger(events_1.NOW_PLAYING, true);
                    return [4 /*yield*/, playNextPattern()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function stopPlaying() {
    events_1.Trigger(events_1.NOW_PLAYING, false);
}
function updateTextBuffer(text) {
    textBuffer = text;
    textBufferIndex = 0;
}
function patternComplete(char) {
    if (textBuffer.length > 0) {
        ++textBufferIndex;
        if (textBufferIndex === textBuffer.length)
            textBufferIndex = 0;
    }
    if (currentCharacter != null) {
        events_1.Trigger(events_1.LETTER, char.name);
        if (nowPlaying) {
            if (voiceEnabled)
                voiceplayer_1.loadAudio(char);
            else
                playNextPattern();
        }
    }
    else {
        playNextPattern();
    }
}
function loadBook(href) {
    var request;
    var bookDownloaded = function (evt) {
        var response = request.response;
        events_1.Trigger(events_1.TEXT_BUFFER, response);
        events_1.Trigger(events_1.START, null);
    };
    request = new XMLHttpRequest();
    request.open("GET", href, true);
    request.responseType = "text";
    request.addEventListener("load", bookDownloaded);
    request.send();
}
events_1.Handle(events_1.NOW_PLAYING, function (value) { return nowPlaying = value; });
events_1.Handle(events_1.WPM, function (value) { return unitTime = 1.2 / value * 1000; });
events_1.Handle(events_1.CHAR_SPACING, function (value) { return charSpacing = value; });
events_1.Handle(events_1.VOICE_DONE, playNextPattern);
events_1.Handle(events_1.STOP, stopPlaying);
events_1.Handle(events_1.START, startPlaying);
events_1.Handle(events_1.PATTERN_COMPLETE, patternComplete);
events_1.Handle(events_1.VOLUME, updateVolume);
events_1.Handle(events_1.TEXT_BUFFER, updateTextBuffer);
events_1.Handle(events_1.VOICE_ENABLED, function (value) { return voiceEnabled = value; });
events_1.Handle(events_1.BOOK, loadBook);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var audiocontext_1 = __webpack_require__(15);
var events_1 = __webpack_require__(13);
var firefoxAntiClickDelay = navigator.userAgent.indexOf("irefox") != -1 ? 0.05 : 0.001;
var oscillatorVolume = 0.9;
var ramp = 0.008;
var nowPlaying;
var charSpacing = 25;
var unitTime;
// Wire up audio parts.
// Oscillator frequency will be initialized by UI.
var oscillator = audiocontext_1.Audio.createOscillator();
var oscillatorGain = audiocontext_1.Audio.createGain();
oscillatorGain.gain.setValueAtTime(0, audiocontext_1.Audio.currentTime);
oscillator.connect(oscillatorGain);
oscillatorGain.connect(audiocontext_1.MasterGain);
oscillator.start(0);
function delay(milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
}
function playPattern(char) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var on, off, patternComplete, playTone;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    on = function () { return oscillatorGain.gain.setTargetAtTime(oscillatorVolume, audiocontext_1.Audio.currentTime + firefoxAntiClickDelay, ramp); };
                    off = function () { return oscillatorGain.gain.setTargetAtTime(0, audiocontext_1.Audio.currentTime + firefoxAntiClickDelay, ramp); };
                    patternComplete = function (char) { return events_1.Trigger(events_1.PATTERN_COMPLETE, char); };
                    playTone = function (index) { return __awaiter(_this, void 0, void 0, function () {
                        var delayFactor;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!nowPlaying)
                                        return [3 /*break*/, 5];
                                    delayFactor = char.pattern.charAt(index++) === "." ? 1 : 3;
                                    on();
                                    return [4 /*yield*/, delay(unitTime * delayFactor)];
                                case 1:
                                    _a.sent();
                                    off();
                                    if (!(index >= char.pattern.length))
                                        return [3 /*break*/, 2];
                                    patternComplete(char);
                                    return [3 /*break*/, 5];
                                case 2: return [4 /*yield*/, delay(unitTime)];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, playTone(index)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!(char == null))
                        return [3 /*break*/, 1];
                    patternComplete(null);
                    return [3 /*break*/, 3];
                case 1:
                    events_1.Trigger(events_1.LETTER, char.pattern);
                    return [4 /*yield*/, playTone(0)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.playPattern = playPattern;
events_1.Handle(events_1.WPM, function (value) { return unitTime = 1.2 / value * 1000; });
events_1.Handle(events_1.CHAR_SPACING, function (value) { return charSpacing = value; });
events_1.Handle(events_1.PITCH, function (value) { oscillator.frequency.value = value; });
events_1.Handle(events_1.NOW_PLAYING, function (value) { return nowPlaying = value; });


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var events_1 = __webpack_require__(13);
var audiocontext_1 = __webpack_require__(15);
// Wire up audio
var voiceGain = audiocontext_1.Audio.createGain();
voiceGain.gain.value = 0.85;
voiceGain.connect(audiocontext_1.MasterGain);
var audioSources = {};
var nowPlaying;
var charSpacing;
var unitTime;
function delay(milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
}
function playVoice(char) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, audioSource;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, delay(unitTime * charSpacing)];
                case 1:
                    _a.sent();
                    if (nowPlaying) {
                        buffer = audioSources[char];
                        if (typeof buffer !== "undefined") {
                            audioSource = audiocontext_1.Audio.createBufferSource();
                            audioSource.addEventListener("ended", function () { return document.dispatchEvent(new Event(events_1.VOICE_DONE)); });
                            audioSource.buffer = buffer;
                            audioSource.connect(voiceGain);
                            audioSource.start(0);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function loadAudio(charDef) {
    var request;
    var audioDownloaded = function (evt) {
        var response = request.response;
        audiocontext_1.Audio.decodeAudioData(response, function (buffer) {
            audioSources[charDef.name] = buffer;
            playVoice(charDef.name);
        }, function (err) { return console.log("Error loading audio source: ", err); });
    };
    if (typeof audioSources[charDef.name] !== "undefined") {
        playVoice(charDef.name);
        return audioSources[charDef.name];
    }
    else {
        request = new XMLHttpRequest();
        request.open("GET", "/audio/" + charDef.fileName, true);
        request.responseType = "arraybuffer";
        request.addEventListener("load", audioDownloaded);
        request.send();
    }
}
exports.loadAudio = loadAudio;
events_1.Handle(events_1.WPM, function (value) { return unitTime = 1.2 / value * 1000; });
events_1.Handle(events_1.CHAR_SPACING, function (value) { return charSpacing = value; });
events_1.Handle(events_1.NOW_PLAYING, function (value) { return nowPlaying = value; });


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(0);
var Audio = __webpack_require__(15);
Audio;
var VoicePlayer = __webpack_require__(8);
VoicePlayer;
var TonePlayer = __webpack_require__(7);
TonePlayer;
var Player = __webpack_require__(6);
Player;
var FullScreen = __webpack_require__(14);
FullScreen;
var UI = __webpack_require__(11);
UI;


/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var events_1 = __webpack_require__(13);
var query_1 = __webpack_require__(12);
// Page elements
var start = query_1.query(".btn-start");
var stop = query_1.query(".btn-stop");
var paste = query_1.query(".btn-paste");
var stories = query_1.query(".btn-stories");
var letterElement = query_1.query(".letter");
var outputBuffer = query_1.query(".outputBuffer");
var bookLinks = query_1.queryAll(".story a");
// Settings text labels
var volumeText = query_1.query(".volumeText");
var charWPMText = query_1.query(".charWPMText");
var pitchText = query_1.query(".pitchText");
var charSpacingText = query_1.query(".charSpacingText");
// Settings inputs
var volume = query_1.queryId("volume");
var charWPM = query_1.queryId("charWPM");
var pitch = query_1.queryId("pitch");
var charSpacing = query_1.queryId("charSpacing");
var voiceEnabled = query_1.queryId("voiceEnabled");
var pasteTextBox = query_1.queryId("pasteText");
var lettersEnabled = query_1.queryId("lettersEnabled");
var numbersEnabled = query_1.queryId("numbersEnabled");
var symbolsEnabled = query_1.queryId("symbolsEnabled");
function view(selector) {
    var views = document.querySelectorAll(".view");
    for (var i = 0; i < views.length; ++i) {
        var view_1 = views[i];
        if (!view_1.classList.contains("disabled"))
            view_1.classList.add("disabled");
    }
    var viewToShow = document.querySelector(selector);
    viewToShow.classList.remove("disabled");
}
volume.addEventListener("input", function () { return events_1.Trigger(events_1.VOLUME, parseFloat(volume.value)); });
charWPM.addEventListener("input", function () { return events_1.Trigger(events_1.WPM, parseInt(charWPM.value)); });
charSpacing.addEventListener("input", function () { return events_1.Trigger(events_1.CHAR_SPACING, parseInt(charSpacing.value)); });
pitch.addEventListener("input", function () { return events_1.Trigger(events_1.PITCH, parseInt(pitch.value)); });
pasteTextBox.addEventListener("input", function () { return events_1.Trigger(events_1.TEXT_BUFFER, pasteTextBox.value); });
voiceEnabled.addEventListener("change", function () { return events_1.Trigger(events_1.VOICE_ENABLED, voiceEnabled.checked); });
lettersEnabled.addEventListener("change", function () { return events_1.Trigger(events_1.LETTERS_ENABLED, lettersEnabled.checked); });
numbersEnabled.addEventListener("change", function () { return events_1.Trigger(events_1.NUMBERS_ENABLED, numbersEnabled.checked); });
symbolsEnabled.addEventListener("change", function () { return events_1.Trigger(events_1.SYMBOLS_ENABLED, symbolsEnabled.checked); });
paste.addEventListener("click", function () { return view(".paste"); });
stories.addEventListener("click", function () { return view(".stories"); });
start.addEventListener("click", function () { return events_1.Trigger(events_1.START, null); });
stop.addEventListener("click", function () { return events_1.Trigger(events_1.STOP, null); });
for (var i = 0; i < bookLinks.length; ++i) {
    var bookLink = bookLinks[i];
    bookLink.addEventListener("click", function (evt) {
        evt.preventDefault();
        var anchor = evt.target;
        var href = anchor.href;
        events_1.Trigger(events_1.BOOK, href);
    });
}
events_1.Handle(events_1.START, function () {
    outputBuffer.innerHTML = "";
    view(".view.playing");
    start.disabled = true;
    stop.disabled = false;
});
events_1.Handle(events_1.STOP, function () {
    letterElement.innerHTML = "";
    start.disabled = false;
    stop.disabled = true;
    view(".view.main");
});
events_1.Handle(events_1.TEXT_BUFFER, function (value) { return pasteTextBox.value = value; });
events_1.Handle(events_1.VOLUME, function (value) { return volumeText.value = Math.floor(value * 100).toString(); });
events_1.Handle(events_1.WPM, function (value) { return charWPMText.value = value.toString(); });
events_1.Handle(events_1.CHAR_SPACING, function (value) { return charSpacingText.value = value.toString(); });
events_1.Handle(events_1.PITCH, function (value) { return pitchText.value = value.toString(); });
events_1.Handle(events_1.LETTER, function (value) { return letterElement.innerHTML = value; });
events_1.Handle(events_1.PATTERN_COMPLETE, function (char) {
    outputBuffer.innerHTML += char == null ? " " : char.name;
    outputBuffer.scrollTop = outputBuffer.scrollHeight;
});
// Trigger events to initialize state
events_1.Trigger(events_1.VOLUME, volume.value);
events_1.Trigger(events_1.WPM, charWPM.value);
events_1.Trigger(events_1.CHAR_SPACING, charSpacing.value);
events_1.Trigger(events_1.VOICE_ENABLED, voiceEnabled.checked);
events_1.Trigger(events_1.PITCH, pitch.value);
events_1.Trigger(events_1.LETTERS_ENABLED, lettersEnabled.checked);
events_1.Trigger(events_1.NUMBERS_ENABLED, numbersEnabled.checked);
events_1.Trigger(events_1.SYMBOLS_ENABLED, symbolsEnabled.checked);


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

function query(selector) {
    return document.querySelector(selector);
}
exports.query = query;
function queryAll(selector) {
    return document.querySelectorAll(selector);
}
exports.queryAll = queryAll;
function queryId(id) {
    return document.getElementById(id);
}
exports.queryId = queryId;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

function Trigger(name, value) {
    document.dispatchEvent(new CustomEvent(name, { detail: value }));
}
exports.Trigger = Trigger;
function Handle(name, handler) {
    document.addEventListener(name, function (evt) { return handler(evt.detail); });
}
exports.Handle = Handle;
exports.WPM = "wpm";
exports.BOOK = "book";
exports.STOP = "stop";
exports.START = "start";
exports.PITCH = "pitch";
exports.VOLUME = "volume";
exports.LETTER = "letter";
exports.VOICE_DONE = "voiceDone";
exports.NOW_PLAYING = "nowPlaying";
exports.TEXT_BUFFER = "textBuffer";
exports.CHAR_SPACING = "charSpacing";
exports.VOICE_ENABLED = "voiceEnabled";
exports.LETTERS_ENABLED = "lettersEnabled";
exports.NUMBERS_ENABLED = "numbersEnabled";
exports.SYMBOLS_ENABLED = "symbolsEnabled";
exports.PATTERN_COMPLETE = "patternComplete";


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var query_1 = __webpack_require__(12);
var isFullScreen = false;
var enableFullScreenButton = query_1.query(".btn-fullscreen");
var startButton = query_1.query(".btn-start");
var stopButton = query_1.query(".btn-stop");
enableFullScreenButton.addEventListener("click", function () {
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
            query_1.query(".view.playing").requestFullscreen();
        else if (document["webkitFullscreenEnabled"])
            query_1.query(".view.playing")["webkitRequestFullscreen"]();
        else if (document["mozFullScreenEnabled"])
            query_1.query(".view.playing")["mozRequestFullScreen"]();
    }
});
function fullScreenChanged() {
    enableFullScreenButton.classList.toggle("disabled");
    isFullScreen = !isFullScreen;
}
["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange"].forEach(function (type) {
    return document.addEventListener(type, fullScreenChanged);
});
var cursorHidingTimeout;
function revealOnMouseMove() {
    clearTimeout(cursorHidingTimeout);
    enableFullScreenButton.classList.remove("disabled");
    document.body.style.cursor = "default";
    cursorHidingTimeout = setTimeout(function () {
        if (isFullScreen) {
            document.body.style.cursor = "none";
            enableFullScreenButton.classList.add("disabled");
        }
    }, 1500);
}
document.addEventListener("mousemove", revealOnMouseMove);
startButton.addEventListener("click", function () { return enableFullScreenButton.classList.remove("disabled"); });
stopButton.addEventListener("click", function () { return enableFullScreenButton.classList.add("disabled"); });


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

exports.Audio = new (AudioContext || window["webkitAudioContext"])();
exports.MasterGain = exports.Audio.createGain();
exports.MasterGain.gain.value = 0.5;
exports.MasterGain.connect(exports.Audio.destination);


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map