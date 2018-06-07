var AudioCtx = new AudioContext();
// Wire up audio
var MasterGain = AudioCtx.createGain();
MasterGain.gain.value = 0.5;
MasterGain.connect(AudioCtx.destination);
var VoiceGain = AudioCtx.createGain();
VoiceGain.gain.value = 0.80;
VoiceGain.connect(MasterGain);
var ToneGain = AudioCtx.createGain();
ToneGain.gain.value = 1;
ToneGain.connect(MasterGain);
function Notify(name, value) {
    document.dispatchEvent(new CustomEvent(name, { detail: value }));
}
function Listen(name, handler) {
    document.addEventListener(name, function (evt) { return handler(evt.detail); });
}
var VIEW_HOME = "view_home";
var VIEW_SETTINGS = "view_settings";
var VIEW_PLAYING = "view_player";
var VIEW_STORIES = "view_stories";
var VIEW_TEXT = "view_text";
var FullScreen;
(function (FullScreen) {
    var fullScreenButton = Query(".btn-fullscreen");
    var playingView = document.body.parentElement;
    var controls = Query(".controls");
    var menu = Query(".menu");
    var sidebar = Query(".sidebar");
    var isFullScreen = false;
    var hideControlsInterval;
    var lastActivity = Date.now();
    var hideControlsMS = 2000;
    var controlsVisible = false;
    var cursorVisible = false;
    function exitFullScreen() {
        document.body.classList.remove("fullscreen");
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document["webkitExitFullscreen"])
            document["webkitExitFullscreen"]();
        else if (document["mozCancelFullScreen"])
            document["mozCancelFullScreen"]();
        clearInterval(hideControlsInterval);
        document.removeEventListener("mousemove", markTime);
    }
    function enterFullScreen() {
        document.addEventListener("mousemove", markTime);
        hideControlsInterval = setInterval(hideOrReveal, 200);
        if (document.fullscreenEnabled)
            playingView.requestFullscreen();
        else if (document["webkitFullscreenEnabled"])
            playingView["webkitRequestFullscreen"]();
        else if (document["mozFullScreenEnabled"])
            playingView["mozRequestFullScreen"]();
        document.body.classList.add("fullscreen");
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
    function StopPlaying() {
        showCursor();
        showControls();
        if (isFullScreen)
            exitFullScreen();
    }
    FullScreen.StopPlaying = StopPlaying;
    function Initialize() {
        if (document.fullscreenEnabled)
            document.addEventListener("fullscreenchange", fullScreenChanged);
        else if (document["webkitFullscreenEnabled"])
            document.addEventListener("webkitfullscreenchange", fullScreenChanged);
        else if (document["mozFullScreenEnabled"])
            document.addEventListener("mozfullscreenchange", fullScreenChanged);
        fullScreenButton.addEventListener("click", toggleFullScreen);
    }
    FullScreen.Initialize = Initialize;
})(FullScreen || (FullScreen = {}));
var Morse;
(function (Morse) {
    // 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z . ? ! , : ; ' - / ( ) @ = + "
    var spacePatterns = {
        "": { name: "", pattern: "" },
        " ": { name: " ", pattern: " " },
    };
    var letterPatterns = {
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
    var numberPatterns = {
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
    var symbolPatterns = {
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
    var symbolNames = {
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
    var letters = Object.keys(letterPatterns);
    var numbers = Object.keys(numberPatterns);
    var symbols = Object.keys(symbolPatterns);
    var lettersEnabled = true;
    var numbersEnabled = false;
    var symbolsEnabled = false;
    function AllCharacters() {
        return letters.map(function (l) { return letterPatterns[l]; })
            .concat(numbers.map(function (n) { return numberPatterns[n]; }))
            .concat(symbols.map(function (s) { return symbolPatterns[s]; }));
    }
    Morse.AllCharacters = AllCharacters;
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
        return spacePatterns[""];
    }
    Morse.RandomCharacter = RandomCharacter;
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
        if (char === "")
            return spacePatterns[""];
        if (char === " ")
            return spacePatterns[" "];
        return undefined;
    }
    Morse.GetCharacter = GetCharacter;
    function fileName(char) {
        if (Object.keys(letterPatterns).indexOf(char.name) > -1
            || Object.keys(numberPatterns).indexOf(char.name) > -1
            || Object.keys(symbolNames).indexOf(char.name) > -1) {
            var fileName_1 = symbolNames[char.name];
            if (!fileName_1)
                fileName_1 = char.name;
            fileName_1 += ".mp3";
            return fileName_1;
        }
        return undefined;
    }
    Morse.fileName = fileName;
    function SetNumbers(value) {
        numbersEnabled = value;
    }
    Morse.SetNumbers = SetNumbers;
    function SetLetters(value) {
        lettersEnabled = value;
    }
    Morse.SetLetters = SetLetters;
    function SetSymbols(value) {
        symbolsEnabled = value;
    }
    Morse.SetSymbols = SetSymbols;
})(Morse || (Morse = {}));
var Player;
(function (Player) {
    var nowPlaying;
    function PlayNextPattern() {
        if (nowPlaying) {
            // Fetch a tuple containing the next character and any unplayable text before it (whitespace, etc).
            var _a = TextLoader.Next() || [" ", Morse.GetCharacter(" ")], text = _a[0], morseChar = _a[1];
            if (morseChar) {
                var sleepTime = 0;
                // If there is unplayable text, send it to the output buffer and delay for one word-break.
                if (text !== morseChar.name) {
                    UI.EmitOutput(text.substr(0, text.length - 1));
                    UI.DrawPattern(" ");
                    UI.EmitCharacter("");
                }
                VoicePlayer.PreloadVoice(morseChar);
                TonePlayer.PlayPattern(morseChar);
            }
            else {
                UI.DrawPattern("");
                Player.PatternComplete(null);
                UI.PatternComplete(null);
            }
        }
    }
    Player.PlayNextPattern = PlayNextPattern;
    function StartPlaying() {
        if (!nowPlaying) {
            nowPlaying = true;
            setTimeout(PlayNextPattern, 500);
            UI.StartPlaying();
        }
    }
    Player.StartPlaying = StartPlaying;
    function StopPlaying() {
        nowPlaying = false;
        VoicePlayer.Cancel();
        TonePlayer.StopPlaying();
    }
    Player.StopPlaying = StopPlaying;
    function PatternComplete(char) {
        if (nowPlaying) {
            // PlayNextPattern() will be called by VOICE_DONE (which is
            // triggered whether the voice is currently enabled or not).
            VoicePlayer.PlayVoice(char);
        }
    }
    Player.PatternComplete = PatternComplete;
})(Player || (Player = {}));
function Query(selector, element) {
    return (element || document).querySelector(selector);
}
function QueryAll(selector, element) {
    return (element || document).querySelectorAll(selector);
}
function QueryId(id) {
    return document.getElementById(id);
}
var Routing;
(function (Routing) {
    var routes = {
        "": VIEW_HOME,
        "#playing": VIEW_PLAYING,
        "#settings": VIEW_SETTINGS,
        "#stories": VIEW_STORIES,
        "#text": VIEW_TEXT
    };
    function processHash() {
        var hash = location.hash;
        if (routes[hash])
            Notify(routes[hash], null);
        if (hash === "" && location.href.indexOf("#") > -1)
            history.replaceState("", document.title, window.location.pathname);
    }
    window.addEventListener("hashchange", processHash);
    document.addEventListener("DOMContentLoaded", processHash);
})(Routing || (Routing = {}));
var TextLoader;
(function (TextLoader) {
    var textBuffer = "";
    var textBufferIndex = -1;
    function ResetPosition() {
        textBufferIndex = textBuffer.length > 0 ? 0 : -1;
    }
    TextLoader.ResetPosition = ResetPosition;
    function SetTextBuffer(text) {
        UI.StopPlaying();
        UI.ClearOutput();
        textBuffer = text.toUpperCase().trim() + "\n";
        ResetPosition();
    }
    TextLoader.SetTextBuffer = SetTextBuffer;
    function LoadBook(href) {
        Player.StopPlaying();
        fetch(href, { method: "GET" }).then(function (response) {
            return response.text().then(function (value) {
                UI.playState = "stopped";
                Settings.SetTextBuffer(value);
                Player.StartPlaying();
            });
        });
    }
    TextLoader.LoadBook = LoadBook;
    function Next() {
        if (textBuffer.length > 0) {
            var startingIndex = textBufferIndex;
            var text = "";
            do {
                text += textBuffer[textBufferIndex];
                var morseChar = Morse.GetCharacter(textBuffer[textBufferIndex]);
                // Increment and wrap around if necessary
                ++textBufferIndex;
                if (textBufferIndex === textBuffer.length)
                    textBufferIndex = 0;
                if (morseChar)
                    return [text, morseChar];
            } while (textBufferIndex !== startingIndex);
            return ["", null];
        }
        var char = Morse.RandomCharacter();
        return [char.name, char];
    }
    TextLoader.Next = Next;
})(TextLoader || (TextLoader = {}));
var TonePlayer;
(function (TonePlayer) {
    var ditUnits = 1;
    var dahUnits = 3;
    var sampleRate = 48000;
    var ditBuffer;
    var dahBuffer;
    var charSpaceBuffer;
    var wordSpaceBuffer;
    var currentBufferSource;
    var ramp = 0.01;
    var frequency = 650;
    var charSpacing = 2;
    var unitTime;
    function addToneToBuffer(units, samplesPerUnit, data, initialSample) {
        var omega = 2 * Math.PI * frequency / sampleRate;
        // Number of audio samples in the ramp up/down periods.
        var rampSamples = Math.min(Math.ceil(ramp * sampleRate), samplesPerUnit);
        // Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
        var soundSamples = Math.ceil(samplesPerUnit * units);
        // Ramp up
        for (var t = initialSample, rampPos = 0; t < initialSample + rampSamples; ++t, ++rampPos) {
            data[t] = Math.sin(omega * t) * (rampPos / rampSamples);
        }
        // Main sine wave
        for (var t = initialSample + rampSamples; t < initialSample + soundSamples - rampSamples; ++t) {
            data[t] = Math.sin(omega * t);
        }
        // Ramp down
        for (var t = initialSample + soundSamples - rampSamples, rampPos = rampSamples; t < initialSample + soundSamples; ++t, --rampPos) {
            data[t] = Math.sin(omega * t) * (rampPos / rampSamples);
        }
    }
    // Normally dit and dah are 10 and 1110 in binary, which are 2 and 4 units.
    function countUnitsInPattern(pattern) {
        var total = 0;
        for (var i = 0; i < pattern.length; ++i) {
            total += (pattern[i] === "." ? ditUnits : dahUnits) + ditUnits;
        }
        return total;
    }
    function createCharacterBuffer(char) {
        var pattern = char.pattern;
        // Number of dit-length units in the pattern.
        var units = countUnitsInPattern(pattern);
        // Number of audio samples per Morse code unit of time.
        var samplesPerUnit = Math.ceil(unitTime * sampleRate);
        // Number of audio samples in the ramp up/down periods.
        var rampSamples = Math.min(Math.ceil(ramp * sampleRate), samplesPerUnit);
        // Number of samples containing audio. Ramp-up is included in the "on" time, but ramp-down is appended.
        var soundSamples = Math.ceil(samplesPerUnit * units);
        // Total samples in the clip. This is the "on" time + ramp-down time + any remaining silence.
        var totalSamples = Math.ceil(samplesPerUnit * units + (samplesPerUnit * charSpacing));
        var buffer = AudioCtx.createBuffer(1, totalSamples, sampleRate);
        var data = buffer.getChannelData(0);
        var pos = 0;
        for (var i = 0; i < pattern.length; ++i) {
            switch (pattern[i]) {
                case ".":
                    addToneToBuffer(ditUnits, samplesPerUnit, data, pos);
                    pos += samplesPerUnit * (ditUnits + ditUnits);
                    break;
                case "-":
                    addToneToBuffer(dahUnits, samplesPerUnit, data, pos);
                    pos += samplesPerUnit * (dahUnits + ditUnits);
                    break;
            }
        }
        return buffer;
    }
    function InitializeBuffers() {
        var allCharacters = Morse.AllCharacters();
        for (var i = 0; i < allCharacters.length; ++i) {
            var char = allCharacters[i];
            var buffer = createCharacterBuffer(char);
            char.toneAudioBuffer = buffer;
        }
        var emptyChar = Morse.GetCharacter("");
        var spaceChar = Morse.GetCharacter(" ");
        var charSpaceTime = unitTime * sampleRate * charSpacing;
        emptyChar.toneAudioBuffer = AudioCtx.createBuffer(1, charSpaceTime, sampleRate);
        spaceChar.toneAudioBuffer = AudioCtx.createBuffer(1, charSpaceTime * 3, sampleRate);
    }
    TonePlayer.InitializeBuffers = InitializeBuffers;
    function SetFrequency(value) {
        frequency = value;
        InitializeBuffers();
    }
    TonePlayer.SetFrequency = SetFrequency;
    function SetCharSpacing(value) {
        charSpacing = value;
        InitializeBuffers();
    }
    TonePlayer.SetCharSpacing = SetCharSpacing;
    // With 60 seconds per minute and 50 units in "PARIS":
    //     UnitTime in seconds = 60 / (WPM * 50)
    // This simplifies to 1.2 / WPM.
    function SetWpm(value) {
        unitTime = 1.2 / value;
        InitializeBuffers();
    }
    TonePlayer.SetWpm = SetWpm;
    function StopPlaying() {
        if (currentBufferSource)
            currentBufferSource.stop();
    }
    TonePlayer.StopPlaying = StopPlaying;
    function PlayPattern(char) {
        UI.EmitCharacter(char.name);
        UI.DrawPattern(char.pattern);
        currentBufferSource = AudioCtx.createBufferSource();
        currentBufferSource.connect(ToneGain);
        currentBufferSource.buffer = char.toneAudioBuffer;
        currentBufferSource.addEventListener("ended", function () {
            UI.PatternComplete(char);
            Player.PatternComplete(char);
        });
        currentBufferSource.start();
    }
    TonePlayer.PlayPattern = PlayPattern;
})(TonePlayer || (TonePlayer = {}));
var VoicePlayer;
(function (VoicePlayer) {
    // For caching audio files as they're loaded
    var audioBuffers = {};
    var loading = {};
    var loaded = {};
    var playWhenDone = false;
    var enabled = false;
    function voiceLoaded(char) {
        var playNow = playWhenDone;
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
                .then(function (response) {
                if (response.status === 200)
                    response.arrayBuffer()
                        .then(function (arrayBuffer) {
                        AudioCtx.decodeAudioData(arrayBuffer, function (audioBuffer) {
                            audioBuffers[char.name] = audioBuffer;
                            loading[char.name] = false;
                            loaded[char.name] = true;
                            voiceLoaded(char);
                        }, function (err) { return console.error("Error decoding audio source: ", err); });
                    });
                else {
                    console.error("Failed to load voice for char: ", char);
                    loading[char.name] = false;
                    playWhenDone = false;
                    Player.PlayNextPattern();
                }
            })
                .catch(function (reason) { return console.error(reason); });
        }
    }
    function SetEnabled(value) {
        enabled = value;
    }
    VoicePlayer.SetEnabled = SetEnabled;
    function Cancel() {
        playWhenDone = false;
    }
    VoicePlayer.Cancel = Cancel;
    function PreloadVoice(char) {
        if (enabled && !loaded[char.name] && loading[char.name])
            loadVoice(char);
    }
    VoicePlayer.PreloadVoice = PreloadVoice;
    function PlayVoice(char) {
        if (!enabled || char == null || Morse.fileName(char) === undefined)
            Player.PlayNextPattern();
        else if (loading[char.name])
            playWhenDone = true;
        else if (!loaded[char.name]) {
            playWhenDone = true;
            loadVoice(char);
        }
        else {
            var buffer = audioBuffers[char.name];
            var audioSource = AudioCtx.createBufferSource();
            audioSource.addEventListener("ended", Player.PlayNextPattern);
            audioSource.buffer = buffer;
            audioSource.connect(VoiceGain);
            audioSource.start(0);
        }
    }
    VoicePlayer.PlayVoice = PlayVoice;
})(VoicePlayer || (VoicePlayer = {}));
var UI;
(function (UI) {
    var homeBtn = Query(".btn-home");
    var startBtns = QueryAll(".btn-start");
    var startBtn = Query(".btn-start");
    var pauseBtn = Query(".btn-pause");
    var stopBtn = Query(".btn-stop");
    var gearBtn = Query(".btn-gear");
    var letterElement = Query(".letter");
    var outputBuffer = Query(".outputBuffer");
    var storyLinks = QueryAll(".story a");
    var patternEl = Query(".view.playing .pattern");
    UI.playState = "stopped";
    for (var i = 0; i < startBtns.length; ++i) {
        startBtns[i].addEventListener("click", function () { return Player.StartPlaying(); });
    }
    pauseBtn.addEventListener("click", function () { return UI.PausePlaying(); });
    stopBtn.addEventListener("click", function () { return UI.StopPlaying(); });
    gearBtn.addEventListener("click", function () { return location.hash = "settings"; });
    for (var i = 0; i < storyLinks.length; ++i) {
        var storyLink = storyLinks[i];
        storyLink.addEventListener("click", function (evt) {
            evt.preventDefault();
            var anchor = evt.target;
            var href = anchor.href;
            TextLoader.LoadBook(href);
        });
    }
    function ClearOutput() {
        outputBuffer.innerHTML = "";
    }
    UI.ClearOutput = ClearOutput;
    function StartPlaying() {
        if (AudioCtx.state === "suspended")
            AudioCtx.resume();
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        startBtn.style.display = "none";
        pauseBtn.style.display = "initial";
        UI.playState = "started";
        location.hash = "#playing";
    }
    UI.StartPlaying = StartPlaying;
    function PausePlaying() {
        UI.playState = "paused";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = false;
        pauseBtn.style.display = "none";
        startBtn.style.display = "initial";
        Player.StopPlaying();
    }
    UI.PausePlaying = PausePlaying;
    function StopPlaying() {
        UI.playState = "stopped";
        outputBuffer.innerHTML = "";
        letterElement.innerHTML = "";
        patternEl.innerHTML = "";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        pauseBtn.style.display = "none";
        startBtn.style.display = "initial";
        Player.StopPlaying();
        FullScreen.StopPlaying();
        TextLoader.ResetPosition();
    }
    UI.StopPlaying = StopPlaying;
    function EmitCharacter(char) {
        letterElement.innerHTML = char;
    }
    UI.EmitCharacter = EmitCharacter;
    function EmitOutput(value) {
        outputBuffer.innerHTML += value;
        outputBuffer.scrollTop = outputBuffer.scrollHeight;
    }
    UI.EmitOutput = EmitOutput;
    function DrawPattern(pattern) {
        function make(className) {
            var el = document.createElement("span");
            el.classList.add("element");
            el.classList.add(className);
            return el;
        }
        patternEl.appendChild(make("charSpace"));
        for (var i = 0; i < pattern.length; ++i) {
            var el = void 0;
            if (pattern[i] === ".")
                el = make("dit");
            else if (pattern[i] === "-")
                el = make("dah");
            else if (pattern[i] === " ")
                el = make("wordSpace");
            patternEl.appendChild(el);
        }
    }
    UI.DrawPattern = DrawPattern;
    function PatternComplete(char) {
        if (UI.playState !== "stopped") {
            outputBuffer.innerHTML += char == null ? " " : char.name;
            outputBuffer.scrollTop = outputBuffer.scrollHeight;
        }
    }
    UI.PatternComplete = PatternComplete;
})(UI || (UI = {}));
var Settings;
(function (Settings) {
    var resetSettingsButton = QueryId("resetSettings");
    // Settings text labels
    var volumeText = Query(".volumeText");
    var charWPMText = Query(".charWPMText");
    var pitchText = Query(".pitchText");
    var charSpacingText = Query(".charSpacingText");
    // Settings inputs
    var settingsUI = {
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
    var defaults = {
        charSpacing: 2,
        lettersEnabled: true,
        numbersEnabled: false,
        pitch: 650,
        symbolsEnabled: false,
        voiceEnabled: true,
        volume: 0.40,
        wpm: 10
    };
    settingsUI.volume.addEventListener("input", function () {
        var value = parseFloat(settingsUI.volume.value);
        localStorage.setItem("volume", value.toString());
        setVolume(value);
    });
    settingsUI.charWPM.addEventListener("input", function () {
        var value = parseInt(settingsUI.charWPM.value);
        localStorage.setItem("wpm", value.toString());
        setWpm(value);
    });
    settingsUI.charSpacing.addEventListener("input", function () {
        var value = parseInt(settingsUI.charSpacing.value);
        localStorage.setItem("charSpacing", value.toString());
        setCharSpacing(value);
    });
    settingsUI.pitch.addEventListener("input", function () {
        var value = parseInt(settingsUI.pitch.value);
        localStorage.setItem("pitch", value.toString());
        setPitch(value);
    });
    settingsUI.pasteTextBox.addEventListener("input", function () {
        var value = settingsUI.pasteTextBox.value;
        localStorage.setItem("textBuffer", value.toString());
        SetTextBuffer(value);
    });
    settingsUI.voiceEnabled.addEventListener("change", function () {
        var value = settingsUI.voiceEnabled.checked;
        localStorage.setItem("voiceEnabled", value.toString());
        VoicePlayer.SetEnabled(value);
    });
    settingsUI.lettersEnabled.addEventListener("change", function () {
        localStorage.setItem("lettersEnabled", settingsUI.lettersEnabled.checked.toString());
        Morse.SetLetters(settingsUI.lettersEnabled.checked);
        settingsUI.lettersEnabled.checked = settingsUI.lettersEnabled.checked;
    });
    settingsUI.numbersEnabled.addEventListener("change", function () {
        var numbersEnabled = settingsUI.numbersEnabled.checked;
        localStorage.setItem("numbersEnabled", numbersEnabled.toString());
        setNumbersEnabled(numbersEnabled);
    });
    settingsUI.symbolsEnabled.addEventListener("change", function () {
        localStorage.setItem("symbolsEnabled", settingsUI.symbolsEnabled.checked.toString());
        settingsUI.symbolsEnabled.checked = settingsUI.symbolsEnabled.checked;
        Morse.SetSymbols(settingsUI.symbolsEnabled.checked);
    });
    resetSettingsButton.addEventListener("click", function () {
        localStorage.setItem("charSpacing", defaults.charSpacing.toString());
        setCharSpacing(defaults.charSpacing);
        localStorage.setItem("lettersEnabled", defaults.lettersEnabled.toString());
        setLettersEnabled(defaults.lettersEnabled);
        localStorage.setItem("numbersEnabled", defaults.numbersEnabled.toString());
        setNumbersEnabled(defaults.numbersEnabled);
        localStorage.setItem("pitch", defaults.pitch.toString());
        setPitch(defaults.pitch);
        localStorage.setItem("symbolsEnabled", defaults.symbolsEnabled.toString());
        setSymbolsEnabled(defaults.symbolsEnabled);
        localStorage.setItem("voiceEnabled", defaults.voiceEnabled.toString());
        setVoiceEnabled(defaults.voiceEnabled);
        localStorage.setItem("volume", defaults.volume.toString());
        setVolume(defaults.volume);
        localStorage.setItem("wpm", defaults.wpm.toString());
        setWpm(defaults.wpm);
    });
    function SetTextBuffer(value) {
        TextLoader.SetTextBuffer(value);
        settingsUI.pasteTextBox.value = value;
    }
    Settings.SetTextBuffer = SetTextBuffer;
    function setVolume(value) {
        MasterGain.gain.setTargetAtTime(value, AudioCtx.currentTime, 0.01);
        volumeText.value = Math.floor(value * 100).toString();
        settingsUI.volume.value = value.toString();
    }
    function setWpm(value) {
        TonePlayer.SetWpm(value);
        charWPMText.value = value.toString();
        settingsUI.charWPM.value = value.toString();
    }
    function setPitch(value) {
        TonePlayer.SetFrequency(value);
        pitchText.value = value.toString();
        settingsUI.pitch.value = value.toString();
    }
    function setCharSpacing(value) {
        TonePlayer.SetCharSpacing(value);
        charSpacingText.value = value.toString();
        settingsUI.charSpacing.value = value.toString();
    }
    function setVoiceEnabled(value) {
        VoicePlayer.SetEnabled(value);
        settingsUI.voiceEnabled.checked = value;
    }
    function setLettersEnabled(value) {
        Morse.SetLetters(value);
        settingsUI.lettersEnabled.checked = value;
    }
    function setNumbersEnabled(value) {
        Morse.SetNumbers(value);
        settingsUI.numbersEnabled.checked = value;
    }
    function setSymbolsEnabled(value) {
        Morse.SetSymbols(value);
        settingsUI.symbolsEnabled.checked = value;
    }
    document.addEventListener("DOMContentLoaded", function () {
        FullScreen.Initialize();
        var volumeStorage = localStorage.getItem("volume");
        var volume = volumeStorage == null
            ? defaults.volume
            : parseFloat(volumeStorage);
        setVolume(volume);
        var wpmStorage = localStorage.getItem("wpm");
        var wpm = wpmStorage == null
            ? defaults.wpm
            : parseInt(wpmStorage);
        setWpm(wpm);
        var pitchStorage = localStorage.getItem("pitch");
        var pitch = pitchStorage == null
            ? defaults.pitch
            : parseInt(pitchStorage);
        setPitch(pitch);
        var charSpacingStorage = localStorage.getItem("charSpacing");
        var charSpacing = charSpacingStorage == null
            ? defaults.charSpacing
            : parseInt(charSpacingStorage);
        setCharSpacing(charSpacing);
        var voiceEnabledStorage = localStorage.getItem("voiceEnabled");
        var voiceEnabled = voiceEnabledStorage == null
            ? defaults.voiceEnabled
            : voiceEnabledStorage === "true";
        setVoiceEnabled(voiceEnabled);
        var lettersEnabledStorage = localStorage.getItem("lettersEnabled");
        var lettersEnabled = lettersEnabledStorage == null
            ? defaults.lettersEnabled
            : lettersEnabledStorage === "true";
        setLettersEnabled(lettersEnabled);
        var numbersEnabledStorage = localStorage.getItem("numbersEnabled");
        var numbersEnabled = numbersEnabledStorage == null
            ? defaults.numbersEnabled
            : numbersEnabledStorage === "true";
        setNumbersEnabled(numbersEnabled);
        var symbolsEnabledStorage = localStorage.getItem("symbolsEnabled");
        var symbolsEnabled = symbolsEnabledStorage == null
            ? defaults.symbolsEnabled
            : symbolsEnabledStorage === "true";
        setSymbolsEnabled(symbolsEnabled);
    });
})(Settings || (Settings = {}));
var Views;
(function (Views) {
    function view(selector, menuItem) {
        var views = QueryAll(".view");
        for (var i = 0; i < views.length; ++i) {
            var view_1 = views[i];
            if (!view_1.classList.contains("disabled"))
                view_1.classList.add("disabled");
        }
        var viewToShow = Query(selector);
        viewToShow.classList.remove("disabled");
        // Highlight the menu item
        var controls = QueryAll(".menu .btn");
        for (var i = 0; i < controls.length; ++i) {
            var control = controls[i];
            control.classList.remove("active");
        }
        menuItem.classList.add("active");
    }
    Listen(VIEW_HOME, function () { return view(".home", Query(".btn-home")); });
    Listen(VIEW_SETTINGS, function () { return view(".settings", Query(".btn-settings")); });
    Listen(VIEW_PLAYING, function () { return view(".playing", Query(".btn-playing")); });
    Listen(VIEW_STORIES, function () { return view(".stories", Query(".btn-stories")); });
    Listen(VIEW_TEXT, function () { return view(".paste", Query(".btn-paste")); });
})(Views || (Views = {}));

//# sourceMappingURL=app.js.map
