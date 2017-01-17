import {
    Notify, Listen,
    LETTER, PATTERN_COMPLETE, PITCH, TONE_OFF, TONE_ON
} from "./events";
import { Sleep } from "./sleep";
import { Audio, MasterGain } from "./audiocontext";
import { CharacterInfo } from "./morsetable";
import { UnitTime, NowPlaying } from "./timing";

const firefoxAntiClickDelay = navigator.userAgent.indexOf("irefox") !== -1 ? 0.05 : 0;
const oscillatorVolume = 0.9;
const ramp = 0.004;

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
    Notify(TONE_ON, null);
}

function off() {
    oscillatorGain.gain.setTargetAtTime(0, Audio.currentTime + firefoxAntiClickDelay, ramp);
    Notify(TONE_OFF, null);
}

export function PlayPattern(char: CharacterInfo): void {
    if (char == null) {
        console.log("char was null!");
        Notify(PATTERN_COMPLETE, null);
    }
    else {
        Notify(LETTER, char.pattern);

        let pos = 0;

        for (let i = 0; i < char.pattern.length; ++i) {
            const toneDuration = char.pattern[i] === "." ? 1 : 3;
            setTimeout(on, pos);
            pos += UnitTime * toneDuration;
            setTimeout(off, pos);

            pos += UnitTime;
        }

        setTimeout(() => Notify(PATTERN_COMPLETE, char), pos - UnitTime);
    }
}

Listen(PITCH, (value: number) => oscillator.frequency.value = value);
