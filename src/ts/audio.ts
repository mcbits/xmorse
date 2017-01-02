import * as Morse from "./morsetable";

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export let textBuffer = "";
export let textBufferIndex = 0;

// Events
export const patternCompleteEvent = new CustomEvent("patterncomplete", {detail: {}});
export const audioLoadedEvent = new Event("audioloaded");

export class Player {
    public audioSources: { [char: string]: AudioBuffer } = {};
    public pitch = 700;
    public mainVolume = 0.5;
    public oscillatorVolume = 0.9;
    public wpm = 18;
    public charSpacing = 25;
    public timeUnit = () => 1.2 / this.wpm * 1000;
    public ramp = 0.01;
    public playing = false;
    public paused = false;
    public currentCharacter: Morse.Character = null;
    public voiceEnabled = true;

    // Audio parts
    public audioCtx: AudioContext = new (AudioContext || window["webkitAudioContext"])();
    public oscillator = this.audioCtx.createOscillator();
    public oscillatorGain = this.audioCtx.createGain();
    public voiceGain = this.audioCtx.createGain();
    public masterGain = this.audioCtx.createGain();

    private letterElement: HTMLElement;
    private morseTable: Morse.Table;

    constructor(letterElement: HTMLElement, morseTable: Morse.Table) {
        this.letterElement = letterElement;
        this.morseTable = morseTable;

        // Wire up audio parts
        this.oscillator.frequency.value = this.pitch;
        this.oscillatorGain.gain.value = 0;
        this.oscillator.connect(this.oscillatorGain);
        this.oscillatorGain.connect(this.masterGain);

        this.voiceGain.gain.value = 0.6;
        this.voiceGain.connect(this.masterGain);

        this.masterGain.gain.value = this.mainVolume;
        this.masterGain.connect(this.audioCtx.destination);

        this.oscillator.start(0);
    }

    public playPattern = async (char: Morse.Character): Promise<void> => {
        let pattern: string;

        const on = () => this.oscillatorGain.gain.setTargetAtTime(this.oscillatorVolume, this.audioCtx.currentTime, this.ramp);
        const off = () => this.oscillatorGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, this.ramp);
        const patternComplete = () => document.dispatchEvent(patternCompleteEvent);

        const playTone = async (index: number): Promise<void> => {
            if (this.playing && !this.paused) {
                const blip = pattern.charAt(index++);

                on();

                if (blip === ".")
                    await delay(this.timeUnit());
                else if (blip === "-")
                    await delay(this.timeUnit() * 3);

                off();

                await delay(this.timeUnit());

                if (index < pattern.length)
                    playTone(index);
                else
                    patternComplete();
            }
        }

        if (char == null) {
            patternComplete();
        }
        else {
            pattern = char.pattern;
            this.letterElement.innerHTML = pattern;

            await playTone(0)
        }
    }

    public playNextPattern = async (): Promise<void> => {
        if (this.playing && !this.paused) {
            if (textBuffer.length > 0) {
                if (textBufferIndex >= textBuffer.length)
                    textBufferIndex = 0;
                this.currentCharacter = this.morseTable.getCharacter(textBuffer[textBufferIndex]);
            }
            else {
                this.currentCharacter = this.morseTable.randomCharacter();
            }

            await delay(this.timeUnit() * this.charSpacing);

            await this.playPattern(this.currentCharacter);
        }
    }

    public playVoice = async (): Promise<void> => {
        await delay(this.timeUnit() * this.charSpacing);

        if (this.playing && !this.paused) {
            const char = this.currentCharacter.name;
            const buffer = this.audioSources[char];
            if (typeof buffer !== "undefined") {
                const audioSource = this.audioCtx.createBufferSource();
                audioSource.addEventListener("ended", this.playNextPattern);
                audioSource.buffer = buffer;
                audioSource.connect(this.voiceGain);
                audioSource.start(0);
            }
        }
    }

    public updateVolume = (value: number) => {
        this.mainVolume = value;
        this.masterGain.gain.setTargetAtTime(this.mainVolume, this.audioCtx.currentTime, 0.01);
    }

    public updateWPM = (value: number) => {
        this.wpm = value;
    }

    public updateCharSpacing = (value: number) => {
        this.charSpacing = value;
    }

    public updatePitch = (value: number) => {
        this.pitch = value;
        this.oscillator.frequency.value = this.pitch;
    }

    public startPlaying = async () => {
        this.playing = true;
        this.paused = false;
        await this.playNextPattern();
    }

    public stopPlaying = () => {
        this.playing = false;
        this.paused = false;
    }

    public loadAudio = (charDef: Morse.Character) => {
        const char = charDef.name;
        let request: XMLHttpRequest;

        const decodeSuccess = (buffer: AudioBuffer) => {
            this.audioSources[char] = buffer;
            document.dispatchEvent(audioLoadedEvent);
        }

        const decodeFail = (err: DOMException) => {
            console.log("Error loading audio source: ", err)
        }

        const audioDownloaded = (evt: Event) => {
            const response = request.response;
            this.audioCtx.decodeAudioData(response, decodeSuccess, decodeFail);
        }

        if (typeof this.audioSources[char] !== "undefined") {
            document.dispatchEvent(audioLoadedEvent);
            return this.audioSources[char];
        }
        else {
            request = new XMLHttpRequest();

            const filename = char.replace(/\W/g, "") + ".mp3";
            request.open("GET", "/audio/" + filename, true);
            request.responseType = "arraybuffer";
            request.addEventListener("load", audioDownloaded);

            request.send();
        }
    }
        
    public patternComplete = () => {
        if (textBuffer.length > 0) {
            ++textBufferIndex;

            if (textBufferIndex === textBuffer.length)
                textBufferIndex = 0;
        }

        if (this.currentCharacter != null)
        {
            this.letterElement.innerHTML = this.currentCharacter.name;
            if (this.playing && !this.paused) {
                if (this.voiceEnabled)
                    this.loadAudio(this.currentCharacter);
                else {
                    this.playNextPattern();
                }
            }
        }
        else {
            this.playNextPattern();
        }
    }
}

