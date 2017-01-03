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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var MorseParams = (function () {
    function MorseParams(letterElement) {
        var _this = this;
        this.letterElement = letterElement;
        this.started = false;
        this.paused = false;
        this.wpm = 18;
        this.charSpacing = 25;
        this.unitTime = function () { return 1.2 / _this.wpm * 1000; };
        this.currentCharacter = null;
        this.pitch = 700;
        this.updateWPM = function (value) {
            _this.wpm = value;
        };
        this.updateCharSpacing = function (value) {
            _this.charSpacing = value;
        };
        this.updatePitch = function (value) {
            _this.pitch = value;
            document.dispatchEvent(new Event("pitchchanged"));
        };
    }
    MorseParams.prototype.nowPlaying = function () {
        return this.started && !this.paused;
    };
    MorseParams.prototype.start = function () {
        this.started = true;
        this.paused = false;
    };
    MorseParams.prototype.stop = function () {
        this.started = false;
        this.paused = false;
    };
    MorseParams.prototype.pause = function () {
        this.paused = true;
    };
    return MorseParams;
}());
exports.MorseParams = MorseParams;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var Table = (function () {
    function Table() {
        this.lettersEnabled = true;
        this.numbersEnabled = false;
        this.symbolsEnabled = false;
        this.letterPatterns = {
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
        this.numberPatterns = {
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
        this.symbolPatterns = {
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
        this.letters = Object.keys(this.letterPatterns);
        this.numbers = Object.keys(this.numberPatterns);
        this.symbols = Object.keys(this.symbolPatterns);
    }
    Table.prototype.randomCharacter = function () {
        var chars = [];
        if (this.lettersEnabled)
            chars = chars.concat(this.letters);
        if (this.numbersEnabled)
            chars = chars.concat(this.numbers);
        if (this.symbolsEnabled)
            chars = chars.concat(this.symbols);
        if (chars.length > 0) {
            var char = chars[Math.floor(Math.random() * chars.length)];
            return this.letterPatterns[char]
                || this.numberPatterns[char]
                || this.symbolPatterns[char];
        }
        return null;
    };
    Table.prototype.getCharacter = function (char) {
        char = char.toUpperCase();
        var found = this.letterPatterns[char];
        if (found != null)
            return found;
        found = this.numberPatterns[char];
        if (found != null)
            return found;
        found = this.symbolPatterns[char];
        if (found != null)
            return found;
        return undefined;
    };
    return Table;
}());
exports.Table = Table;


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
var toneplayer_1 = __webpack_require__(7);
var voiceplayer_1 = __webpack_require__(8);
function delay(milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
}
var Player = (function () {
    function Player(morseTable, params) {
        var _this = this;
        this.params = params;
        this.mainVolume = 0.5;
        this.voiceEnabled = true;
        // Audio parts
        this.audioCtx = new (AudioContext || window["webkitAudioContext"])();
        this.masterGain = this.audioCtx.createGain();
        this.textBuffer = "";
        this.textBufferIndex = 0;
        this.playNextPattern = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.params.nowPlaying())
                            return [3 /*break*/, 3];
                        if (this.textBuffer.length > 0) {
                            if (this.textBufferIndex >= this.textBuffer.length)
                                this.textBufferIndex = 0;
                            this.params.currentCharacter = this.morseTable.getCharacter(this.textBuffer[this.textBufferIndex]);
                        }
                        else {
                            this.params.currentCharacter = this.morseTable.randomCharacter();
                        }
                        return [4 /*yield*/, delay(this.params.unitTime() * this.params.charSpacing)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.tonePlayer.playPattern(this.params.currentCharacter)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.updateVolume = function (value) {
            _this.mainVolume = value;
            _this.masterGain.gain.setTargetAtTime(_this.mainVolume, _this.audioCtx.currentTime, 0.01);
        };
        this.startPlaying = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.params.start();
                        return [4 /*yield*/, this.playNextPattern()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.stopPlaying = function () {
            _this.params.stop();
        };
        this.patternComplete = function (char) {
            if (_this.textBuffer.length > 0) {
                ++_this.textBufferIndex;
                if (_this.textBufferIndex === _this.textBuffer.length)
                    _this.textBufferIndex = 0;
            }
            if (_this.params.currentCharacter != null) {
                _this.params.letterElement.innerHTML = char.name;
                if (_this.params.nowPlaying()) {
                    if (_this.voiceEnabled)
                        _this.voicePlayer.loadAudio(char);
                    else {
                        _this.playNextPattern();
                    }
                }
            }
            else {
                _this.playNextPattern();
            }
        };
        this.morseTable = morseTable;
        this.tonePlayer = new toneplayer_1.TonePlayer(this.audioCtx, this.params);
        this.voicePlayer = new voiceplayer_1.VoicePlayer(this.audioCtx, this.params);
        document.addEventListener("audioloaded", this.voicePlayer.playVoice);
        document.addEventListener("voicedoneplaying", this.playNextPattern);
        this.tonePlayer.oscillatorGain.connect(this.masterGain);
        this.voicePlayer.voiceGain.connect(this.masterGain);
        this.masterGain.gain.value = this.mainVolume;
        this.masterGain.connect(this.audioCtx.destination);
    }
    Player.prototype.updateTextBuffer = function (text) {
        this.textBuffer = text;
        this.textBufferIndex = 0;
    };
    return Player;
}());
exports.Player = Player;


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
function delay(milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
}
var TonePlayer = (function () {
    function TonePlayer(audioCtx, params) {
        var _this = this;
        this.audioCtx = audioCtx;
        this.params = params;
        this.oscillatorVolume = 0.9;
        this.ramp = 0.01;
        this.oscillator = this.audioCtx.createOscillator();
        this.oscillatorGain = this.audioCtx.createGain();
        this.playPattern = function (char) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var pattern, on, off, patternComplete, playTone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        on = function () { return _this.oscillatorGain.gain.setTargetAtTime(_this.oscillatorVolume, _this.audioCtx.currentTime, _this.ramp); };
                        off = function () { return _this.oscillatorGain.gain.setTargetAtTime(0, _this.audioCtx.currentTime, _this.ramp); };
                        patternComplete = function (char) { return document.dispatchEvent(new CustomEvent("patterncomplete", { detail: char })); };
                        playTone = function (index) { return __awaiter(_this, void 0, void 0, function () {
                            var delayFactor;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!this.params.nowPlaying())
                                            return [3 /*break*/, 5];
                                        delayFactor = pattern.charAt(index++) === "." ? 1 : 3;
                                        on();
                                        return [4 /*yield*/, delay(this.params.unitTime() * delayFactor)];
                                    case 1:
                                        _a.sent();
                                        off();
                                        if (!(index >= pattern.length))
                                            return [3 /*break*/, 2];
                                        patternComplete(char);
                                        return [3 /*break*/, 5];
                                    case 2: return [4 /*yield*/, delay(this.params.unitTime())];
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
                        patternComplete(char);
                        return [3 /*break*/, 3];
                    case 1:
                        pattern = char.pattern;
                        this.params.letterElement.innerHTML = pattern;
                        return [4 /*yield*/, playTone(0)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // Wire up audio parts
        this.oscillator.frequency.value = params.pitch;
        this.oscillatorGain.gain.value = 0;
        this.oscillator.connect(this.oscillatorGain);
        this.oscillator.start(0);
        document.addEventListener("pitchchanged", function (evt) { _this.oscillator.frequency.value = params.pitch; });
    }
    return TonePlayer;
}());
exports.TonePlayer = TonePlayer;


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
function delay(milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
}
var VoicePlayer = (function () {
    function VoicePlayer(audioCtx, params) {
        var _this = this;
        this.audioCtx = audioCtx;
        this.params = params;
        this.audioSources = {};
        this.voiceGain = this.audioCtx.createGain();
        this.playVoice = function () { return __awaiter(_this, void 0, void 0, function () {
            var char, buffer, audioSource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.params.nowPlaying())
                            return [3 /*break*/, 2];
                        return [4 /*yield*/, delay(this.params.unitTime() * this.params.charSpacing)];
                    case 1:
                        _a.sent();
                        char = this.params.currentCharacter.name;
                        buffer = this.audioSources[char];
                        if (typeof buffer !== "undefined") {
                            audioSource = this.audioCtx.createBufferSource();
                            audioSource.addEventListener("ended", function () { return document.dispatchEvent(new Event("voicedoneplaying")); });
                            audioSource.buffer = buffer;
                            audioSource.connect(this.voiceGain);
                            audioSource.start(0);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        this.loadAudio = function (charDef) {
            var audioLoadedEvent = new Event("audioloaded");
            var char = charDef.name;
            var request;
            var audioDownloaded = function (evt) {
                var response = request.response;
                _this.audioCtx.decodeAudioData(response, function (buffer) {
                    _this.audioSources[char] = buffer;
                    document.dispatchEvent(audioLoadedEvent);
                }, function (err) { return console.log("Error loading audio source: ", err); });
            };
            if (typeof _this.audioSources[char] !== "undefined") {
                document.dispatchEvent(audioLoadedEvent);
                return _this.audioSources[char];
            }
            else {
                request = new XMLHttpRequest();
                request.open("GET", "/audio/" + charDef.fileName, true);
                request.responseType = "arraybuffer";
                request.addEventListener("load", audioDownloaded);
                request.send();
            }
        };
        this.voiceGain.gain.value = 0.75;
    }
    return VoicePlayer;
}());
exports.VoicePlayer = VoicePlayer;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(0);
var Morse = __webpack_require__(5);
var player_1 = __webpack_require__(6);
var morseparams_1 = __webpack_require__(4);
function query(selector) {
    return document.querySelector(selector);
}
function queryAll(selector) {
    return document.querySelectorAll(selector);
}
function queryId(id) {
    return document.getElementById(id);
}
// Page elements
var startButton = query(".btn-start");
var pauseButton = query(".btn-pause");
var stopButton = query(".btn-stop");
var pasteButton = query(".btn-paste");
var storiesButton = query(".btn-stories");
var letterElement = query(".letter");
// Settings text labels
var volumeText = query(".volumeText");
var charWPMText = query(".charWPMText");
var pitchText = query(".pitchText");
var charSpacingText = query(".charSpacingText");
// Settings inputs
var volumeSlider = queryId("volume");
var charWPMSlider = queryId("charWPM");
var pitchSlider = queryId("pitch");
var charSpacingSlider = queryId("charSpacing");
var voiceEnabledCheckbox = queryId("voiceEnabled");
var pasteTextBox = queryId("pasteText");
var lettersEnabledCheckbox = queryId("lettersEnabled");
var numbersEnabledCheckbox = queryId("numbersEnabled");
var symbolsEnabledCheckbox = queryId("symbolsEnabled");
var morseTable = new Morse.Table();
var morseParams = new morseparams_1.MorseParams(letterElement);
var player = new player_1.Player(morseTable, morseParams);
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
volumeSlider.addEventListener("input", function () {
    player.updateVolume(parseFloat(volumeSlider.value));
    volumeText.value = Math.floor(player.mainVolume * 100).toString();
});
charWPMSlider.addEventListener("input", function () {
    morseParams.updateWPM(parseInt(charWPMSlider.value));
    charWPMText.value = morseParams.wpm.toString();
});
charSpacingSlider.addEventListener("input", function () {
    morseParams.updateCharSpacing(parseInt(charSpacingSlider.value));
    charSpacingText.value = morseParams.charSpacing.toString();
});
pitchSlider.addEventListener("input", function () {
    morseParams.updatePitch(parseInt(pitchSlider.value));
    pitchText.value = morseParams.pitch.toString();
});
pasteTextBox.addEventListener("input", function () { return player.updateTextBuffer(pasteTextBox.value); });
voiceEnabledCheckbox.addEventListener("change", function () {
    player.voiceEnabled = voiceEnabledCheckbox.checked;
});
lettersEnabledCheckbox.addEventListener("change", function () {
    morseTable.lettersEnabled = lettersEnabledCheckbox.checked;
});
numbersEnabledCheckbox.addEventListener("change", function () {
    morseTable.numbersEnabled = numbersEnabledCheckbox.checked;
});
symbolsEnabledCheckbox.addEventListener("change", function () {
    morseTable.symbolsEnabled = symbolsEnabledCheckbox.checked;
});
document.addEventListener("patterncomplete", function (evt) {
    var char = evt.detail;
    player.patternComplete(char);
});
startButton.addEventListener("click", function () {
    view(".view.letter");
    player.startPlaying();
    setButtonStates();
});
pauseButton.addEventListener("click", function () {
    player.stopPlaying();
    letterElement.innerHTML = "";
    setButtonStates();
});
stopButton.addEventListener("click", function () {
    player.stopPlaying();
    letterElement.innerHTML = "";
    setButtonStates();
    view(".view.main");
});
pasteButton.addEventListener("click", showPasteView);
storiesButton.addEventListener("click", showStoriesView);


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map