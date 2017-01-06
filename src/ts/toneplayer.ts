import {
    Trigger, Handle,
    PITCH, PATTERN_COMPLETE, LETTER
} from "./events";
import { Sleep } from "./sleep";
import { Audio, MasterGain } from "./audiocontext";
import { CharacterInfo } from "./morsetable";
import { UnitTime, NowPlaying } from "./timing";

const firefoxAntiClickDelay = navigator.userAgent.indexOf("irefox") != -1 ? 0.05 : 0.001;
const oscillatorVolume = 0.9;
const ramp = 0.008;

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

async function playTone(char: CharacterInfo, index: number): Promise<void> {
    if (NowPlaying) {
        const delayFactor = char.pattern.charAt(index++) === "." ? 1 : 3;

        on();
        await Sleep(UnitTime * delayFactor);
        off();

        if (index >= char.pattern.length)
            Trigger(PATTERN_COMPLETE, char);
        else {
            await Sleep(UnitTime);
            await playTone(char, index);
        }
    }
}

export async function PlayPattern(char: CharacterInfo): Promise<void> {
    if (char == null) {
        console.log("char was null!");
        Trigger(PATTERN_COMPLETE, null);
    }
    else {
        Trigger(LETTER, char.pattern);

        await playTone(char, 0)
    }
}

Handle(PITCH, (value: number) => { oscillator.frequency.value = value });
