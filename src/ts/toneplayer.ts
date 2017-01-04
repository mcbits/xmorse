import * as Morse from "./morsetable";
import {
    Trigger, Handle, WPM, CHAR_SPACING, PITCH, NOW_PLAYING, PATTERN_COMPLETE, LETTER
} from "./events";

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export class TonePlayer {
    private nowPlaying: boolean;
    private charSpacing = 25;
    private unitTime: number;

    public oscillatorVolume = 0.9;
    public ramp = 0.01;

    public oscillator = this.audioCtx.createOscillator();
    public oscillatorGain = this.audioCtx.createGain();

    constructor(private audioCtx: AudioContext) {
        // Wire up audio parts
        this.oscillator.frequency.value = 700;
        this.oscillatorGain.gain.value = 0;
        this.oscillator.connect(this.oscillatorGain);

        this.oscillator.start(0);

        Handle(WPM, (value: number) => this.unitTime = 1.2 / value * 1000);
        Handle(CHAR_SPACING, (value: number) => this.charSpacing = value);
        Handle(PITCH, (value: number) => { this.oscillator.frequency.value = value });
        Handle(NOW_PLAYING, (value: boolean) => this.nowPlaying = value);
    }

    public playPattern = async (char: Morse.CharacterInfo): Promise<void> => {
        const on = () => this.oscillatorGain.gain.setTargetAtTime(this.oscillatorVolume, this.audioCtx.currentTime, this.ramp);
        const off = () => this.oscillatorGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, this.ramp);
        const patternComplete = (char: Morse.CharacterInfo) => Trigger(PATTERN_COMPLETE, char);
        const playTone = async (index: number): Promise<void> => {
            if (this.nowPlaying) {
                const delayFactor = char.pattern.charAt(index++) === "." ? 1 : 3;

                on();
                await delay(this.unitTime * delayFactor);
                off();

                if (index >= char.pattern.length)
                    patternComplete(char);
                else {
                    await delay(this.unitTime);
                    await playTone(index);
                }
            }
        }

        if (char == null) {
            patternComplete(null);
        }
        else {
            Trigger(LETTER, char.pattern);

            await playTone(0)
        }
    }
}
