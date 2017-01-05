import { Audio, MasterGain } from "./audiocontext";
import { CharacterInfo } from "./morsetable";
import {
    Trigger, Handle,
    WPM, CHAR_SPACING, PITCH, NOW_PLAYING, PATTERN_COMPLETE, LETTER
} from "./events";

const firefoxAntiClickDelay = navigator.userAgent.indexOf("irefox") != -1 ? 0.05 : 0.001;
const oscillatorVolume = 0.9;
const ramp = 0.008;

let nowPlaying: boolean;
let charSpacing = 25;
let unitTime: number;

// Wire up audio parts.
// Oscillator frequency will be initialized by UI.
const oscillator = Audio.createOscillator();
const oscillatorGain = Audio.createGain();
oscillatorGain.gain.setValueAtTime(0, Audio.currentTime);
oscillator.connect(oscillatorGain);
oscillatorGain.connect(MasterGain);
oscillator.start(0);

function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export async function PlayPattern(char: CharacterInfo): Promise<void> {
    const on = () => oscillatorGain.gain.setTargetAtTime(oscillatorVolume, Audio.currentTime + firefoxAntiClickDelay, ramp);
    const off = () => oscillatorGain.gain.setTargetAtTime(0, Audio.currentTime + firefoxAntiClickDelay, ramp);
    const patternComplete = (char: CharacterInfo) => Trigger(PATTERN_COMPLETE, char);
    const playTone = async (index: number): Promise<void> => {
        if (nowPlaying) {
            const delayFactor = char.pattern.charAt(index++) === "." ? 1 : 3;

            on();
            await delay(unitTime * delayFactor);
            off();

            if (index >= char.pattern.length)
                patternComplete(char);
            else {
                await delay(unitTime);
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

Handle(WPM, (value: number) => unitTime = 1.2 / value * 1000);
Handle(CHAR_SPACING, (value: number) => charSpacing = value);
Handle(PITCH, (value: number) => { oscillator.frequency.value = value });
Handle(NOW_PLAYING, (value: boolean) => nowPlaying = value);
