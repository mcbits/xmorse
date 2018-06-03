const AudioCtx = new AudioContext();
const MasterGain = AudioCtx.createGain();
MasterGain.gain.value = 0.5;
MasterGain.connect(AudioCtx.destination);
function Notify(name, value) {
    document.dispatchEvent(new CustomEvent(name, { detail: value }));
}
function Listen(name, handler) {
    document.addEventListener(name, (evt) => handler(evt.detail));
}
const EMIT_LETTER = "emit_letter";
const EMIT_OUTPUT = "emit_output";
const PATTERN_START = "patternStart";
const PATTERN_STOP = "patternStop";
const CMD_CLEAR_OUTPUT = "cmd_clearOutput";
const CMD_PAUSE = "cmd_pause";
const CMD_START = "cmd_start";
const CMD_STORY = "cmd_story";
const CMD_STOP = "cmd_stop";
const SET_SPACING = "set_spacing";
const SET_LETTERS = "set_letters";
const SET_NOW_PLAYING = "set_nowPlaying";
const SET_NUMBERS = "set_numbers";
const SET_PITCH = "set_pitch";
const SET_SYMBOLS = "set_symbols";
const SET_TEXT_BUFFER = "set_textBuffer";
const SET_UNIT_TIME = "set_unitTime";
const SET_VOICE = "set_voice";
const SET_VOLUME = "set_volume";
const SET_WPM = "set_wpm";
const UI_SPACING = "ui_spacing";
const UI_LETTERS = "ui_letters";
const UI_NOW_PLAYING = "ui_nowPlaying";
const UI_NUMBERS = "ui_numbers";
const UI_PITCH = "ui_pitch";
const UI_SYMBOLS = "ui_symbols";
const UI_TEXT_BUFFER = "ui_textBuffer";
const UI_VOICE = "ui_voice";
const UI_VOLUME = "ui_volume";
const UI_WPM = "ui_wpm";
const VIEW_HOME = "view_home";
const VIEW_SETTINGS = "view_settings";
const VIEW_PLAYING = "view_player";
const VIEW_STORIES = "view_stories";
const VIEW_TEXT = "view_text";
const EMIT_VOICE_DONE = "emit_voiceDone";
const WATCH = "watch";
function Query(selector, element) {
    return (element || document).querySelector(selector);
}
function QueryAll(selector, element) {
    return (element || document).querySelectorAll(selector);
}
function QueryId(id) {
    return document.getElementById(id);
}
/// <reference path="query.ts"/>
var FullScreen;
(function (FullScreen) {
    const fullScreenButton = Query(".btn-fullscreen");
    const playingView = document.body.parentElement;
    const controls = Query(".controls");
    const menu = Query(".menu");
    const sidebar = Query(".sidebar");
    let isFullScreen = false;
    let hideControlsInterval;
    let lastActivity = Date.now();
    let hideControlsMS = 2000;
    let controlsVisible = false;
    let cursorVisible = false;
    function exitFullScreen() {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document["webkitExitFullscreen"])
            document["webkitExitFullscreen"]();
        else if (document["mozCancelFullScreen"])
            document["mozCancelFullScreen"]();
    }
    function enterFullScreen() {
        if (document.fullscreenEnabled)
            playingView.requestFullscreen();
        else if (document["webkitFullscreenEnabled"])
            playingView["webkitRequestFullscreen"]();
        else if (document["mozFullScreenEnabled"])
            playingView["mozRequestFullScreen"]();
    }
    function toggleFullScreen() {
        if (isFullScreen)
            exitFullScreen();
        else
            enterFullScreen();
    }
    function fullScreenChanged() {
        isFullScreen = !isFullScreen;
        fullScreenButton.textContent = isFullScreen ? "Exit full screen" : "Full screen";
        lastActivity = Date.now();
    }
    function markTime() {
        lastActivity = Date.now();
    }
    function hideOrReveal() {
        if (isFullScreen && Date.now() - lastActivity > hideControlsMS) {
            hideControls();
            hideCursor();
            return;
        }
        else {
            showControls();
            showCursor();
        }
    }
    function hideCursor() {
        if (cursorVisible)
            playingView.style.cursor = "none";
        cursorVisible = false;
    }
    function showCursor() {
        if (!cursorVisible)
            playingView.style.cursor = "default";
        cursorVisible = true;
    }
    function hideControls() {
        if (controlsVisible) {
            fullScreenButton.classList.add("disabled");
            controls.classList.add("disabled");
            menu.classList.add("disabled");
            sidebar.classList.add("disabled");
        }
        controlsVisible = false;
    }
    function showControls() {
        if (!controlsVisible) {
            fullScreenButton.classList.remove("disabled");
            controls.classList.remove("disabled");
            menu.classList.remove("disabled");
            sidebar.classList.remove("disabled");
        }
        controlsVisible = true;
    }
    function start() {
        document.addEventListener("mousemove", markTime);
        hideControlsInterval = setInterval(hideOrReveal, 200);
    }
    function stop() {
        clearInterval(hideControlsInterval);
        document.removeEventListener("mousemove", markTime);
        showCursor();
        showControls();
        if (isFullScreen)
            exitFullScreen();
    }
    Listen(CMD_START, start);
    Listen(CMD_STOP, stop);
    if (document.fullscreenEnabled)
        document.addEventListener("fullscreenchange", fullScreenChanged);
    else if (document["webkitFullscreenEnabled"])
        document.addEventListener("webkitfullscreenchange", fullScreenChanged);
    else if (document["mozFullScreenEnabled"])
        document.addEventListener("mozfullscreenchange", fullScreenChanged);
    fullScreenButton.addEventListener("click", toggleFullScreen);
})(FullScreen || (FullScreen = {}));
/// <reference path="events.ts"/>
var Morse;
(function (Morse) {
    // 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z . ? ! , : ; ' - / ( ) @ = + "
    const letterPatterns = {
        "A": { name: "A", pattern: ".-" },
        "B": { name: "B", pattern: "-..." },
        "C": { name: "C", pattern: "-.-." },
        "D": { name: "D", pattern: "-.." },
        "E": { name: "E", pattern: "." },
        "F": { name: "F", pattern: "..-." },
        "G": { name: "G", pattern: "--." },
        "H": { name: "H", pattern: "...." },
        "I": { name: "I", pattern: ".." },
        "J": { name: "J", pattern: ".---" },
        "K": { name: "K", pattern: "-.-" },
        "L": { name: "L", pattern: ".-.." },
        "M": { name: "M", pattern: "--" },
        "N": { name: "N", pattern: "-." },
        "O": { name: "O", pattern: "---" },
        "P": { name: "P", pattern: ".--." },
        "Q": { name: "Q", pattern: "--.-" },
        "R": { name: "R", pattern: ".-." },
        "S": { name: "S", pattern: "..." },
        "T": { name: "T", pattern: "-" },
        "U": { name: "U", pattern: "..-" },
        "V": { name: "V", pattern: "...-" },
        "W": { name: "W", pattern: ".--" },
        "X": { name: "X", pattern: "-..-" },
        "Y": { name: "Y", pattern: "-.--" },
        "Z": { name: "Z", pattern: "--.." }
    };
    const numberPatterns = {
        "0": { name: "0", pattern: "-----" },
        "1": { name: "1", pattern: ".----" },
        "2": { name: "2", pattern: "..---" },
        "3": { name: "3", pattern: "...--" },
        "4": { name: "4", pattern: "....-" },
        "5": { name: "5", pattern: "....." },
        "6": { name: "6", pattern: "-...." },
        "7": { name: "7", pattern: "--..." },
        "8": { name: "8", pattern: "---.." },
        "9": { name: "9", pattern: "----." }
    };
    const symbolPatterns = {
        ".": { name: ".", pattern: ".-.-.-" },
        "?": { name: "?", pattern: "..--.." },
        "!": { name: "!", pattern: "-.-.--" },
        ",": { name: ",", pattern: "--..--" },
        ":": { name: ":", pattern: "---..." },
        ";": { name: ";", pattern: "-.-.-." },
        "'": { name: "'", pattern: ".----." },
        "-": { name: "-", pattern: "-....-" },
        "/": { name: "/", pattern: "-..-." },
        "(": { name: "(", pattern: "-.--." },
        ")": { name: ")", pattern: "-.--.-" },
        "@": { name: "@", pattern: ".--.-." },
        "=": { name: "=", pattern: "-...-" },
        "+": { name: "+", pattern: ".-.-." },
        "\"": { name: "\"", pattern: ".-..-." }
    };
    const symbolNames = {
        ".": "PERIOD",
        "?": "QUESTION",
        "!": "EXCLAMATION",
        ",": "COMMA",
        ":": "COLON",
        ";": "SEMICOLON",
        "'": "APOSTROPHE",
        "-": "DASH",
        "/": "SLASH",
        "(": "OPEN_BRACKET",
        ")": "CLOSE_BRACKET",
        "@": "AT",
        "=": "EQUALS",
        "+": "PLUS",
        "\"": "QUOTE"
    };
    const letters = Object.keys(letterPatterns);
    const numbers = Object.keys(numberPatterns);
    const symbols = Object.keys(symbolPatterns);
    let lettersEnabled = true;
    let numbersEnabled = false;
    let symbolsEnabled = false;
    function AllCharacters() {
        return letters.map(l => letterPatterns[l])
            .concat(numbers.map(n => numberPatterns[n]))
            .concat(symbols.map(s => symbolPatterns[s]));
    }
    Morse.AllCharacters = AllCharacters;
    function RandomCharacter() {
        let chars = [];
        if (lettersEnabled)
            chars = chars.concat(letters);
        if (numbersEnabled)
            chars = chars.concat(numbers);
        if (symbolsEnabled)
            chars = chars.concat(symbols);
        if (chars.length > 0) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            return letterPatterns[char] || numberPatterns[char] || symbolPatterns[char];
        }
        return null;
    }
    Morse.RandomCharacter = RandomCharacter;
    function GetCharacter(char) {
        char = char.toUpperCase();
        let found = letterPatterns[char];
        if (found)
            return found;
        found = numberPatterns[char];
        if (found)
            return found;
        found = symbolPatterns[char];
        if (found)
            return found;
        if (char === "")
            return { name: "", pattern: "" };
        if (char === " ")
            return { name: " ", pattern: " " };
        return undefined;
    }
    Morse.GetCharacter = GetCharacter;
    function fileName(char) {
        if (Object.keys(letterPatterns).indexOf(char.name) > -1
            || Object.keys(numberPatterns).indexOf(char.name) > -1
            || Object.keys(symbolNames).indexOf(char.name) > -1) {
            let fileName = symbolNames[char.name];
            if (!fileName)
                fileName = char.name;
            fileName += ".mp3";
            return fileName;
        }
        return undefined;
    }
    Morse.fileName = fileName;
    Listen(SET_LETTERS, (value) => lettersEnabled = value);
    Listen(SET_NUMBERS, (value) => numbersEnabled = value);
    Listen(SET_SYMBOLS, (value) => symbolsEnabled = value);
})(Morse || (Morse = {}));
/// <reference path="events.ts"/>
var Timing;
(function (Timing) {
    Timing.CharSpacing = 1;
    Timing.DitUnits = 1;
    Timing.DahUnits = 3;
    Timing.SampleRate = 48000;
    Timing.Ramp = 0.01;
    Listen(SET_NOW_PLAYING, (value) => Timing.NowPlaying = value);
    // With 60 seconds per minute and 50 units in "PARIS":
    //     UnitTime in seconds = 60 / (WPM * 50)
    // This simplifies to 1.2 / WPM.
    Listen(SET_WPM, (value) => (Timing.UnitTime = 1.2 / value) && Notify(SET_UNIT_TIME, Timing.UnitTime));
    Listen(SET_SPACING, (value) => Timing.CharSpacing = value);
})(Timing || (Timing = {}));
/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="timing.ts"/>
var CharBufferCache;
(function (CharBufferCache) {
    let cache = {};
    function Add(char, buffer) {
        cache[char] = buffer;
    }
    CharBufferCache.Add = Add;
    function Get(char) {
        return cache[char];
    }
    CharBufferCache.Get = Get;
    function Clear() {
        cache = {};
    }
    CharBufferCache.Clear = Clear;
})(CharBufferCache || (CharBufferCache = {}));
var TonePlayer;
(function (TonePlayer) {
    let T = Timing;
    let Freq = 500;
    let ditBuffer;
    let dahBuffer;
    let charSpaceBuffer;
    let wordSpaceBuffer;
    const ramp = 0.0;
    function initializeBuffers() {
        CharBufferCache.Clear();
        const allCharacters = Morse.AllCharacters();
        for (let i = 0; i < allCharacters.length; ++i) {
            const char = allCharacters[i];
            const buffer = createCharacterBuffer(char);
            CharBufferCache.Add(char.name, buffer);
        }
        // Empty character
        CharBufferCache.Add("", AudioCtx.createBuffer(1, Timing.UnitTime * 2 * Timing.SampleRate, Timing.SampleRate));
        // Space character
        CharBufferCache.Add(" ", AudioCtx.createBuffer(1, Timing.UnitTime * 4 * Timing.SampleRate, Timing.SampleRate));
    }
    function addToneToBuffer(units, samplesPerUnit, data, initialSample) {
        const omega = 2 * Math.PI * Freq / Timing.SampleRate;
        // Number of audio samples in the ramp up/down periods.
        const rampSamples = Math.min(Math.ceil(Timing.Ramp * Timing.SampleRate), samplesPerUnit);
        // Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
        const soundSamples = Math.ceil(samplesPerUnit * units);
        for (let t = initialSample, rampPos = 0; t < initialSample + rampSamples; ++t, ++rampPos) {
            data[t] = Math.sin(omega * t) * (rampPos / rampSamples);
        }
        for (let t = initialSample + rampSamples; t < initialSample + soundSamples - rampSamples; ++t) {
            data[t] = Math.sin(omega * t);
        }
        for (let t = initialSample + soundSamples - rampSamples, rampPos = rampSamples; t < initialSample + soundSamples; ++t, --rampPos) {
            data[t] = Math.sin(omega * t) * (rampPos / rampSamples);
        }
    }
    function countUnitsInPattern(pattern) {
        let total = 0;
        for (let i = 0; i < pattern.length; ++i) {
            switch (pattern[i]) {
                case ".":
                    total += 2;
                    break;
                case "-":
                    total += 4;
                    break;
            }
        }
        return total;
    }
    function createCharacterBuffer(char) {
        const pattern = char.pattern;
        // Number of audio samples per Morse code unit of time.
        const samplesPerUnit = Math.ceil(Timing.UnitTime * Timing.SampleRate);
        // Number of audio samples in the ramp up/down periods.
        const rampSamples = Math.min(Math.ceil(Timing.Ramp * Timing.SampleRate), samplesPerUnit);
        const units = countUnitsInPattern(pattern);
        // Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
        const soundSamples = Math.ceil(samplesPerUnit * units);
        // Total samples in the clip. This is the "on" time + ramp-down time + any remaining silence.
        const totalSamples = Math.ceil(samplesPerUnit * units + (samplesPerUnit * Timing.CharSpacing));
        const buffer = AudioCtx.createBuffer(1, totalSamples, Timing.SampleRate);
        const data = buffer.getChannelData(0);
        let pos = 0;
        for (let i = 0; i < pattern.length; ++i) {
            switch (pattern[i]) {
                case ".":
                    addToneToBuffer(1, samplesPerUnit, data, pos);
                    pos += 2 * samplesPerUnit;
                    break;
                case "-":
                    addToneToBuffer(3, samplesPerUnit, data, pos);
                    pos += 4 * samplesPerUnit;
                    break;
            }
        }
        return buffer;
    }
    function PlayPattern(char) {
        Notify(EMIT_LETTER, char.name);
        Notify(PATTERN_START, char.pattern);
        // const charTones = char.pattern.split("");
        // playCharTone(char, charTones, ditBuffer, dahBuffer);
        const src = AudioCtx.createBufferSource();
        src.connect(MasterGain);
        src.buffer = CharBufferCache.Get(char.name);
        src.addEventListener("ended", () => Notify(PATTERN_STOP, char));
        src.start();
    }
    TonePlayer.PlayPattern = PlayPattern;
    Listen(SET_PITCH, (value) => { Freq = value; initializeBuffers(); });
    Listen(SET_UNIT_TIME, (value) => initializeBuffers());
    Listen(SET_SPACING, (value) => initializeBuffers());
})(TonePlayer || (TonePlayer = {}));
/// <reference path="morsetable.ts"/>
/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="timing.ts"/>
var VoicePlayer;
(function (VoicePlayer) {
    // For caching audio files as they're loaded
    const audioBuffers = {};
    // Wire up audio
    const voiceGain = AudioCtx.createGain();
    voiceGain.gain.value = 0.85;
    voiceGain.connect(MasterGain);
    let voiceEnabled = false;
    let loading = {};
    let loaded = {};
    let playWhenDone = false;
    function voiceLoaded(char) {
        const playNow = playWhenDone;
        playWhenDone = false;
        if (playNow)
            PlayVoice(char);
    }
    function loadVoice(char) {
        if (loaded[char.name])
            voiceLoaded(char);
        else {
            loading[char.name] = true;
            fetch("/snd/" + Morse.fileName(char), { method: "GET" })
                .then(response => {
                if (response.status === 200)
                    response.arrayBuffer()
                        .then(arrayBuffer => {
                        AudioCtx.decodeAudioData(arrayBuffer, function (audioBuffer) {
                            audioBuffers[char.name] = audioBuffer;
                            loading[char.name] = false;
                            loaded[char.name] = true;
                            voiceLoaded(char);
                        }, (err) => console.error("Error decoding audio source: ", err));
                    });
                else {
                    console.error("Failed to load voice for char: ", char);
                    loading[char.name] = false;
                    playWhenDone = false;
                    Notify(EMIT_VOICE_DONE, char);
                }
            })
                .catch(reason => console.error(reason));
        }
    }
    function PreloadVoice(char) {
        if (voiceEnabled && !loaded[char.name] && loading[char.name])
            loadVoice(char);
    }
    VoicePlayer.PreloadVoice = PreloadVoice;
    function PlayVoice(char) {
        if (Timing.NowPlaying) {
            if (!voiceEnabled || Morse.fileName(char) === undefined)
                Notify(EMIT_VOICE_DONE, char);
            else if (loading[char.name])
                playWhenDone = true;
            else if (!loaded[char.name]) {
                playWhenDone = true;
                loadVoice(char);
            }
            else {
                const buffer = audioBuffers[char.name];
                const audioSource = AudioCtx.createBufferSource();
                audioSource.addEventListener("ended", () => Notify(EMIT_VOICE_DONE, char));
                audioSource.buffer = buffer;
                audioSource.connect(voiceGain);
                audioSource.start(0);
            }
        }
    }
    VoicePlayer.PlayVoice = PlayVoice;
    Listen(SET_VOICE, (value) => voiceEnabled = value);
})(VoicePlayer || (VoicePlayer = {}));
/// <reference path="events.ts"/>
/// <reference path="morsetable.ts"/>
var TextLoader;
(function (TextLoader) {
    let textBuffer = "";
    let textBufferIndex = -1;
    function resetPosition() {
        textBufferIndex = textBuffer.length > 0 ? 0 : -1;
    }
    function updateTextBuffer(text) {
        textBuffer = text.toUpperCase() + "\n";
        resetPosition();
    }
    function loadBook(href) {
        fetch(href, { method: "GET" })
            .then(response => response.text()
            .then(value => {
            Notify(CMD_CLEAR_OUTPUT, null);
            setTimeout(() => {
                Notify(SET_TEXT_BUFFER, value);
                Notify(CMD_START, null);
            }, 500);
        }));
    }
    function Next() {
        if (textBuffer.length > 0) {
            const startingIndex = textBufferIndex;
            let text = "";
            do {
                text += textBuffer[textBufferIndex];
                const morseChar = Morse.GetCharacter(textBuffer[textBufferIndex]);
                // Increment and wrap around if necessary
                ++textBufferIndex;
                if (textBufferIndex === textBuffer.length)
                    textBufferIndex = 0;
                if (morseChar)
                    return [text, morseChar];
            } while (textBufferIndex !== startingIndex);
            return ["", null];
        }
        const char = Morse.RandomCharacter();
        return [char.name, char];
    }
    TextLoader.Next = Next;
    Listen(SET_TEXT_BUFFER, updateTextBuffer);
    Listen(CMD_STORY, loadBook);
    Listen(CMD_STOP, resetPosition);
})(TextLoader || (TextLoader = {}));
/// <reference path="events.ts"/>
/// <reference path="audiocontext.ts"/>
/// <reference path="morsetable.ts"/>
/// <reference path="toneplayer.ts"/>
/// <reference path="voiceplayer.ts"/>
/// <reference path="text.ts"/>
/// <reference path="timing.ts"/>
var Player;
(function (Player) {
    const T = Timing;
    function playNextPattern() {
        if (T.NowPlaying) {
            // Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
            let [text, morseChar] = TextLoader.Next() || [" ", { name: " ", pattern: "" }];
            if (morseChar) {
                let sleepTime = 0;
                // If there is unplayable text, send it to the output buffer and delay for one word-break.
                if (text !== morseChar.name) {
                    Notify(EMIT_OUTPUT, text.substr(0, text.length - 1));
                    Notify(PATTERN_START, " ");
                    Notify(EMIT_LETTER, "");
                }
                setTimeout(() => {
                    VoicePlayer.PreloadVoice(morseChar);
                    TonePlayer.PlayPattern(morseChar);
                }, sleepTime);
            }
            else {
                Notify(PATTERN_START, "");
                Notify(PATTERN_STOP, null);
            }
        }
    }
    function updateVolume(value) {
        MasterGain.gain.setTargetAtTime(value, AudioCtx.currentTime, 0.01);
    }
    function startPlaying() {
        if (!T.NowPlaying) {
            Notify(SET_NOW_PLAYING, true);
            setTimeout(playNextPattern, 500);
        }
    }
    function stopPlaying() {
        Notify(SET_NOW_PLAYING, false);
    }
    function patternComplete(char) {
        if (T.NowPlaying) {
            if (char == null) {
                playNextPattern();
            }
            else {
                // playNextPattern() will be called by VOICE_DONE (which is
                // triggered whether the voice is currently enabled or not).
                VoicePlayer.PlayVoice(char);
            }
        }
    }
    Listen(EMIT_VOICE_DONE, playNextPattern);
    Listen(CMD_PAUSE, stopPlaying);
    Listen(CMD_STOP, stopPlaying);
    Listen(CMD_START, startPlaying);
    Listen(PATTERN_STOP, patternComplete);
    Listen(SET_VOLUME, updateVolume);
})(Player || (Player = {}));
/// <reference path="events.ts"/>
var Routing;
(function (Routing) {
    const routes = {
        "": VIEW_HOME,
        "#playing": VIEW_PLAYING,
        "#settings": VIEW_SETTINGS,
        "#stories": VIEW_STORIES,
        "#text": VIEW_TEXT
    };
    function processHash() {
        const hash = location.hash;
        if (routes[hash])
            Notify(routes[hash], null);
        if (hash === "" && location.href.indexOf("#") > -1)
            history.replaceState("", document.title, window.location.pathname);
    }
    window.addEventListener("hashchange", processHash);
    document.addEventListener("DOMContentLoaded", processHash);
})(Routing || (Routing = {}));
/// <reference path="events.ts"/>
var LocalStorage;
(function (LocalStorage) {
    Listen(UI_SPACING, (value) => localStorage.setItem("charSpacing", value));
    Listen(UI_LETTERS, (value) => localStorage.setItem("lettersEnabled", value.toString()));
    Listen(UI_NUMBERS, (value) => localStorage.setItem("numbersEnabled", value.toString()));
    Listen(UI_PITCH, (value) => localStorage.setItem("pitch", value));
    Listen(UI_SYMBOLS, (value) => localStorage.setItem("symbolsEnabled", value.toString()));
    Listen(UI_TEXT_BUFFER, (value) => localStorage.setItem("textBuffer", value.toString()));
    Listen(UI_VOICE, (value) => localStorage.setItem("voiceEnabled", value.toString()));
    Listen(UI_VOLUME, (value) => localStorage.setItem("volume", value));
    Listen(UI_WPM, (value) => localStorage.setItem("wpm", value));
})(LocalStorage || (LocalStorage = {}));
/// <reference path="../events.ts"/>
/// <reference path="../morsetable.ts"/>
/// <reference path="../query.ts"/>
var UI;
(function (UI) {
    const homeBtn = Query(".btn-home");
    const startBtns = QueryAll(".btn-start");
    const startBtn = Query(".btn-start");
    const pauseBtn = Query(".btn-pause");
    const stopBtn = Query(".btn-stop");
    const letterElement = Query(".letter");
    const outputBuffer = Query(".outputBuffer");
    const storyLinks = QueryAll(".story a");
    const patternEl = Query(".view.playing .pattern");
    let playState = "stopped";
    pauseBtn.addEventListener("click", () => Notify(CMD_PAUSE, null));
    for (let i = 0; i < startBtns.length; ++i) {
        startBtns[i].addEventListener("click", () => Notify(CMD_START, null));
    }
    stopBtn.addEventListener("click", () => Notify(CMD_STOP, null));
    for (let i = 0; i < storyLinks.length; ++i) {
        const storyLink = storyLinks[i];
        storyLink.addEventListener("click", (evt) => {
            evt.preventDefault();
            const anchor = evt.target;
            const href = anchor.href;
            Notify(CMD_STORY, href);
        });
    }
    Listen(CMD_CLEAR_OUTPUT, () => outputBuffer.innerHTML = "");
    Listen(CMD_PAUSE, () => {
        playState = "paused";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    });
    Listen(CMD_START, () => {
        if (AudioCtx.state === "suspended")
            AudioCtx.resume();
        playState = "started";
        Notify(WATCH, null);
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
    });
    Listen(CMD_STOP, () => {
        playState = "stopped";
        location.hash = "";
        outputBuffer.innerHTML = "";
        letterElement.innerHTML = "";
        patternEl.innerHTML = "";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    });
    Listen(EMIT_LETTER, (value) => letterElement.innerHTML = value);
    Listen(EMIT_OUTPUT, (value) => {
        outputBuffer.innerHTML += value;
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    });
    Listen(PATTERN_START, (pattern) => {
        function make(className) {
            const el = document.createElement("span");
            el.classList.add("element");
            el.classList.add(className);
            return el;
        }
        for (let i = 0; i < pattern.length; ++i) {
            let el;
            if (pattern[i] === ".")
                el = make("dit");
            else if (pattern[i] === "-")
                el = make("dah");
            else if (pattern[i] === " ")
                el = make("wordSpace");
            patternEl.appendChild(el);
        }
        patternEl.appendChild(make("charSpace"));
    });
    Listen(PATTERN_STOP, (char) => {
        if (playState !== "stopped") {
            outputBuffer.innerHTML += char == null ? " " : char.name;
            outputBuffer.scrollTop = outputBuffer.scrollHeight;
        }
    });
    Listen(WATCH, () => location.hash = "#playing");
})(UI || (UI = {}));
/// <reference path="../events.ts"/>
var Settings;
(function (Settings) {
    const resetSettingsButton = QueryId("resetSettings");
    // Settings text labels
    const volumeText = Query(".volumeText");
    const charWPMText = Query(".charWPMText");
    const pitchText = Query(".pitchText");
    const charSpacingText = Query(".charSpacingText");
    // Settings inputs
    Settings.userSet = {
        volume: QueryId("volume"),
        charWPM: QueryId("charWPM"),
        pitch: QueryId("pitch"),
        charSpacing: QueryId("charSpacing"),
        voiceEnabled: QueryId("voiceEnabled"),
        pasteTextBox: QueryId("pasteText"),
        lettersEnabled: QueryId("lettersEnabled"),
        numbersEnabled: QueryId("numbersEnabled"),
        symbolsEnabled: QueryId("symbolsEnabled")
    };
    const defaults = {
        charSpacing: 8,
        lettersEnabled: true,
        numbersEnabled: false,
        pitch: 650,
        symbolsEnabled: false,
        voiceEnabled: true,
        volume: 0.40,
        wpm: 10
    };
    function Adjust(name, value) {
        Notify(name.replace(/^set_/, "ui_"), value.toString());
        Notify(name, value);
    }
    Settings.userSet.volume.addEventListener("input", () => Adjust(SET_VOLUME, parseFloat(Settings.userSet.volume.value)));
    Settings.userSet.charWPM.addEventListener("input", () => Adjust(SET_WPM, parseInt(Settings.userSet.charWPM.value)));
    Settings.userSet.charSpacing.addEventListener("input", () => Adjust(SET_SPACING, parseInt(Settings.userSet.charSpacing.value)));
    Settings.userSet.pitch.addEventListener("input", () => Adjust(SET_PITCH, parseInt(Settings.userSet.pitch.value)));
    Settings.userSet.pasteTextBox.addEventListener("input", () => Adjust(SET_TEXT_BUFFER, Settings.userSet.pasteTextBox.value));
    Settings.userSet.voiceEnabled.addEventListener("change", () => Adjust(SET_VOICE, Settings.userSet.voiceEnabled.checked));
    Settings.userSet.lettersEnabled.addEventListener("change", () => Adjust(SET_LETTERS, Settings.userSet.lettersEnabled.checked));
    Settings.userSet.numbersEnabled.addEventListener("change", () => Adjust(SET_NUMBERS, Settings.userSet.numbersEnabled.checked));
    Settings.userSet.symbolsEnabled.addEventListener("change", () => Adjust(SET_SYMBOLS, Settings.userSet.symbolsEnabled.checked));
    resetSettingsButton.addEventListener("click", () => {
        Adjust(SET_SPACING, defaults.charSpacing);
        Adjust(SET_LETTERS, defaults.lettersEnabled);
        Adjust(SET_NUMBERS, defaults.numbersEnabled);
        Adjust(SET_PITCH, defaults.pitch);
        Adjust(SET_SYMBOLS, defaults.symbolsEnabled);
        Adjust(SET_VOICE, defaults.voiceEnabled);
        Adjust(SET_VOLUME, defaults.volume);
        Adjust(SET_WPM, defaults.wpm);
    });
    // Update UI in response to settings changes
    Listen(SET_SPACING, (value) => {
        charSpacingText.value = value.toString();
        Settings.userSet.charSpacing.value = value.toString();
    });
    Listen(SET_LETTERS, (value) => Settings.userSet.lettersEnabled.checked = value);
    Listen(SET_NUMBERS, (value) => Settings.userSet.numbersEnabled.checked = value);
    Listen(SET_PITCH, (value) => {
        pitchText.value = value.toString();
        Settings.userSet.pitch.value = value.toString();
    });
    Listen(SET_SYMBOLS, (value) => Settings.userSet.symbolsEnabled.checked = value);
    Listen(SET_TEXT_BUFFER, (value) => Settings.userSet.pasteTextBox.value = value);
    Listen(SET_VOICE, (value) => Settings.userSet.voiceEnabled.checked = value);
    Listen(SET_VOLUME, (value) => {
        volumeText.value = Math.floor(value * 100).toString();
        Settings.userSet.volume.value = value.toString();
    });
    Listen(SET_WPM, (value) => {
        charWPMText.value = value.toString();
        Settings.userSet.charWPM.value = value.toString();
    });
    document.addEventListener("DOMContentLoaded", () => {
        // Trigger events to initialize state
        Notify(SET_VOLUME, localStorage.getItem("volume") || defaults.volume);
        Notify(SET_WPM, localStorage.getItem("wpm") || defaults.wpm);
        Notify(SET_PITCH, localStorage.getItem("pitch") || defaults.pitch);
        Notify(SET_SPACING, localStorage.getItem("charSpacing") || defaults.charSpacing);
        const voiceEnabledStorage = localStorage.getItem("voiceEnabled");
        if (voiceEnabledStorage == null)
            Notify(SET_VOICE, defaults.voiceEnabled);
        else
            Notify(SET_VOICE, voiceEnabledStorage === "true");
        const lettersEnabledStorage = localStorage.getItem("lettersEnabled");
        if (lettersEnabledStorage == null)
            Notify(SET_LETTERS, defaults.lettersEnabled);
        else
            Notify(SET_LETTERS, lettersEnabledStorage === "true");
        const numbersEnabledStorage = localStorage.getItem("numbersEnabled");
        if (numbersEnabledStorage == null)
            Notify(SET_NUMBERS, defaults.numbersEnabled);
        else
            Notify(SET_NUMBERS, numbersEnabledStorage === "true");
        const symbolsEnabledStorage = localStorage.getItem("symbolsEnabled");
        if (symbolsEnabledStorage == null)
            Notify(SET_SYMBOLS, defaults.symbolsEnabled);
        else
            Notify(SET_SYMBOLS, symbolsEnabledStorage === "true");
    });
})(Settings || (Settings = {}));
/// <reference path="../events.ts"/>
/// <reference path="../query.ts"/>
var Views;
(function (Views) {
    function view(selector, menuItem) {
        const views = QueryAll(".view");
        for (let i = 0; i < views.length; ++i) {
            const view = views[i];
            if (!view.classList.contains("disabled"))
                view.classList.add("disabled");
        }
        const viewToShow = Query(selector);
        viewToShow.classList.remove("disabled");
        // Highlight the menu item
        const controls = QueryAll(".menu .btn");
        for (let i = 0; i < controls.length; ++i) {
            const control = controls[i];
            control.classList.remove("active");
        }
        menuItem.classList.add("active");
    }
    Listen(VIEW_HOME, () => view(".home", Query(".btn-home")));
    Listen(VIEW_SETTINGS, () => view(".settings", Query(".btn-settings")));
    Listen(VIEW_PLAYING, () => view(".playing", Query(".btn-playing")));
    Listen(VIEW_STORIES, () => view(".stories", Query(".btn-stories")));
    Listen(VIEW_TEXT, () => view(".paste", Query(".btn-paste")));
})(Views || (Views = {}));

//# sourceMappingURL=app.js.map
