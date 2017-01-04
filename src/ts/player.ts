import * as Morse from "./morsetable";
import {
    Trigger, Handle,
    NOW_PLAYING, WPM, CHAR_SPACING, PATTERN_COMPLETE, VOLUME, LETTER,
    VOICE_ENABLED, VOICE_DONE, START, STOP, TEXT_BUFFER
} from "./events";
import { TonePlayer } from "./toneplayer";
import { VoicePlayer } from "./voiceplayer";

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export class Player {
    private tonePlayer: TonePlayer;
    private voicePlayer: VoicePlayer;
    private nowPlaying: boolean;
    private charSpacing: number;
    private unitTime: number;
    private currentCharacter: Morse.CharacterInfo = null;

    public voiceEnabled = true;

    // Audio parts
    public audioCtx: AudioContext = new (AudioContext || window["webkitAudioContext"])();
    public masterGain = this.audioCtx.createGain();

    public textBuffer = "";
    public textBufferIndex = 0;

    constructor(private morseTable: Morse.Table) {
        this.tonePlayer = new TonePlayer(this.audioCtx);
        this.voicePlayer = new VoicePlayer(this.audioCtx);

        this.tonePlayer.oscillatorGain.connect(this.masterGain);
        this.voicePlayer.voiceGain.connect(this.masterGain);
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.audioCtx.destination);

        Handle(NOW_PLAYING, (value: boolean) => this.nowPlaying = value);
        Handle(WPM, (value: number) => this.unitTime = 1.2 / value * 1000);
        Handle(CHAR_SPACING, (value: number) => this.charSpacing = value);
        Handle(VOICE_DONE, this.playNextPattern);
        Handle(STOP, this.stopPlaying);
        Handle(START, this.startPlaying);
        Handle(PATTERN_COMPLETE, this.patternComplete);
        Handle(VOLUME, this.updateVolume);
        Handle(TEXT_BUFFER, this.updateTextBuffer);
        Handle(VOICE_ENABLED, (value: boolean) => this.voiceEnabled = value);
    }

    public playNextPattern = async (): Promise<void> => {
        if (this.nowPlaying) {
            if (this.textBuffer.length > 0) {
                if (this.textBufferIndex >= this.textBuffer.length)
                    this.textBufferIndex = 0;
                this.currentCharacter = this.morseTable.getCharacter(this.textBuffer[this.textBufferIndex]);
            }
            else {
                this.currentCharacter = this.morseTable.randomCharacter();
            }

            await delay(this.unitTime * this.charSpacing);

            await this.tonePlayer.playPattern(this.currentCharacter);
        }
    }

    public updateVolume = (value: number) => {
        this.masterGain.gain.setTargetAtTime(value, this.audioCtx.currentTime, 0.01);
    }

    public startPlaying = async () => {
        Trigger(NOW_PLAYING, true);
        await this.playNextPattern();
    }

    public stopPlaying = () => {
        Trigger(NOW_PLAYING, false);
    }

    public updateTextBuffer = (text: string) => {
        this.textBuffer = text;
        this.textBufferIndex = 0;
    }

    public patternComplete = (char: Morse.CharacterInfo) => {
        if (this.textBuffer.length > 0) {
            ++this.textBufferIndex;

            if (this.textBufferIndex === this.textBuffer.length)
                this.textBufferIndex = 0;
        }

        if (this.currentCharacter != null) {
            Trigger(LETTER, char.name);

            if (this.nowPlaying) {
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

