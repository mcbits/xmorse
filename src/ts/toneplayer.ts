import {
    Trigger, Handle,
    WPM, CHAR_SPACING, PITCH, NOW_PLAYING, PATTERN_COMPLETE, LETTER
} from "./events";
import { Sleep } from "./sleep";
import { Audio, MasterGain } from "./audiocontext";
import { CharacterInfo } from "./morsetable";

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

function on() {
    oscillatorGain.gain.setTargetAtTime(oscillatorVolume, Audio.currentTime + firefoxAntiClickDelay, ramp);
}

function off() {
    oscillatorGain.gain.setTargetAtTime(0, Audio.currentTime + firefoxAntiClickDelay, ramp);
}

function patternComplete(char: CharacterInfo) {
    Trigger(PATTERN_COMPLETE, char);
}

async function playTone(char: CharacterInfo, index: number): Promise<void> {
    if (nowPlaying) {
        const delayFactor = char.pattern.charAt(index++) === "." ? 1 : 3;

        on();
        await Sleep(unitTime * delayFactor);
        off();

        if (index >= char.pattern.length)
            patternComplete(char);
        else {
            await Sleep(unitTime);
            await playTone(char, index);
        }
    }
}

export async function PlayPattern(char: CharacterInfo): Promise<void> {
    if (char == null) {
        console.log("char was null!");
        patternComplete(null);
    }
    else {
        Trigger(LETTER, char.pattern);

        await playTone(char, 0)
    }
}

Handle(WPM, (value: number) => unitTime = 1.2 / value * 1000);
Handle(CHAR_SPACING, (value: number) => charSpacing = value);
Handle(PITCH, (value: number) => { oscillator.frequency.value = value });
Handle(NOW_PLAYING, (value: boolean) => nowPlaying = value);
