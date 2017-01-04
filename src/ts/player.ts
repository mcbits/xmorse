import * as Morse from "./morsetable";
import { MorseParams } from "./morseparams";
import { TonePlayer } from "./toneplayer";
import { VoicePlayer } from "./voiceplayer";

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export class Player {
    public voiceEnabled = true;

    // Audio parts
    public audioCtx: AudioContext = new (AudioContext || window["webkitAudioContext"])();
    public masterGain = this.audioCtx.createGain();

    public textBuffer = "";
    public textBufferIndex = 0;

    private tonePlayer: TonePlayer;
    private voicePlayer: VoicePlayer;

    constructor(private morseTable: Morse.Table, private params: MorseParams) {
        this.tonePlayer = new TonePlayer(this.audioCtx, this.params);
        this.voicePlayer = new VoicePlayer(this.audioCtx, this.params);

        document.addEventListener("audioloaded", this.voicePlayer.playVoice);
        document.addEventListener("voicedoneplaying", this.playNextPattern);

        this.tonePlayer.oscillatorGain.connect(this.masterGain);
        this.voicePlayer.voiceGain.connect(this.masterGain);
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.audioCtx.destination);
    }

    public playNextPattern = async (): Promise<void> => {
        if (this.params.nowPlaying()) {
            if (this.textBuffer.length > 0) {
                if (this.textBufferIndex >= this.textBuffer.length)
                    this.textBufferIndex = 0;
                this.params.currentCharacter = this.morseTable.getCharacter(this.textBuffer[this.textBufferIndex]);
            }
            else {
                this.params.currentCharacter = this.morseTable.randomCharacter();
            }

            await delay(this.params.unitTime() * this.params.charSpacing);

            await this.tonePlayer.playPattern(this.params.currentCharacter);
        }
    }

    public updateVolume = (value: number) => {
        this.masterGain.gain.setTargetAtTime(value, this.audioCtx.currentTime, 0.01);
    }

    public startPlaying = async () => {
        this.params.nowPlaying(true);
        await this.playNextPattern();
    }

    public stopPlaying = () => {
        this.params.nowPlaying(false);
    }

    public updateTextBuffer(text: string) {
        this.textBuffer = text;
        this.textBufferIndex = 0;
    }

    public patternComplete = (char: Morse.CharacterInfo) => {
        if (this.textBuffer.length > 0) {
            ++this.textBufferIndex;

            if (this.textBufferIndex === this.textBuffer.length)
                this.textBufferIndex = 0;
        }

        if (this.params.currentCharacter != null) {
            this.params.letterElement.innerHTML = char.name;
            if (this.params.nowPlaying()) {
                if (this.voiceEnabled)
                    this.voicePlayer.loadAudio(char);
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

