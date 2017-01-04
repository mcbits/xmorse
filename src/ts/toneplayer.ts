import * as Morse from "./morsetable";
import { MorseParams } from "./morseparams";

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export class TonePlayer {
    public oscillatorVolume = 0.9;
    public ramp = 0.01;

    public oscillator = this.audioCtx.createOscillator();
    public oscillatorGain = this.audioCtx.createGain();

    constructor(private audioCtx: AudioContext, private params: MorseParams) {
        // Wire up audio parts
        this.oscillator.frequency.value = params.pitch;
        this.oscillatorGain.gain.value = 0;
        this.oscillator.connect(this.oscillatorGain);

        this.oscillator.start(0);

        document.addEventListener("pitchchange", (evt: CustomEvent) => { this.oscillator.frequency.value = evt.detail });
    }

    public playPattern = async (char: Morse.CharacterInfo): Promise<void> => {
        const on = () => this.oscillatorGain.gain.setTargetAtTime(this.oscillatorVolume, this.audioCtx.currentTime, this.ramp);
        const off = () => this.oscillatorGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, this.ramp);
        const patternComplete = (char: Morse.CharacterInfo) => document.dispatchEvent(new CustomEvent("patterncomplete", { detail: char }));
        const playTone = async (index: number): Promise<void> => {
            if (this.params.nowPlaying()) {
                const delayFactor = char.pattern.charAt(index++) === "." ? 1 : 3;

                on();
                await delay(this.params.unitTime() * delayFactor);
                off();

                if (index >= char.pattern.length)
                    patternComplete(char);
                else {
                    await delay(this.params.unitTime());
                    await playTone(index);
                }
            }
        }

        if (char == null) {
            patternComplete(null);
        }
        else {
            document.dispatchEvent(new CustomEvent("letterchange", { detail: char.pattern }));

            await playTone(0)
        }
    }
}
